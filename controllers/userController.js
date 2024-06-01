const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register a new user
exports.registerUser = [
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('family_name').trim().isLength({ min: 1 }).escape(),
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 6 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
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
  }),
];

// Get a single user by ID
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});
