
// o que tem que ter aqui:
// - Post template de refeição
// - Get todos templates de refeição
// - Patch template de refeição
// - Delete template de refeição 

const MealTemplate = require('../models/MealTemplate');

exports.createMealTemplate = async (req, res) => {
  try {
    const template = new MealTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMealTemplates = async (req, res) => {
  try {
    const templates = await MealTemplate.find().populate('items.food_id');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};