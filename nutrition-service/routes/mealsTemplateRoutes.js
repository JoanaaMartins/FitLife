const express = require('express');
const router = express.Router();

const {
    createMealTemplate,
    getMealTemplates
} = require('../controllers/mealsTemplateController');

router.post('/meal-templates', createMealTemplate);
router.get('/meal-templates', getMealTemplates);

module.exports = router;