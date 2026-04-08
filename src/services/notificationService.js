const cron = require('node-cron');
const Batch = require('../models/Batch');
const Shop = require('../models/Shop');
const { startOfDay, addDays, endOfDay, isBefore } = require('date-fns');
const { sendWhatsAppAlert } = require('../utils/whatsapp');

// Runs every day at 08:00 AM
const startNotificationService = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily inventory check...');
    try {
      // 1. Get exact dates avoiding timezone issues
      const today = startOfDay(new Date());
      const in7Days = addDays(today, 7);
      const in3Days = addDays(today, 3);

      // 2. We query batches that need alerts and populate product & shop
      const batches = await Batch.find({ quantity: { $gt: 0 } })
        .populate('productID')
        .populate('shopID');

      // Group by shop to send consolidated messages
      const shopAlerts = {};

      batches.forEach(batch => {
        const shop = batch.shopID;
        if (!shop) return;
        
        const expiry = new Date(batch.expiryDate);
        let alertType = null;

        // Check if exactly 7 days
        if (expiry >= in7Days && expiry <= endOfDay(in7Days)) {
          alertType = '7_DAYS';
        } 
        // Check if exactly 3 days
        else if (expiry >= in3Days && expiry <= endOfDay(in3Days)) {
          alertType = '3_DAYS';
        }
        // Check if expired today or already expired
        else if (isBefore(expiry, addDays(today, 1))) {
          alertType = 'EXPIRED';
        }

        if (alertType) {
          if (!shopAlerts[shop._id]) {
            shopAlerts[shop._id] = {
              shopPhone: shop.ownerPhone,
              shopName: shop.shopName,
              isPremium: shop.isPremium,
              items: []
            };
          }
          shopAlerts[shop._id].items.push({
            name: batch.productID.productName,
            type: alertType,
            qty: batch.quantity
          });
        }
      });

      // 3. Send out the alerts
      for (const [shopID, data] of Object.entries(shopAlerts)) {
        let message = `*ZeroWaste Daily Alert* 🚨\nHello ${data.shopName},\n\nHere is your inventory health update:\n\n`;

        const expired = data.items.filter(i => i.type === 'EXPIRED');
        const threeDays = data.items.filter(i => i.type === '3_DAYS');
        const sevenDays = data.items.filter(i => i.type === '7_DAYS');

        if (expired.length > 0) {
          message += `❌ *EXPIRED (Remove from shelf immediately!)*\n`;
          expired.forEach(i => message += `- ${i.name} (${i.qty} units)\n`);
          message += '\n';
        }

        if (threeDays.length > 0) {
          message += `⚠️ *Expiring in 3 Days (Time for a Flash Sale!)*\n`;
          threeDays.forEach(i => message += `- ${i.name} (${i.qty} units)\n`);
          message += '\n';
        }

        if (sevenDays.length > 0) {
          message += `ℹ️ *Expiring in 7 Days (Move to front)*\n`;
          sevenDays.forEach(i => message += `- ${i.name} (${i.qty} units)\n`);
          message += '\n';
        }

        message += 'Tap here to drop a Flash Sale in your customer group: [Open ZeroWaste Dashboard]';

        if (!data.isPremium) {
            console.log(`[IN-APP NOTIFICATION] Upgrade to Pro for WhatsApp Alerts: Shop ${data.shopName}`);
            continue;
        }

        await sendWhatsAppAlert(data.shopPhone, message, shopID);
      }

    } catch (error) {
      console.error('Error in daily inventory cron job:', error);
    }
  });

  // Self-Healing: Retry failed notifications every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const failedNotifications = await require('../models/Notification').find({ status: 'Failed' }).populate('shopID');
      if (failedNotifications.length === 0) return;

      console.log(`[SELF-HEALING] Found ${failedNotifications.length} failed notifications. Retrying...`);
      
      for (const notification of failedNotifications) {
        if (!notification.shopID || !notification.shopID.ownerPhone) continue;
        
        // Try resending
        const result = await sendWhatsAppAlert(notification.shopID.ownerPhone, notification.message, null);
        
        // If success within this retry, we update the existing record
        if (result && result.success) {
           notification.status = 'Sent';
           await notification.save();
        }
      }
    } catch (e) {
      console.error('[SELF-HEALING] Error retrying notifications:', e);
    }
  });

  console.log('Notification Service started (Daily: 0 8 * * * | Retry: 0 * * * *)');
};

module.exports = { startNotificationService };
