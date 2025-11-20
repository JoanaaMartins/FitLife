const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/workoutPlanController');

// Route to get all exercises
router.get('/users/:user_id/workout-plans', workoutPlanController.getAllWorkoutPlans); // Get /workout-plans
// Route to create a new workout plan
router.post('/users/:user_id/workout-plans', workoutPlanController.createWorkoutPlan); // Post /workout-plans

module.exports = router;