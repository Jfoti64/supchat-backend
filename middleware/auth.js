const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    console.log(`Decoded token userId: ${decoded.userId}`); // Log the userId from the token

    req.user = user;
    next();
  } catch (err) {
    console.error('Token validation error:', err); // Log the error if token validation fails
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticateUser;
