const express = require('express');
const router = express.Router();

const {getUserReports} = require('../controllers/mealsController');

// Reports routes   
router.get('/users/:user_id/reports', getUserReports);
module.exports = router;