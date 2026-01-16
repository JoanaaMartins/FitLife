import db from "../models/db.js";
import { publishEvent } from "../rabbitmq/producer.js";

// GET all reservations (public)
export const getAllReservations = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations'] 
    #swagger.responses[200] = { description: 'Reservations found successfully', schema: {
    $ref: '#/definitions/GetReservation'} } 
    #swagger.responses[404] = { description: 'Reservations not found' }
  */
  try {
    const reservations = await db.Reservation.findAll({
      include: [
        {
          model: db.Class,
          include: [db.Instructor],
        },
      ],
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET reservation by ID (public)
export const getReservationById = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations']
    #swagger.responses[200] = { description: 'Reservation found successfully', schema: {
    $ref: '#/definitions/GetReservation'} } 
    #swagger.responses[404] = { description: 'Reservation not found' }
  */
  try {
    const reservation = await db.Reservation.findByPk(req.params.id, {
      include: [
        {
          model: db.Class,
          include: [db.Instructor],
        },
      ],
    });
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CREATE reservation (protected)
export const createReservation = async (req, res) => {
  /*
    #swagger.tags = ['Reservations']
    #swagger.parameters['body'] = { in: 'body', description: 'New reservation object', required: true,
    schema: { $ref: '#/definitions/CreateReservation' }
    }
    #swagger.responses[201] = { description: 'Reservation created successfully', schema: {
    $ref: '#/definitions/GetReservation'} }
    #swagger.responses[400] = { description: 'Bad Request' }
    #swagger.responses[404] = { description: 'Class not found' }
  */
  try {
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({ error: "class_id is required" });
    }

    const classItem = await db.Class.findByPk(class_id, {
      include: [{ model: db.Reservation }],
    });

    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check class capacity
    if (classItem.Reservations.length >= classItem.capacity) {
      return res.status(400).json({ error: "Class is full" });
    }

    const reservation = await db.Reservation.create({
      class_id,
      user_id: req.user.id,
      status: "confirmed",
    });

    await publishEvent("reservation.confirmed", {
      reservationId: reservation.id,
      userId: reservation.user_id,
      classId: reservation.class_id,
      status: reservation.status,
      timestamp: new Date(),
    });

    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE reservation (public)
export const updateReservation = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations']
    #swagger.parameters['body'] = { in: 'body', description: 'Update a Reservation',
    required: true, schema: { $ref: '#/definitions/CreateReservation' }
    }
    #swagger.responses[200] = { description: 'Reservation updated successfully', schema: {
    $ref: '#/definitions/GetReservation'} }
    #swagger.responses[404] = { description: 'Reservation not found' }
  */
  try {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });

    await reservation.update(req.body);
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE reservation (public)
export const deleteReservation = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations']
    #swagger.responses[200] = { description: 'Reservation deleted successfully' }
    #swagger.responses[404] = { description: 'Reservation not found' }
  */
  try {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });

    await reservation.destroy();
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET reservations of logged-in user (protected)
export const getUserReservations = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations']
    #swagger.responses[200] = { description: 'User reservations retrieved successfully', schema: {
    $ref: '#/definitions/GetReservation'} }
  */
  try {
    const reservations = await db.Reservation.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: db.Class,
          include: [db.Instructor],
        },
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CANCEL reservation (protected)
export const cancelReservation = async (req, res) => {
  /*  
    #swagger.tags = ['Reservations']
    #swagger.responses[200] = { description: 'Reservation cancelled successfully', schema: {
    $ref: '#/definitions/GetReservation'} }
    #swagger.responses[404] = { description: 'Reservation not found or does not belong to user' }
  */
  try {
    const reservation = await db.Reservation.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!reservation) {
      return res
        .status(404)
        .json({ error: "Reservation not found or does not belong to user" });
    }

    await reservation.update({ status: "cancelled" });

    await publishEvent("reservation.cancelled", {
     reservationId: reservation.id,
      userId: reservation.user_id,
      classId: reservation.class_id,
      status: "cancelled",
      timestamp: new Date(),
    });
    res.json({ message: "Reservation cancelled successfully", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
