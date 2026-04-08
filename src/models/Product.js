const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Shop ID is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  barcode: {
    type: String,
    required: [true, 'Barcode is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  minStockThreshold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure barcode is unique per shop
productSchema.index({ shopID: 1, barcode: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
