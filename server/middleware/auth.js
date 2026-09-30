const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
    }
    return 'vexivo_development_secret_key_do_not_use_in_prod';
  }
  return secret;
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length > 1) {
      token = parts.slice(1).join(' ').trim();
    }
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (typeof token === 'string') {
    token = token.trim();
    if (token === 'null' || token === 'undefined' || token === '') {
      token = null;
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User associated with token not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
  }
};

const deliveryOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'delivery_partner' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Delivery partner privileges required' });
  }
};

const activeDeliveryOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (req.user.role === 'admin') {
    return next();
  }
  if (req.user.role === 'delivery_partner') {
    const status = req.user.deliveryProfile?.status || (req.user.deliveryProfile?.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION');
    if (status === 'ACTIVE' || status === 'APPROVED') {
      return next();
    }
    return res.status(403).json({
      success: false,
      accountStatus: status,
      message:
        status === 'PENDING_VERIFICATION'
          ? 'Your Delivery Partner account is currently under verification. You will be able to start deliveries after your account is approved.'
          : status === 'REJECTED'
          ? 'Your Delivery Partner application was rejected. Please contact support.'
          : status === 'SUSPENDED'
          ? 'Your Delivery Partner account has been suspended. Please contact dispatch management.'
          : 'Delivery Partner account is not active.',
    });
  }
  res.status(403).json({ success: false, message: 'Access denied: Delivery partner privileges required' });
};

const sellerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.isSeller || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Seller privileges required' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length > 1) {
      token = parts.slice(1).join(' ').trim();
    }
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (typeof token === 'string') {
    token = token.trim();
    if (token === 'null' || token === 'undefined' || token === '') {
      token = null;
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth, deliveryOnly, activeDeliveryOnly, sellerOnly };
