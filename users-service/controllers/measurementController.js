import db from "../models/db.js";

export const createMeasurement = async (req, res) => {
  /*  
  #swagger.tags = ['Measurements'] 
  #swagger.parameters['body'] = {
  in: 'body',
  description: 'New measurement object',
  required: true,
  schema: { $ref: '#/definitions/CreateMeasurement' }
  }
  #swagger.responses[201] = { description: 'Measurement created successfully', schema: {
  $ref: '#/definitions/GetMeasurement'} }  
  #swagger.responses[400] = { description: 'Bad Request' }
  */
  try {
    const { date, weight_kg, height_cm, body_fat_pct } = req.body;

    const measurement = await db.Measurement.create({
      user_id: req.user.id,
      date,
      weight_kg,
      height_cm,
      body_fat_pct,
    });

    res.status(201).json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMeasurements = async (req, res) => {
  /*  
  #swagger.tags = ['Measurements'] 
  #swagger.responses[200] = { 
    description: 'Measurements found successfully', 
    schema: {
      type: "array",
      items: { $ref: '#/definitions/GetMeasurement' }
    }
  } 
  #swagger.responses[404] = { description: 'Measurements not found' }
  */
  try {
    const measurements = await db.Measurement.findAll({
      where: { user_id: req.user.id },
      include: db.User,
    });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeasurementById = async (req, res) => {
  /*
  #swagger.tags = ['Measurements'] 
  #swagger.responses[200] = { description: 'Measurement found successfully', schema: {
  $ref: '#/definitions/GetMeasurement'} } 
  #swagger.responses[404] = { description: 'Measurement not found' }
  */
  try {
    const measurement = await db.Measurement.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: db.User,
    });

    if (!measurement)
      return res.status(404).json({ error: "Measurement not found" });
    res.json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMeasurement = async (req, res) => {
  /*  
  #swagger.tags = ['Measurements'] 
  #swagger.parameters['body'] = {
  in: 'body',
  description: 'Update a Measurement',
  required: true,
  schema: { $ref: '#/definitions/CreateMeasurement' }
  }
  #swagger.responses[200] = { description: 'Measurement updated successfully', schema: {
  $ref: '#/definitions/GetMeasurement'} }
  #swagger.responses[404] = { description: 'Measurement not found' }
  */
  try {
    const measurement = await db.Measurement.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!measurement)
      return res.status(404).json({ error: "Measurement not found" });

    await measurement.update(req.body);
    res.json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMeasurement = async (req, res) => {
  /*  
  #swagger.tags = ['Measurements'] 
  #swagger.responses[200] = { description: 'Measurement deleted successfully' } 
  #swagger.responses[404] = { description: 'Measurement not found' } 
  */
  try {
    const measurement = await db.Measurement.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!measurement)
      return res.status(404).json({ error: "Measurement not found" });

    await measurement.destroy();
    res.json({ message: "Measurement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
