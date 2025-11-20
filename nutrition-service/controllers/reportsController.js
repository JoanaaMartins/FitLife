

// o que tem que ter aqui: 
// - Get calorias consuimidas por semana/ dia/ Mes
// - get macros 
// - get evolução 
// - get plano alimentar ativo

const Meal = require('../models/meal');
const MealPlan = require('../models/MealPlan');

exports.getUserReports = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { period = 'day', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    // Definir período automático se não forem fornecidas datas
    if (!startDate || !endDate) {
      switch (period) {
        case 'week':
          dateFilter.date_time = {
            $gte: new Date(now.setDate(now.getDate() - 7)),
            $lte: new Date()
          };
          break;
        case 'month':
          dateFilter.date_time = {
            $gte: new Date(now.setMonth(now.getMonth() - 1)),
            $lte: new Date()
          };
          break;
        default: // day
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dateFilter.date_time = {
            $gte: today,
            $lte: new Date()
          };
      }
    } else {
      dateFilter.date_time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const meals = await Meal.find({ 
      user_id, 
      ...dateFilter 
    }).populate('items.food_id');
    
    // Calcular totais e evolução por dia
    const dailyTotals = {};
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    meals.forEach(meal => {
      const mealDate = meal.date_time.toISOString().split('T')[0];
      
      if (!dailyTotals[mealDate]) {
        dailyTotals[mealDate] = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: 0
        };
      }
      
      meal.items.forEach(item => {
        const food = item.food_id;
        const ratio = item.grams / 100;
        
        const calories = food.kcal_per_100g * ratio;
        const protein = food.protein * ratio;
        const carbs = food.carbs * ratio;
        const fat = food.fat * ratio;
        
        // Totais gerais
        totalCalories += calories;
        totalProtein += protein;
        totalCarbs += carbs;
        totalFat += fat;
        
        // Totais por dia
        dailyTotals[mealDate].calories += calories;
        dailyTotals[mealDate].protein += protein;
        dailyTotals[mealDate].carbs += carbs;
        dailyTotals[mealDate].fat += fat;
      });
      
      dailyTotals[mealDate].meals += 1;
    });
    
    // Buscar plano alimentar ativo
    const activeMealPlan = await MealPlan.findOne({ 
      user_id, 
      isActive: true 
    }).populate('planned_meals.meal_template_id');
    
    const report = {
      period: {
        type: period,
        startDate: dateFilter.date_time.$gte,
        endDate: dateFilter.date_time.$lte
      },
      totals: {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        meals: meals.length
      },
      dailyProgress: Object.entries(dailyTotals).map(([date, totals]) => ({
        date,
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
        meals: totals.meals
      })),
      activeMealPlan: activeMealPlan || null
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Relatório detalhado de macros
exports.getMacroReports = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const meals = await Meal.find({
      user_id,
      date_time: { $gte: startDate, $lte: new Date() }
    }).populate('items.food_id');
    
    const macroReport = {
      period: `${days} days`,
      averageDaily: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      macroDistribution: {
        protein: 0,
        carbs: 0,
        fat: 0
      },
      dailyBreakdown: []
    };
    
    const dailyData = {};
    
    meals.forEach(meal => {
      const date = meal.date_time.toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      
      meal.items.forEach(item => {
        const food = item.food_id;
        const ratio = item.grams / 100;
        
        dailyData[date].calories += food.kcal_per_100g * ratio;
        dailyData[date].protein += food.protein * ratio;
        dailyData[date].carbs += food.carbs * ratio;
        dailyData[date].fat += food.fat * ratio;
      });
    });
    
    // Calcular médias e totais
    const daysCount = Object.keys(dailyData).length || 1;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    Object.entries(dailyData).forEach(([date, macros]) => {
      totalCalories += macros.calories;
      totalProtein += macros.protein;
      totalCarbs += macros.carbs;
      totalFat += macros.fat;
      
      macroReport.dailyBreakdown.push({
        date,
        calories: Math.round(macros.calories),
        protein: Math.round(macros.protein * 10) / 10,
        carbs: Math.round(macros.carbs * 10) / 10,
        fat: Math.round(macros.fat * 10) / 10
      });
    });
    
    macroReport.averageDaily = {
      calories: Math.round(totalCalories / daysCount),
      protein: Math.round((totalProtein / daysCount) * 10) / 10,
      carbs: Math.round((totalCarbs / daysCount) * 10) / 10,
      fat: Math.round((totalFat / daysCount) * 10) / 10
    };
    
    // Distribuição de macros em porcentagem
    const totalMacroCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
    macroReport.macroDistribution = {
      protein: Math.round(((totalProtein * 4) / totalMacroCalories) * 100),
      carbs: Math.round(((totalCarbs * 4) / totalMacroCalories) * 100),
      fat: Math.round(((totalFat * 9) / totalMacroCalories) * 100)
    };
    
    res.json(macroReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};