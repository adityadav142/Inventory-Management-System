const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const caseInsensitive = { locale: 'en', strength: 2 };

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id
exports.getCategory = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid category ID');
    const category = await Category.findById(req.params.id);
    if (!category) return bad(res, 'Category not found', 404);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (typeof name !== 'string' || !name.trim()) return bad(res, 'Category name is required');

    const exists = await Category.findOne({ name: name.trim() }).collation(caseInsensitive);
    if (exists) return bad(res, 'Category name already exists');

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid category ID');
    const { name, description } = req.body;
    if (typeof name !== 'string' || !name.trim()) return bad(res, 'Category name is required');

    const category = await Category.findById(req.params.id);
    if (!category) return bad(res, 'Category not found', 404);

    const duplicate = await Category.findOne({ name: name.trim(), _id: { $ne: category._id } })
      .collation(caseInsensitive);
    if (duplicate) return bad(res, 'Category name already exists');

    category.name = name;
    category.description = description || '';
    await category.save();
    res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid category ID');
    const category = await Category.findById(req.params.id);
    if (!category) return bad(res, 'Category not found', 404);

    const inUse = await Product.countDocuments({ category: category._id });
    if (inUse > 0) {
      return bad(
        res,
        'This category cannot be deleted because it is currently assigned to one or more products.'
      );
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
