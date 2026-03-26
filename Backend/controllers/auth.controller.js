const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpError = require('../utils/httpError');

exports.registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return next(httpError(400, 'VALIDATION_ERROR', 'Username and password are required'));
    }

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return next(httpError(409, 'CONFLICT', 'User already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });

  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(httpError(400, 'VALIDATION_ERROR', 'Username and password are required'));
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(httpError(401, 'INVALID_CREDENTIALS', 'Invalid credentials'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(httpError(401, 'INVALID_CREDENTIALS', 'Invalid credentials'));
    }

    if (!process.env.JWT_SECRET) {
      return next(httpError(500, 'CONFIG_ERROR', 'JWT secret not configured'));
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    next(error);
  }
};
