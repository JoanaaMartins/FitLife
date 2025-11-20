const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  food_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  grams: {
    type: Number,
    required: true
  }
});

const mealSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  date_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  meal_type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    trim: true
  },
  items: [mealItemSchema]
}, {
  timestamps: true
});

// Middleware para calcular macros automaticamente
mealSchema.methods.calculateMacros = async function() {
  const Meal = mongoose.model('Meal');
  const Food = mongoose.model('Food');
  
  let totalKcal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  for (const item of this.items) {
    const food = await Food.findById(item.food_id);
    if (food) {
      const factor = item.grams / 100;
      totalKcal += food.kcal_per_100g * factor;
      totalProtein += food.protein * factor;
      totalCarbs += food.carbs * factor;
      totalFat += food.fat * factor;
    }
  }
  
  return {
    kcal: Math.round(totalKcal),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10
  };
};

// Virtual para macros (não persiste na BD)
mealSchema.virtual('macros').get(async function() {
  return await this.calculateMacros();
});

module.exports = mongoose.model('Meal', mealSchema);