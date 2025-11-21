import db from '../models/db.js';
import { Op } from 'sequelize';

// GET all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll({
      include: [db.Instructor]
    });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET a class by ID
export const getClassById = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id, {
      include: [db.Instructor]
    });
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE a new class
export const createClass = async (req, res) => {
  try {
    const { title, instructor_id, start_time, end_time, capacity, type } = req.body;

    // Validate required fields
    if (!title || !instructor_id || !start_time || !end_time || !capacity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if instructor exists
    const instructor = await db.Instructor.findByPk(instructor_id);
    if (!instructor) {
      return res.status(400).json({ error: 'Instructor not found' });
    }

    const classItem = await db.Class.create({
      title,
      instructor_id,
      start_time,
      end_time,
      capacity,
      type: type || 'present'
    });

    // Return the class with instructor info
    const classWithInstructor = await db.Class.findByPk(classItem.id, {
      include: [db.Instructor]
    });

    res.status(201).json(classWithInstructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a class
export const updateClass = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    const { title, instructor_id, start_time, end_time, capacity, type } = req.body;

    // Optionally validate instructor
    if (instructor_id) {
      const instructor = await db.Instructor.findByPk(instructor_id);
      if (!instructor) return res.status(400).json({ error: 'Instructor not found' });
    }

    await classItem.update({ title, instructor_id, start_time, end_time, capacity, type });

    const updatedClass = await db.Class.findByPk(classItem.id, { include: [db.Instructor] });

    res.json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a class
export const deleteClass = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    await classItem.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET available classes
export const getAvailableClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll({
      include: [
        { model: db.Instructor, attributes: ['id', 'name', 'specialty'] },
        { model: db.Reservation, attributes: ['id'] }
      ],
      where: {
        start_time: { [Op.gte]: new Date() }
      }
    });

    const availableClasses = classes.map(cls => ({
      ...cls.toJSON(),
      reservation_count: cls.Reservations.length,
      available_spots: cls.capacity - cls.Reservations.length,
      is_available: (cls.capacity - cls.Reservations.length) > 0
    }));

    res.json(availableClasses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET reservations for a class
export const getClassReservations = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id, {
      include: [{ model: db.Reservation }]
    });
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    res.json(classItem.Reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
