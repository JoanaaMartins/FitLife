const express = require('express');
const router = express.Router();

const {
    createMealTemplate,
    getMealTemplates,
    updateMealTemplate,
    deleteMealTemplate
} = require('../controllers/mealsTemplateController');

router.post('/meal-templates', createMealTemplate);
router.get('/meal-templates', getMealTemplates); 
router.patch('/meal-templates/:template_id', updateMealTemplate);
router.delete('/meal-templates/:template_id', deleteMealTemplate);

module.exports = router;