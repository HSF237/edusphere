const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  shopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Failed'],
    default: 'Sent'
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

module.exports = mongoose.model('Notification', notificationSchema);
