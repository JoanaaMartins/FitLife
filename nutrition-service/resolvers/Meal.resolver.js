const Meal = require('../models/meal');
const { AuthenticationError } = require('apollo-server');

const resolvers = {


  Query: {
    myMeals: async (_, { date }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'user') {
          throw new AuthenticationError('Apenas utilizadores podem ver as suas refeições');
        }
        
        let filter = { user_id: context.user.id };
        
        if (date) {
          const startDate = new Date(date);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(date);
          endDate.setHours(23, 59, 59, 999);
          
          filter.date_time = {
            $gte: startDate,
            $lte: endDate
          };
        }
        
        const meals = await Meal.find(filter).sort({ date_time: -1 });
        return meals;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    myMeal: async (_, { meal_id }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        const meal = await Meal.findOne({
          _id: meal_id,
          user_id: context.user.id
        });
        
        if (!meal) {
          throw new Error('Refeição não encontrada');
        }
        
        return meal;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    myDailySummary: async (_, { date }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'user') {
          throw new AuthenticationError('Apenas utilizadores podem ver as suas calorias');
        }
        
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const meals = await Meal.find({
          user_id: context.user.id,
          date_time: {
            $gte: startDate,
            $lte: endDate
          }
        }).sort({ date_time: 1 });
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        meals.forEach(meal => {
          meal.items.forEach(item => {
            totalCalories += item.calories || 0;
            totalProtein += item.protein || 0;
            totalCarbs += item.carbs || 0;
            totalFat += item.fat || 0;
          });
        });
        
        return {
          date: date,
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalCarbs: Math.round(totalCarbs * 10) / 10,
          totalFat: Math.round(totalFat * 10) / 10,
          meals: meals
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    userMealsByDate: async (_, { user_id, date }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if ( context.user.role !== 'instructor') {
          throw new AuthenticationError('Acesso negado - apenas instrutores');
        }
        
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const meals = await Meal.find({
          user_id: user_id,
          date_time: {
            $gte: startDate,
            $lte: endDate
          }
        }).sort({ date_time: 1 });
        
        return meals;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    userDailySummary: async (_, { user_id, date }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'instructor') {
          throw new AuthenticationError('Acesso negado - apenas instrutores');
        }
        
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const meals = await Meal.find({
          user_id: user_id,
          date_time: {
            $gte: startDate,
            $lte: endDate
          }
        }).sort({ date_time: 1 });
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        meals.forEach(meal => {
          meal.items.forEach(item => {
            totalCalories += item.calories || 0;
            totalProtein += item.protein || 0;
            totalCarbs += item.carbs || 0;
            totalFat += item.fat || 0;
          });
        });
        
        return {
          date: date,
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalCarbs: Math.round(totalCarbs * 10) / 10,
          totalFat: Math.round(totalFat * 10) / 10,
          meals: meals
        };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
  
  Mutation: {
    createMeal: async (_, { input }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'user') {
          throw new AuthenticationError('Apenas utilizadores podem criar refeições');
        }
        
        const mealData = {
          user_id: context.user.id,
          date_time: input.date_time ? new Date(input.date_time) : new Date(),
          meal_type: input.meal_type,
          items: input.items
        };
        
        const meal = new Meal(mealData);
        await meal.save();
        
        return meal;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateMeal: async (_, { meal_id, input }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'user') {
          throw new AuthenticationError('Apenas utilizadores podem editar refeições');
        }
        
        const updateData = { ...input };
        if (input.date_time) {
          updateData.date_time = new Date(input.date_time);
        }
        
        const meal = await Meal.findOneAndUpdate(
          { _id: meal_id, user_id: context.user.id },
          updateData,
          { new: true, runValidators: true }
        );
        
        if (!meal) {
          throw new Error('Refeição não encontrada ou não autorizada');
        }
        
        return meal;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteMeal: async (_, { meal_id }, context) => {
      try {
        if (!context.user) throw new AuthenticationError('Não autenticado');
        
        if (context.user.role !== 'user') {
          throw new AuthenticationError('Apenas utilizadores podem eliminar refeições');
        }
        
        const meal = await Meal.findOneAndDelete({ 
          _id: meal_id, 
          user_id: context.user.id 
        });
        
        if (!meal) {
          throw new Error('Refeição não encontrada ou não autorizada');
        }
        
        return { success: true, message: 'Refeição eliminada com sucesso' };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
};

module.exports = resolvers;