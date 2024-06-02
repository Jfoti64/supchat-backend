const express = require('express');
const {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
