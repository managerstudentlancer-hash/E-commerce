// =========================================================================
// VEXIVO ENTERPRISE SECURITY & ANTI-HACK SHIELD MIDDLEWARE
// Comprehensive Defense-in-Depth against OWASP Top 10 Vulnerabilities
// =========================================================================

const bcrypt = require('bcryptjs');

// -------------------------------------------------------------------------
// 1. GLOBAL & AUTH BRUTE-FORCE RATE LIMITING
// -------------------------------------------------------------------------
const loginAttempts = new Map();
const globalIpTracker = new Map();

const MAX_FAILED_LOGINS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

const GLOBAL_RATE_LIMIT = 250; // max 250 requests per minute per IP
const GLOBAL_WINDOW_MS = 60 * 1000; // 1 minute

// Housekeeping: garbage collect expired memory records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of loginAttempts.entries()) {
    if (data.lockedUntil && data.lockedUntil < now) {
      loginAttempts.delete(key);
    } else if (now - data.lastAttempt > LOGIN_ATTEMPT_WINDOW_MS && !data.lockedUntil) {
      loginAttempts.delete(key);
    }
  }
  for (const [ip, data] of globalIpTracker.entries()) {
    if (now - data.resetTime > GLOBAL_WINDOW_MS) {
      globalIpTracker.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Global Anti-DDoS / Excessive Requests Rate Limiter
const globalRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let ipData = globalIpTracker.get(ip);
  if (!ipData || now - ipData.resetTime > GLOBAL_WINDOW_MS) {
    ipData = { count: 1, resetTime: now };
  } else {
    ipData.count += 1;
  }

  globalIpTracker.set(ip, ipData);

  if (ipData.count > GLOBAL_RATE_LIMIT) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded: Too many requests detected from this address. Please wait a moment.',
    });
  }

  next();
};

// Check if an IP/Email is currently locked out from login
const checkBruteForce = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const email = (req.body?.email || '').toLowerCase().trim();
  const key = `${ip}_${email}`;

  const attemptData = loginAttempts.get(key);
  if (attemptData && attemptData.lockedUntil && attemptData.lockedUntil > Date.now()) {
    const remainingMinutes = Math.ceil((attemptData.lockedUntil - Date.now()) / (60 * 1000));
    return res.status(429).json({
      success: false,
      message: `Security Lockout: Account temporarily protected due to multiple failed login attempts. Retry in ${remainingMinutes} minute(s).`,
      lockedUntil: attemptData.lockedUntil,
      remainingMinutes,
    });
  }

  next();
};

// Record failed login attempt
const recordFailedLogin = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const email = (req.body?.email || '').toLowerCase().trim();
  const key = `${ip}_${email}`;
  const now = Date.now();

  let attemptData = loginAttempts.get(key);
  if (!attemptData || now - attemptData.lastAttempt > LOGIN_ATTEMPT_WINDOW_MS) {
    attemptData = { count: 1, lastAttempt: now, lockedUntil: null };
  } else {
    attemptData.count += 1;
    attemptData.lastAttempt = now;
  }

  if (attemptData.count >= MAX_FAILED_LOGINS) {
    attemptData.lockedUntil = now + LOGIN_LOCKOUT_MS;
  }

  loginAttempts.set(key, attemptData);
  return {
    remainingAttempts: Math.max(0, MAX_FAILED_LOGINS - attemptData.count),
    isLocked: !!attemptData.lockedUntil,
    lockedMinutes: attemptData.lockedUntil ? Math.ceil(LOGIN_LOCKOUT_MS / (60 * 1000)) : 0,
  };
};

// Clear failed login attempts on success
const clearFailedLogin = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const email = (req.body?.email || '').toLowerCase().trim();
  const key = `${ip}_${email}`;
  loginAttempts.delete(key);
};

// -------------------------------------------------------------------------
// 2. TIMING ATTACK PROTECTION
// -------------------------------------------------------------------------
// Fixed dummy hash to ensure constant-time bcrypt execution even if user does not exist
const DUMMY_BCRYPT_HASH = '$2a$10$e8MiA6oWz8vWv7i7y5aBge18qg2pWl77P1kP2w.O9kG7i3m1a6p8C';

const performDummyPasswordVerification = async (candidatePassword) => {
  try {
    await bcrypt.compare(candidatePassword || 'dummyPassword123!', DUMMY_BCRYPT_HASH);
  } catch {
    // Ignore dummy compare errors
  }
};

// -------------------------------------------------------------------------
// 3. RECURSIVE NoSQL OPERATOR INJECTION SANITIZATION
// -------------------------------------------------------------------------
// Strips keys starting with '$' or containing '.' from objects and arrays
const sanitizeNoSqlObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNoSqlObject);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Reject Mongo operators like $gt, $ne, $where, $regex, etc.
    if (key.startsWith('$') || key.includes('.')) {
      continue; // Strip hazardous operator key
    }
    clean[key] = sanitizeNoSqlObject(value);
  }
  return clean;
};

const sanitizeAuthInputs = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeNoSqlObject(req.body);

    // Validate string types for critical auth parameters
    if (req.body.email && typeof req.body.email !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (req.body.password && typeof req.body.password !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid password format' });
    }
    if (req.body.phone && typeof req.body.phone !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid phone format' });
    }
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeNoSqlObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeNoSqlObject(req.params);
  }
  next();
};

// -------------------------------------------------------------------------
// 4. CROSS-SITE SCRIPTING (XSS) SANITIZATION
// -------------------------------------------------------------------------
// Strips executable HTML/JS payloads from string inputs
const stripMaliciousScripts = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
};

const sanitizeXssObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? stripMaliciousScripts(obj) : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeXssObject);
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    clean[key] = sanitizeXssObject(value);
  }
  return clean;
};

const xssProtection = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeXssObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeXssObject(req.query);
  }
  next();
};

// -------------------------------------------------------------------------
// 5. HTTP PARAMETER POLLUTION (HPP) PROTECTION
// -------------------------------------------------------------------------
// Normalizes duplicate query parameters to single strings
const hppProtection = (req, res, next) => {
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (Array.isArray(req.query[key])) {
        // Keep the last element to prevent type confusion
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
  }
  next();
};

// -------------------------------------------------------------------------
// 6. PASSWORD COMPLEXITY POLICY VALIDATOR
// -------------------------------------------------------------------------
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z)' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter (a-z)' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9)' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  return { valid: true };
};

// -------------------------------------------------------------------------
// 7. HARDENED SECURITY RESPONSE HEADERS
// -------------------------------------------------------------------------
const setSecurityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Legacy XSS filter activation
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer header security
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Disable dangerous web capabilities
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Content Security Policy (enforce safe sources)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' http://localhost:* ws://localhost:*;"
  );
  // Cross-Origin Resource Policy
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
};

module.exports = {
  globalRateLimiter,
  checkBruteForce,
  recordFailedLogin,
  clearFailedLogin,
  performDummyPasswordVerification,
  sanitizeAuthInputs,
  xssProtection,
  hppProtection,
  validatePasswordStrength,
  setSecurityHeaders,
};
