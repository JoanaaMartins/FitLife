const express = require('express');
const router = express.Router();

const {
    getUserReports,
    getMacroReports
} = require('../controllers/reportsController');

// Reports routes   
router.get('/users/:user_id/reports', getUserReports);
router.get('/users/:user_id/reports/macros', getMacroReports);

module.exports = router;