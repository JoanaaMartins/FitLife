import db from "../models/db.js";

export const createMeasurement = async (req, res) => {
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
  try {
    const measurements = await db.Measurement.findAll({
      where: { user_id: req.user.id },
      include: User,
    });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeasurementById = async (req, res) => {
  try {
    const measurement = await db.Measurement.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: User,
    });

    if (!measurement)
      return res.status(404).json({ error: "Measurement not found" });
    res.json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMeasurement = async (req, res) => {
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
