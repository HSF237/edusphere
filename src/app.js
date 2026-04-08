const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found'
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
