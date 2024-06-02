const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register a new user
exports.registerUser = [
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('family_name').trim().isLength({ min: 1 }).escape(),
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 6 }).escape(), // Ensure password is at least 6 characters long

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        console.error('Username already exists');
        return res.status(400).json({ message: 'Username already exists' });
      }

      const user = new User({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        username: req.body.username,
        password: req.body.password,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token, user });
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).json({ message: 'Error saving user', error: error.message });
    }
  }),
];

// Get a single user by ID
exports.getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});
