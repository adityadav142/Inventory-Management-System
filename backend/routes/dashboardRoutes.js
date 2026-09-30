const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getStats, getUserStats } = require('../controllers/dashboardController');

router.get('/stats', protect, adminOnly, getStats); // admin dashboard
router.get('/user-stats', protect, getUserStats); // user dashboard (basic summary)

module.exports = router;
