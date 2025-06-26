const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateStatus,
  deleteTask
} = require('../controller/taskcontroller');

const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); 

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteTask);

module.exports = router;
