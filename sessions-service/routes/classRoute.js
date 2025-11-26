import express from 'express';
import { 
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getAvailableClasses,
  getClassReservations
} from '../controllers/classController.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllClasses);
router.get('/available', getAvailableClasses);
router.get('/:id', getClassById);
router.get('/:id/reservations', getClassReservations);

// Rotas administrativas (CRUD completo)
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;