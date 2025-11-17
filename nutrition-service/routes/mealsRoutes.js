const express = require('express');
const router = express.Router();

const {
    createMeal,
    getUserMeals,
    updateMeal,
    getUserReports
} = require('../controllers/mealsController');

// Meals routes
router.post('/users/:user_id/meals', createMeal);
router.get('/users/:user_id/meals', getUserMeals);
router.patch('/users/:user_id/meals/:meal_id', updateMeal);




module.exports = router;