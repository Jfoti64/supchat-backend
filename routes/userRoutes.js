const express = require('express');
const { registerUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/:id', getUser);

module.exports = router;
