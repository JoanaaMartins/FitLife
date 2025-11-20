// O que tem que ter aqui: 
// - Post plano de alimentação (pequeno-almoco, lanche1 ... almoco etc) ✅
// - patch plano alimentar ✅
// - get planos alimentares ✅
// - delete plano alimentar ✅
// - mudar plano alimentar ativo  ✅

const MealPlan = require('../models/MealPlan');

exports.createMealPlan = async (req, res) => {
  try {
    const { user_id } = req.params;
    const mealPlanData = { ...req.body, user_id };
    
    const mealPlan = new MealPlan(mealPlanData);
    await mealPlan.save();
    
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserMealPlans = async (req, res) => {
  try {
    const { user_id } = req.params;
    const mealPlans = await MealPlan.find({ user_id })
      .populate('planned_meals.meal_template_id');
    
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const { user_id, plan_id } = req.params;
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: plan_id, user_id },
      req.body,
      { new: true, runValidators: true }
    ).populate('planned_meals.meal_template_id');
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const { user_id, plan_id } = req.params;
    const mealPlan = await MealPlan.findOneAndDelete({ 
      _id: plan_id, 
      user_id 
    });
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setActiveMealPlan = async (req, res) => {
  try {
    const { user_id, plan_id } = req.params;
    
    // Primeiro desativa todos os planos do usuário
    await MealPlan.updateMany(
      { user_id, isActive: true },
      { isActive: false }
    );
    
    // Ativa o plano específico
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: plan_id, user_id },
      { isActive: true },
      { new: true }
    ).populate('planned_meals.meal_template_id');
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
