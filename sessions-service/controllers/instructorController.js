import db from '../models/db.js';

// GET all instructors
export const getAllInstructors = async (req, res) => {
     /*  
  #swagger.tags = ['Instructors'] 
  #swagger.responses[200] = { description: 'Instructors found successfully', schema: { 
  $ref: '#/definitions/GetInstructor'} } 
  #swagger.responses[404] = { description: 'Instructors not found' } 
  */
  try {
    const instructors = await db.Instructor.findAll();
    res.json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET instructor by ID
export const getInstructorById = async (req, res) => {
  /*
    #swagger.tags = ['Instructors']
    #swagger.responses[200] = {
    description: 'Instructor found successfully',
    schema: { $ref: '#/definitions/GetInstructor'} }
    #swagger.responses[404] = {
    description: 'Instructor not found' }
  */
  try {
    const instructor = await db.Instructor.findByPk(req.params.id, {
      include: [{
        model: db.Class,
        include: [{ model: db.Reservation, attributes: ['id'] }]
      }]
    });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE a new instructor
export const createInstructor = async (req, res) => {
  /*  
    #swagger.tags = ['Instructors']
    #swagger.parameters['body'] = { in: 'body', description: 'New instructor object', required: true,
    schema: { $ref: '#/definitions/CreateInstructor' }
    }
    #swagger.responses[201] = { description: 'Instructor created successfully', schema: {
    $ref: '#/definitions/GetInstructor'} }
    #swagger.responses[400] = { description: 'Bad Request' }
  */
  try {
    const { name, specialty } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const instructor = await db.Instructor.create({ name, specialty });
    res.status(201).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE an instructor
export const updateInstructor = async (req, res) => {
  /*
    #swagger.tags = ['Instructors']
    #swagger.parameters['body'] = { 
    in: 'body', 
    description: 'Update a Instructor',
    required: true, 
    schema: { $ref: '#/definitions/CreateInstructor' } 
    }
    #swagger.responses[200] = { description: 'Instructor updated successfully', schema: { 
    $ref: '#/definitions/GetInstructor'} }
    #swagger.responses[404] = { description: 'Instructor not found' }
  */
  try {
    const instructor = await db.Instructor.findByPk(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    const { name, specialty } = req.body;

    await instructor.update({ name, specialty });
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE an instructor
export const deleteInstructor = async (req, res) => {
  /*
    #swagger.tags = ['Instructors']
    #swagger.responses[200] = { description: 'Instructor deleted successfully' }
    #swagger.responses[404] = { description: 'Instructor not found' }
  */
  try {
    const instructor = await db.Instructor.findByPk(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    await instructor.destroy();
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET all classes of a specific instructor
export const getInstructorClasses = async (req, res) => {
  /*
    #swagger.tags = ['Instructors']
    #swagger.responses[200] = { description: 'Instructor classes retrieved successfully', schema: {
    $ref: '#/definitions/GetClass'} }
    #swagger.responses[404] = { description: 'Instructor not found' }
  */
  try {
    const instructor = await db.Instructor.findByPk(req.params.id, {
      include: [{
        model: db.Class,
        include: [{ model: db.Reservation, attributes: ['id'] }]
      }]
    });

    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    // Include reservation count and available spots for each class
    const classesWithAvailability = instructor.Classes.map(cls => ({
      ...cls.toJSON(),
      reservation_count: cls.Reservations.length,
      available_spots: cls.capacity - cls.Reservations.length,
      is_available: (cls.capacity - cls.Reservations.length) > 0
    }));

    res.json(classesWithAvailability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
