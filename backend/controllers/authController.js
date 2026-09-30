const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const userData = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role });
const isBlank = (v) => typeof v !== 'string' || !v.trim();

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (isBlank(name) || isBlank(email) || isBlank(password)) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }
    // Public registration always creates a normal user. Admins are created via seed / database.
    const user = await User.create({ name, email, password, role: 'user' });
    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { token: generateToken(user), user: userData(user) },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const invalid = { success: false, message: 'Invalid email or password' };
    if (isBlank(email) || isBlank(password)) return res.status(401).json(invalid);

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json(invalid);

    res.json({
      success: true,
      message: 'Login successful',
      data: { token: generateToken(user), user: userData(user) },
    });
  } catch (err) {
    next(err);
  }
};
