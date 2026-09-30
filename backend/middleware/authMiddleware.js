const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

// Use after protect: only administrators may continue
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Access denied. Administrators only.' });
};

module.exports = { protect, adminOnly };
