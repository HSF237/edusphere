const express = require('express');
const { body } = require('express-validator');
const { smartAdd, generatePromo, getInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/smart-add', protect, [
  body('barcode').notEmpty().withMessage('Barcode is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('expiryDate').isISO8601().toDate().withMessage('Valid expiry date is required'),
  body('costPrice').isNumeric().withMessage('Cost price must be a number')
], smartAdd);

router.get('/generate-promo/:batchID', protect, generatePromo);
router.get('/', protect, getInventory);

module.exports = router;
