const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  kcal_per_100g: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});


foodSchema.index({ name: 1 });

module.exports = mongoose.model('Food', foodSchema);