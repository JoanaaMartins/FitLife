const mongoose = require('mongoose');

const templateItemSchema = new mongoose.Schema({
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

const mealTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  items: [templateItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('MealTemplate', mealTemplateSchema);