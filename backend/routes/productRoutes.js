const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const c = require('../controllers/productController');

router.use(protect);
// Any logged-in user can view products
router.get('/', c.getProducts);
router.get('/:id', c.getProduct);
// Only administrators can change products or stock
router.post('/', adminOnly, c.createProduct);
router.route('/:id').put(adminOnly, c.updateProduct).delete(adminOnly, c.deleteProduct);
router.patch('/:id/stock', adminOnly, c.updateStock);

module.exports = router;
