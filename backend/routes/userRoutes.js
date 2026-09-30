const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
