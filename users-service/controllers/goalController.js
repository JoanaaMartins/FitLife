import db from "../models/db.js";

export const createGoal = async (req, res) => {
  /*  
  #swagger.tags = ['Goals'] 
  #swagger.parameters['body'] = {
  in: 'body',
  description: 'New goal object',
  required: true,
  schema: { $ref: '#/definitions/CreateGoal' }
  }
  #swagger.responses[201] = { description: 'Goal created successfully', schema: {
  $ref: '#/definitions/GetGoal'} }  
  #swagger.responses[400] = { description: 'Bad Request' }
  */
  try {
    const { type, target_value, unit, target_date, status } = req.body;

    const goal = await db.Goal.create({
      user_id: req.user.id,
      type,
      target_value,
      unit,
      target_date,
      status,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllGoals = async (req, res) => {
  /*  
  #swagger.tags = ['Goals'] 
  #swagger.responses[200] = { 
    description: 'Goals found successfully', 
    schema: { 
      type: "array", 
      items: { $ref: "#/definitions/GetGoal" } 
    } 
  } 
  #swagger.responses[404] = { 
    description: 'Goals not found' 
  } 
  */
  try {
    const goals = await db.Goal.findAll({
      where: { user_id: req.user.id },
      include: db.User,
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGoalById = async (req, res) => {
  /*  
  #swagger.tags = ['Goals'] 
  #swagger.responses[200] = { description: 'Goal found successfully', schema: {
  $ref: '#/definitions/GetGoal'} }
  #swagger.responses[404] = { description: 'Goal not found' }
  */
  try {
    const goal = await db.Goal.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: db.User,
    });

    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req, res) => {
  /*  
  #swagger.tags = ['Goals'] 
  #swagger.parameters['body'] = { 
  in: 'body', 
  description: 'Update a Goal',
  required: true,
  schema: { $ref: '#/definitions/CreateGoal' } 
  }
  #swagger.responses[200] = { description: 'Goal updated successfully', schema: { 
  $ref: '#/definitions/GetGoal'} }
  #swagger.responses[404] = { description: 'Goal not found' }
  */
  try {
    const goal = await db.Goal.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.update(req.body);
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  /*  
  #swagger.tags = ['Goals'] 
  #swagger.responses[200] = { description: 'Goal deleted successfully' } 
  #swagger.responses[404] = { description: 'Goal not found' } 
  */
  try {
    const goal = await db.Goal.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.destroy();
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
