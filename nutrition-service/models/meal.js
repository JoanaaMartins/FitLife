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
  items: [mealItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);