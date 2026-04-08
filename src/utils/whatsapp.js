const Notification = require('../models/Notification');

// Usage: sendWhatsAppAlert('919876543210', 'Alert! Items expiring.', shopID)
const sendWhatsAppAlert = async (phone, message, shopID) => {
  try {
    // 1. Format the message for a URL
    const encodedMessage = encodeURIComponent(message);
    
    // 2. Build the WhatsApp deep link
    const whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    // 3. Log it beautifully for viewing in console
    console.log(`\n================== WHATSAPP ALERT ==================`);
    console.log(`Sending to: ${phone}`);
    console.log(`Message: \n${message}`);
    console.log(`\n👉 Click to Send: ${whatsappLink}`);
    console.log(`====================================================\n`);

    // 4. Track it in database
    if (shopID) {
      await Notification.create({
        shopID,
        message,
        status: 'Sent'
      });
    }

    return { success: true, link: whatsappLink };
  } catch (error) {
    console.error('Failed to send WhatsApp alert:', error);
    if (shopID) {
      await Notification.create({
        shopID,
        message,
        status: 'Failed'
      });
    }
  }
};

module.exports = { sendWhatsAppAlert };
