const User = require('../models/User');

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

// GET /api/users/profile
exports.getProfile = (req, res) => {
  res.json({ success: true, data: publicUser(req.user) });
};

// PUT /api/users/profile   body: { name, email, currentPassword?, newPassword? }
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const bad = (message) => res.status(400).json({ success: false, message });

    if (typeof name !== 'string' || !name.trim()) return bad('Name is required');
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) return bad('A valid email is required');

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newEmail = email.toLowerCase().trim();
    if (newEmail !== user.email && (await User.findOne({ email: newEmail }))) {
      return bad('Email is already in use');
    }

    // Password is only changed when a new one is supplied - and only with the correct current password
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return bad('New password must be at least 6 characters');
      }
      if (typeof currentPassword !== 'string' || !(await user.matchPassword(currentPassword))) {
        return bad('Current password is incorrect');
      }
      user.password = newPassword; // hashed by the model before saving
    }

    user.name = name.trim();
    user.email = newEmail;
    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', data: publicUser(user) });
  } catch (err) {
    next(err);
  }
};
