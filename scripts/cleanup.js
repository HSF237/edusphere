const mongoose = require('mongoose');
const Shop = require('../src/models/Shop');
const Product = require('../src/models/Product');
const Batch = require('../src/models/Batch');
const Notification = require('../src/models/Notification');
require('dotenv').config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zerowaste');
    console.log('Connected to DB...');

    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Batch.deleteMany({});
    await Notification.deleteMany({});

    console.log('✅ Cleaned all test data from the Database!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanDB();
