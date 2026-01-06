const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/workoutPlanController');
const { authProtect } = require('../middlewares/authMiddleware');

// get all workout plans
router.get('/workoutPlans', authProtect, workoutPlanController.getAllWorkoutPlans); // Get /workoutPlans

// create a new workout plan
router.post('/workoutPlans', authProtect, workoutPlanController.createWorkoutPlan); // Post /workoutPlans

// get workout plan by ID
router.get('/workoutPlans/:id', authProtect, workoutPlanController.getWorkoutPlanById); // Get /workoutPlans/:id

// update workout plan by ID
router.put('/workoutPlans/:id', authProtect, workoutPlanController.updateWorkoutPlanById); // Put /workoutPlans/:id

// delete workout plan by ID
router.delete('/workoutPlans/:id', authProtect, workoutPlanController.deleteWorkoutPlanById); // Delete /workoutPlans/:id

// delete all workout plans for a specific user
router.delete('/workoutPlans', authProtect, workoutPlanController.deleteUserWorkoutPlans); // Delete /workoutPlans

module.exports = router;