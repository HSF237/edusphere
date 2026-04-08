const Shop = require('../models/Shop');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'zerowaste_super_secret', {
    expiresIn: '30d',
  });
};

exports.registerShop = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: errors.array()[0].msg
      });
    }

    const { shopName, ownerPhone, password, isPremium, referralCode } = req.body;

    const existingShop = await Shop.findOne({ ownerPhone });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Shop with this owner phone already exists'
      });
    }

    // Handle Referral Logic
    let referrer = null;
    let initialPremiumStatus = isPremium || false;

    if (referralCode) {
      referrer = await Shop.findOne({ referralCode });
      if (referrer) {
        // Grant Pro to the new user automatically
        initialPremiumStatus = true;
      }
    }

    // Generate unique referral code (e.g. Raju's -> RAJU1234)
    const newReferralCode = shopName.substring(0,4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    const shop = await Shop.create({
      shopName,
      ownerPhone,
      password,
      referralCode: newReferralCode,
      referredBy: referrer ? referrer._id : undefined,
      isPremium: initialPremiumStatus
    });

    if (referrer) {
      // Logic to actually extend referrer's premium status can go here
      // For now, ensuring they stay Premium
      referrer.isPremium = true;
      await referrer.save();
    }

    res.status(201).json({
      success: true,
      data: {
        _id: shop._id,
        shopName: shop.shopName,
        ownerPhone: shop.ownerPhone,
        isPremium: shop.isPremium,
        token: generateToken(shop._id)
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

exports.loginShop = async (req, res, next) => {
  try {
    const { ownerPhone, password } = req.body;

    if (!ownerPhone || !password) {
      return res.status(400).json({ success: false, data: null, error: 'Please provide phone and password' });
    }

    const shop = await Shop.findOne({ ownerPhone });

    if (shop && (await shop.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: shop._id,
          shopName: shop.shopName,
          ownerPhone: shop.ownerPhone,
          isPremium: shop.isPremium,
          token: generateToken(shop._id)
        },
        error: null
      });
    } else {
      res.status(401).json({ success: false, data: null, error: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};
