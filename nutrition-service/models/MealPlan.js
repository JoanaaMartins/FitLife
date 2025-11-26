const mongoose = require('mongoose');

const plannedMealSchema = new mongoose.Schema({
  meal_name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  scheduled_date: {
    type: Date,
    required: true
  },
  meal_type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    trim: true
  },
  // Campos adicionais úteis
  calories: {
    type: Number,
    default: 0
  },
  ingredients: [{
    name: String,
    quantity: String
  }]
});

const mealPlanSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  planned_meals: [plannedMealSchema],
  isActive: {
    type: Boolean,
    default: false
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

mealPlanSchema.index({ user_id: 1, isActive: 1 });
mealPlanSchema.index({ user_id: 1, start_date: 1, end_date: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);