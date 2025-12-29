const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user_ids: [String],
  name: String,
  schedule: [{          
    time: String,       
    description: String 
  }],
  start_date: String,
  end_date: String,
  total_calories: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);