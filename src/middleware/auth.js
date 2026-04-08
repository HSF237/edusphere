const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zerowaste_super_secret');

      // Set req.user to match JWT payload
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, data: null, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, data: null, error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
