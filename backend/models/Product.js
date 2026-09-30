const mongoose = require('mongoose');

// Status is derived from quantity - it is never stored in MongoDB
const getStatus = (quantity) => {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= 10) return 'Low Stock';
  return 'Available';
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      validate: { validator: (v) => v > 0, message: 'Price must be greater than 0' },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
    },
    supplier: { type: String, required: [true, 'Supplier is required'], trim: true },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('status').get(function () {
  return getStatus(this.quantity);
});

module.exports = mongoose.model('Product', productSchema);
