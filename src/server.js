require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startNotificationService } = require('./services/notificationService');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start the background cron jobs for inventory automation
  startNotificationService();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

