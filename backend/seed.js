// Loads sample data. Run with: npm run seed
// WARNING: this clears existing products and categories, then re-creates the sample data.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  ['Electronics', 'Electronic products and accessories'],
  ['Stationery', 'Writing and office materials'],
  ['Furniture', 'Office furniture'],
  ['Accessories', 'Bags and everyday accessories'],
  ['Sports', 'Sports and fitness items'],
];

// [name, category, price, quantity, supplier, description]
const products = [
  ['Wireless Mouse', 'Electronics', 599, 25, 'ABC Enterprises', 'Wireless optical mouse'],
  ['Keyboard', 'Electronics', 799, 5, 'ABC Enterprises', 'Full-size USB keyboard'],
  ['USB Cable', 'Electronics', 149, 40, 'Techno Traders', '1 metre USB-C cable'],
  ['Notebook', 'Stationery', 80, 60, 'Paper World', 'A4 ruled notebook'],
  ['Pen Pack', 'Stationery', 120, 8, 'Paper World', 'Pack of 10 ball pens'],
  ['Office Chair', 'Furniture', 3500, 0, 'Comfort Furnishings', 'Ergonomic office chair'],
  ['Table Lamp', 'Furniture', 450, 15, 'Comfort Furnishings', 'LED desk lamp'],
  ['Water Bottle', 'Sports', 250, 30, 'FitLife Supplies', '1 litre steel bottle'],
  ['Backpack', 'Accessories', 1299, 3, 'Urban Gear', 'Water-resistant laptop backpack'],
  ['Calculator', 'Stationery', 350, 0, 'Paper World', 'Scientific calculator'],
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Category.deleteMany();

    if (!(await User.findOne({ email: 'admin@gmail.com' }))) {
      await User.create({ name: 'Admin', email: 'admin@gmail.com', password: 'admin123' });
      console.log('Admin created -> admin@gmail.com / admin123');
    }

    const created = await Category.insertMany(categories.map(([name, description]) => ({ name, description })));
    const byName = Object.fromEntries(created.map((c) => [c.name, c._id]));

    await Product.insertMany(
      products.map(([name, cat, price, quantity, supplier, description]) => ({
        name, price, quantity, supplier, description, category: byName[cat],
      }))
    );
    console.log(`Seeded ${created.length} categories and ${products.length} products`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
