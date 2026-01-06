const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  grams: {
    type: Number,
    required: true,
    min: 0
  },
  calories: {
    type: Number,
    default: 0,
    min: 0
  },
  protein: {
    type: Number,
    default: 0,
    min: 0
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0
  },
  fat: {
    type: Number,
    default: 0,
    min: 0
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
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER'],
    default: 'OTHER',
    uppercase: true,
    trim: true
  },
  items: [mealItemSchema]
}, {
  timestamps: true
});

mealSchema.virtual('totalCalories').get(function() {
  return this.items.reduce((sum, item) => sum + (item.calories || 0), 0);
});

mealSchema.virtual('totalProtein').get(function() {
  return this.items.reduce((sum, item) => sum + (item.protein || 0), 0);
});

mealSchema.virtual('totalCarbs').get(function() {
  return this.items.reduce((sum, item) => sum + (item.carbs || 0), 0);
});

mealSchema.virtual('totalFat').get(function() {
  return this.items.reduce((sum, item) => sum + (item.fat || 0), 0);
});

mealSchema.set('toJSON', { virtuals: true });
mealSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Meal', mealSchema);