const express = require('express');
const { body } = require('express-validator');
const { registerShop, loginShop } = require('../controllers/authController');

const router = express.Router();

router.post('/register-shop', [
  body('shopName').notEmpty().withMessage('Shop name is required'),
  body('ownerPhone').notEmpty().withMessage('Owner phone is required').isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('password').notEmpty().withMessage('Password is required'),
], registerShop);

router.post('/login', loginShop);

module.exports = router;
