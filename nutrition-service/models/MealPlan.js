const mongoose = require('mongoose');

const plannedMealSchema = new mongoose.Schema({
  meal_template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealTemplate',
    required: true
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
  }
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

// Índices para melhor performance
mealPlanSchema.index({ user_id: 1, isActive: 1 });
mealPlanSchema.index({ user_id: 1, start_date: 1, end_date: 1 });

// Middleware para garantir que apenas um plano está ativo por utilizador
mealPlanSchema.pre('save', async function(next) {
  if (this.isActive) {
    const MealPlan = mongoose.model('MealPlan');
    try {
      // Desativar outros planos ativos do mesmo utilizador
      await MealPlan.updateMany(
        { user_id: this.user_id, isActive: true, _id: { $ne: this._id } },
        { isActive: false }
      );
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);