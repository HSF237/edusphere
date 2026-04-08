const Product = require('../models/Product');
const Batch = require('../models/Batch');
const { validationResult } = require('express-validator');

exports.smartAdd = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: errors.array()[0].msg
      });
    }

    const { barcode, quantity, expiryDate, costPrice, productName, category, minStockThreshold } = req.body;
    const shopID = req.user.id;

    // Check if product exists for this shop & barcode
    let product = await Product.findOne({ shopID, barcode });

    if (!product) {
      // If product doesn't exist, we need productName to create it
      if (!productName) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Product not found. Please provide productName to create a new product.'
        });
      }

      product = await Product.create({
        shopID,
        productName,
        barcode,
        category: category || 'Uncategorized',
        minStockThreshold: minStockThreshold || 0
      });
    }

    // Timezone Trap Fix: Force the expiryDate to UTC 00:00:00 to prevent local shifting bugs
    const cleanExpiryDate = new Date(expiryDate);
    // Even if it comes as ISO, let's normalize it
    const utcExpiry = new Date(Date.UTC(cleanExpiryDate.getFullYear(), cleanExpiryDate.getMonth(), cleanExpiryDate.getDate(), 0, 0, 0));

    // Create the batch
    const batch = await Batch.create({
      productID: product._id,
      shopID,
      quantity,
      expiryDate: utcExpiry,
      costPrice
    });

    res.status(201).json({
      success: true,
      data: {
        product,
        batch
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

exports.generatePromo = async (req, res, next) => {
  try {
    const { batchID } = req.params;
    
    // Validate batchID is provided and valid format
    if (!batchID || !batchID.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, data: null, error: 'Valid Batch ID required' });
    }

    const batch = await Batch.findOne({ _id: batchID, shopID: req.user.id })
      .populate('productID')
      .populate('shopID');

    if (!batch) {
      return res.status(404).json({ success: false, data: null, error: 'Batch not found' });
    }

    const productName = batch.productID.productName;
    const shopName = batch.shopID.shopName;
    const dateFormatted = new Date(batch.expiryDate).toLocaleDateString('en-IN');

    // WhatsApp Promo Template
    const promoMessage = `🔥 *ZERO WASTE DEAL!* 🔥\n\nWe have *${productName}* expiring on ${dateFormatted}.\nGet it today at *${shopName}* for a special price! \n\nHelp us reduce waste! 🌍`;
    
    // Encoded for deep linking directly from dashboard
    const waLink = `https://wa.me/?text=${encodeURIComponent(promoMessage)}`;

    res.status(200).json({
      success: true,
      data: {
        promoMessage,
        waLink
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getInventory = async (req, res, next) => {
  try {
    const shopID = req.user.id;
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default 20 items per load
    const skip = (page - 1) * limit;

    const batches = await Batch.find({ shopID })
      .populate('productID', 'productName barcode category')
      .sort({ expiryDate: 1 }) // Closest expiry first
      .skip(skip)
      .limit(limit);

    const total = await Batch.countDocuments({ shopID });

    // Clean dates to ensure frontend doesn't shift them incorrectly due to timezones
    const safeBatches = batches.map(batch => {
      const data = batch.toObject();
      data.expiryDate = data.expiryDate.toISOString().split('T')[0]; // Format strictly to YYYY-MM-DD
      return data;
    });

    res.status(200).json({
      success: true,
      data: safeBatches,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};


