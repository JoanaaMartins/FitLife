const Meal = require('../models/meal');

// o que tem que ter aqui:
// - Post refeiçoes com hora e data ✅
// - Patch refeiçoes ✅
// - Get refeiçoes por dia e user ✅
// - Get calculo nutricional diario ()

exports.createMeal = async (req, res) => {
  try {
    const { user_id } = req.params;
    const mealData = { ...req.body, user_id };
    const meal = new Meal(mealData);
    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    const { user_id } = req.params;
    const meals = await Meal.find({ user_id }).populate('items.food_id');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMeal = async (req, res) => {
    try {
      const { user_id, meal_id } = req.params;
      const meal = await Meal.findOneAndUpdate(
        { _id: meal_id, user_id },
        req.body,
        { new: true, runValidators: true }
      ).populate('items.food_id');
      
      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.json(meal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Reports Controller
exports.getUserReports = async (req, res) => {
    try {
      const { user_id } = req.params;
      const { startDate, endDate } = req.query;
      
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter.date_time = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      const meals = await Meal.find({ 
        user_id, 
        ...dateFilter 
      }).populate('items.food_id');
      
      // Calcular totais
      const report = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: meals.length
      };
      
      meals.forEach(meal => {
        meal.items.forEach(item => {
          const food = item.food_id;
          const ratio = item.grams / 100;
          
          report.totalCalories += food.kcal_per_100g * ratio;
          report.totalProtein += food.protein * ratio;
          report.totalCarbs += food.carbs * ratio;
          report.totalFat += food.fat * ratio;
        });
      });
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};