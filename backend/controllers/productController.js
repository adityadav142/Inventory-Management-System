const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

const validateQuantity = (value) => {
  if (isBlank(value) || isNaN(Number(value))) return 'Quantity must be a number';
  if (!Number.isInteger(Number(value))) return 'Quantity must be a whole number';
  if (Number(value) < 0) return 'Quantity cannot be negative';
  return null;
};

// Returns an error message, or null when the data is valid
const validateProduct = (b) => {
  if (isBlank(b.name)) return 'Product name is required';
  if (isBlank(b.category)) return 'Category is required';
  if (!mongoose.isValidObjectId(b.category)) return 'Invalid category';
  if (isBlank(b.price) || isNaN(Number(b.price))) return 'Price must be a number';
  if (Number(b.price) <= 0) return 'Price must be greater than 0';
  const q = validateQuantity(b.quantity);
  if (q) return q;
  if (isBlank(b.supplier)) return 'Supplier is required';
  return null;
};

// GET /api/products?search=&category=
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const isAdmin = req.user.role === 'admin';
    const filter = {};
    if (search && String(search).trim()) {
      const safe = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(safe, 'i');
      if (isAdmin) filter.$or = [{ name: rx }, { supplier: rx }];
      else filter.name = rx; // users search by product name only
    }
    if (category) {
      if (!mongoose.isValidObjectId(category)) return bad(res, 'Invalid category');
      filter.category = category;
    }
    let query = Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    if (!isAdmin) query = query.select('-supplier'); // supplier is admin-only information
    const products = await query;
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid product ID');
    let query = Product.findById(req.params.id).populate('category', 'name');
    if (req.user.role !== 'admin') query = query.select('-supplier');
    const product = await query;
    if (!product) return bad(res, 'Product not found', 404);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const error = validateProduct(req.body);
    if (error) return bad(res, error);
    if (!(await Category.findById(req.body.category))) {
      return bad(res, 'Selected category does not exist');
    }
    const { name, category, price, quantity, supplier, description } = req.body;
    const product = await Product.create({
      name, category, supplier, description,
      price: Number(price),
      quantity: Number(quantity),
    });
    await product.populate('category', 'name');
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid product ID');
    const product = await Product.findById(req.params.id);
    if (!product) return bad(res, 'Product not found', 404);

    const error = validateProduct(req.body);
    if (error) return bad(res, error);
    if (!(await Category.findById(req.body.category))) {
      return bad(res, 'Selected category does not exist');
    }
    const { name, category, price, quantity, supplier, description } = req.body;
    Object.assign(product, {
      name, category, supplier, description: description || '',
      price: Number(price),
      quantity: Number(quantity),
    });
    await product.save();
    await product.populate('category', 'name');
    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid product ID');
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return bad(res, 'Product not found', 404);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/stock   body: { quantity }
exports.updateStock = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid product ID');
    const error = validateQuantity(req.body.quantity);
    if (error) return bad(res, error);

    const product = await Product.findById(req.params.id);
    if (!product) return bad(res, 'Product not found', 404);

    product.quantity = Number(req.body.quantity);
    await product.save();
    await product.populate('category', 'name');
    res.json({ success: true, message: 'Stock updated successfully', data: product });
  } catch (err) {
    next(err);
  }
};
