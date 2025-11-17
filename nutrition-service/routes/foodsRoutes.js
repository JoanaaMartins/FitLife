const express = require('express');
const router = express.Router();
const {
  getFoods,
  createFood
} = require('../controllers/foodsController');

router.get('/foods', getFoods);
router.post('/foods', createFood);

// router.patch('/foods/:food_id', editFood); 
// router.get('/foods/:food_id', getFoodById);
// router.get('/foods/name/:food_name', getFoodByName);
// router.delete('/foods/:food_id', deleteFood);

module.exports = router;