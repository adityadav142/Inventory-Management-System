const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, stock, lowStock, outOfStock, recentProducts] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Product.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
        Product.countDocuments({ quantity: { $gte: 1, $lte: 10 } }),
        Product.countDocuments({ quantity: 0 }),
        Product.find().populate('category', 'name').sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalStock: stock.length ? stock[0].total : 0,
        lowStock,
        outOfStock,
        recentProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/user-stats  (any logged-in user - basic summary only)
exports.getUserStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, available, lowStock, outOfStock, recentProducts] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Product.countDocuments({ quantity: { $gt: 10 } }),
        Product.countDocuments({ quantity: { $gte: 1, $lte: 10 } }),
        Product.countDocuments({ quantity: 0 }),
        Product.find().select('-supplier').populate('category', 'name').sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      data: { totalProducts, totalCategories, available, lowStock, outOfStock, recentProducts },
    });
  } catch (err) {
    next(err);
  }
};
