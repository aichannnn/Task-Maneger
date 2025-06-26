const Task = require('../model/Task');
const jwt = require('jsonwebtoken');

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

exports.createTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const task = await Task.create({
      ...req.body,
      user: userId, 
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const { status, assignedTo } = req.query;
    const filter = { user: userId };

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId }, 
      { status: req.body.status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
