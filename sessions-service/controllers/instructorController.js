import db from '../models/db.js';

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await db.Instructor.findAll();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const instructor = await db.Instructor.findByPk(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createInstructor = async (req, res) => {
  try {
    const instructor = await db.Instructor.create(req.body);
    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const instructor = await db.Instructor.findByPk(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    
    await instructor.update(req.body);
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await db.Instructor.findByPk(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    
    await instructor.destroy();
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Funções Adicionais
export const getInstructorClasses = async (req, res) => {
  try {
    const instructor = await db.Instructor.findByPk(req.params.id, {
      include: [{
        model: db.Class,
        include: [{
          model: db.Reservation,
          attributes: ['id']
        }]
      }]
    });
    
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor.Classes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};