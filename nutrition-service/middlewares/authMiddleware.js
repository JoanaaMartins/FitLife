const Food = require('../models/food');

module.exports = {
  Query: {
    foods: async (_, { search }) => {
      try {
        let query = {};
        if (search) {
          query.name = { $regex: search, $options: 'i' };
        }
        const foods = await Food.find(query);
        return foods;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    food: async (_, { food_id }) => {
      try {
        const food = await Food.findById(food_id);
        if (!food) {
          throw new Error('Food not found');
        }
        return food;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    foodsByName: async (_, { food_name }) => {
      try {
        const foods = await Food.find({ 
          name: { $regex: food_name, $options: 'i' } 
        });
        return foods;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
  
  Mutation: {
    createFood: async (_, { input }) => {
      try {
        const food = new Food(input);
        await food.save();
        return food;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateFood: async (_, { food_id, input }) => {
      try {
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

    deleteFood: async (_, { food_id }) => {
      try {
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