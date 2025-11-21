import db from '../models/db.js';
import { Op } from 'sequelize';

// GET all reservations (public)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await db.Reservation.findAll({
      include: [
        {
          model: db.Class,
          include: [db.Instructor]
        }
      ]
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET reservation by ID (public)
export const getReservationById = async (req, res) => {
  try {
    const reservation = await db.Reservation.findByPk(req.params.id, {
      include: [
        {
          model: db.Class,
          include: [db.Instructor]
        }
      ]
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE reservation (protected)
export const createReservation = async (req, res) => {
  try {
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({ error: 'class_id is required' });
    }

    const classItem = await db.Class.findByPk(class_id, {
      include: [{ model: db.Reservation }]
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check class capacity
    if (classItem.Reservations.length >= classItem.capacity) {
      return res.status(400).json({ error: 'Class is full' });
    }

    const reservation = await db.Reservation.create({
      user_id: req.user.id,
      user_email: req.user.email,
      class_id,
      status: 'confirmed'
    });

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE reservation (public)
export const updateReservation = async (req, res) => {
  try {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await reservation.update(req.body);
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE reservation (public)
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    await reservation.destroy();
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET reservations of logged-in user (protected)
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await db.Reservation.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: db.Class,
          include: [db.Instructor]
        }
      ]
    });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CANCEL reservation (protected)
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await db.Reservation.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found or does not belong to user' });
    }

    await reservation.update({ status: 'cancelled' });
    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
