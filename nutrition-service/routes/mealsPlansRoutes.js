const express = require('express');
const router = express.Router();

const {
    createMealPlan,
    getUserMealPlans,
    updateMealPlan,
    deleteMealPlan,
    setActiveMealPlan
} = require('../controllers/mealsPlansController');

// Meal Plans routes
router.post('/users/:user_id/meal-plans', createMealPlan);
router.get('/users/:user_id/meal-plans', getUserMealPlans);
router.patch('/users/:user_id/meal-plans/:plan_id', updateMealPlan);
router.delete('/users/:user_id/meal-plans/:plan_id', deleteMealPlan);
router.patch('/users/:user_id/meal-plans/:plan_id/active', setActiveMealPlan);

module.exports = router;