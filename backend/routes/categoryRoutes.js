const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const c = require('../controllers/categoryController');

router.use(protect);
// Any logged-in user can view categories (needed for the product filter)
router.get('/', c.getCategories);
router.get('/:id', c.getCategory);
// Only administrators can manage categories
router.post('/', adminOnly, c.createCategory);
router.route('/:id').put(adminOnly, c.updateCategory).delete(adminOnly, c.deleteCategory);

module.exports = router;
