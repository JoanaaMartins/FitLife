// CRUD Básico
export const getAllClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll({
      include: [db.Instructor]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id, {
      include: [db.Instructor]
    });
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createClass = async (req, res) => {
  try {
    const classItem = await db.Class.create(req.body);
    res.status(201).json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    
    await classItem.update(req.body);
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    
    await classItem.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Funções Adicionais
export const getAvailableClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll({
      include: [
        {
          model: db.Instructor,
          attributes: ['id', 'name', 'specialty']
        },
        {
          model: db.Reservation,
          attributes: ['id']
        }
      ],
      where: {
        start_time: { [db.Sequelize.Op.gte]: new Date() }
      }
    });
    
    const availableClasses = classes.map(classItem => ({
      ...classItem.toJSON(),
      reservation_count: classItem.Reservations.length,
      available_spots: classItem.capacity - classItem.Reservations.length,
      is_available: (classItem.capacity - classItem.Reservations.length) > 0
    }));
    
    res.json(availableClasses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClassReservations = async (req, res) => {
  try {
    const classItem = await db.Class.findByPk(req.params.id, {
      include: [{
        model: db.Reservation
      }]
    });
    
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem.Reservations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};