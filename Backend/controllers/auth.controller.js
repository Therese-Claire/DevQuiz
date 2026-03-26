const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpError = require('../utils/httpError');

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return next(httpError(400, 'VALIDATION_ERROR', 'Username, email, and password are required'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(httpError(400, 'INVALID_EMAIL', 'Email format is invalid'));
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return next(httpError(409, 'CONFLICT', 'User already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return next(httpError(400, 'VALIDATION_ERROR', 'Email and password are required'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(httpError(400, 'INVALID_EMAIL', 'Email format is invalid'));
    }

    const user = await User.findOne({
      email,
    });
    if (!user) {
      return next(httpError(401, 'INVALID_EMAIL', 'Email not found'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(httpError(401, 'INVALID_PASSWORD', 'Incorrect password'));
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
        email: user.email,
        isAdmin: user.isAdmin,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    next(error);
  }
};
