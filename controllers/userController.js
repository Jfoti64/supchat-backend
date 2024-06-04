const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const upload = require('../middleware/upload');

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

// Update a user by ID
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete a user by ID
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// User login
exports.loginUser = [
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log(`Generated Token: ${token}`); // Log the generated token

    res.status(200).json({ token, user, message: 'User login successful' });
  }),
];

// Get user by username
exports.getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ message: 'Error finding user', error: error.message });
  }
});

// Update a user by ID to include profile picture
exports.uploadProfilePicture = [
  upload,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { profile_picture: req.file.filename },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user profile picture:', error);
      return res
        .status(500)
        .json({ message: 'Error updating user profile picture', error: error.message });
    }
  }),
];
