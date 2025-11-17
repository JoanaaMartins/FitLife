const Food = require('../models/food');
// o que tem que ter aqui:
// - Post alimento  ✅
// - Patch alimento 
// - Get todos alimentos ✅
// - Get alimento e ver os valores nutricionais
// - get alimento por nome
// - Delete alimento


exports.getFoods = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

// exports.editFood = async (req, res) => {  
//   try { 
//     const { food_id } = req.params;
//     const food = await Food.findByIdAndUpdate(
//       food_id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!food) {
//       return res.status(404).json({ error: 'Food not found' });
//     }
//     res.json(food);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// }; 

