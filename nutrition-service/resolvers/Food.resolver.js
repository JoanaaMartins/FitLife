const Food = require('../models/food');

module.exports = {
  Query: {
    foods: async (_, { search }, context) => {
      try {
        if (!context.user) throw new Error('Não autenticado');
        
        let query = {};
        
        if (search && search.trim().length > 0) {
          query.name = { $regex: search.trim(), $options: 'i' };
        }
        
        const foods = await Food.find(query).sort({ name: 1 });
        
        return foods;
        
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
  
  Mutation: {
    createFood: async (_, { input }, context) => {
      try {
        if (!context.user) throw new Error('Não autenticado');
        
        if (context.user.role !== 'instructor') {
          throw new Error('Apenas instrutores podem criar alimentos');
        }
        
        const food = new Food(input);
        await food.save();
        
        return food;
        
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateFood: async (_, { food_id, input }, context) => {
      try {
        if (!context.user) throw new Error('Não autenticado');
        
        if (context.user.role !== 'instructor') {
          throw new Error('Apenas instrutores podem editar alimentos');
        }
        
        const food = await Food.findByIdAndUpdate(
          food_id,
          input,
          { new: true, runValidators: true }
        );
        
        if (!food) {
          throw new Error('Food not found');
        }
        
        return food;
        
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteFood: async (_, { food_id }, context) => {
      try {
        if (!context.user) throw new Error('Não autenticado');
        
        if (context.user.role !== 'instructor') {
          throw new Error('Apenas instrutores podem deletar alimentos');
        }
        
        const food = await Food.findByIdAndDelete(food_id);
        
        if (!food) {
          throw new Error('Food not found');
        }
        
        return { success: true, message: 'Food deleted successfully' };
        
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
};