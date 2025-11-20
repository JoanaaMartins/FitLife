import express from 'express';
import { 
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructorClasses
} from '../controllers/instructorController.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);
router.get('/:id/classes', getInstructorClasses);

// Rotas administrativas (CRUD completo)
router.post('/', createInstructor);
router.put('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

export default router;