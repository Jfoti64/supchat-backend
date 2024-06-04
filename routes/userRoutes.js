const express = require('express');
const {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserByUsername,
} = require('../controllers/userController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', authenticateUser, getUser);
router.put('/:id', authenticateUser, updateUser);
router.delete('/:id', authenticateUser, deleteUser);
router.get('/username/:username', authenticateUser, getUserByUsername);

module.exports = router;
