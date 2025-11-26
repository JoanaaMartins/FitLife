const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/workoutPlanController');

// get all exercises
router.get('/users/:user_id/workout-plans', workoutPlanController.getAllWorkoutPlans); // Get /users/:user_id/workout-plans
// create a new workout plan
router.post('/users/:user_id/workout-plans', workoutPlanController.createWorkoutPlan); // Post /users/:user_id/workout-plans
// get workout plan by ID
router.get('/users/:user_id/workout-plans/:id', workoutPlanController.getWorkoutPlanById); // Get /users/:user_id/workout-plans/:id
// update workout plan by ID
router.put('/users/:user_id/workout-plans/:id', workoutPlanController.updateWorkoutPlanById); // Put /users/:user_id/workout-plans/:id
// delete workout plan by ID
router.delete('/users/:user_id/workout-plans/:id', workoutPlanController.deleteWorkoutPlanById); // Delete /users/:user_id/workout-plans/:id

module.exports = router;