const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

// Comprehensive redaction paths for all sensitive parameters, credentials, tokens, PII, and keys
const redactPaths = [
  // HTTP Headers
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-auth-token"]',
  'req.headers["x-access-token"]',
  'res.headers["set-cookie"]',

  // Authentication & Passwords
  'password',
  '*.password',
  'confirmPassword',
  '*.confirmPassword',
  'newPassword',
  '*.newPassword',
  'currentPassword',
  '*.currentPassword',
  'oldPassword',
  '*.oldPassword',

  // Tokens & Secrets
  'token',
  '*.token',
  'accessToken',
  '*.accessToken',
  'refreshToken',
  '*.refreshToken',
  'jwt',
  '*.jwt',
  'jwtSecret',
  '*.jwtSecret',
  'JWT_SECRET',
  'secret',
  '*.secret',
  'apiKey',
  '*.apiKey',
  'secretKey',
  '*.secretKey',

  // OTPs & Verification Codes
  'otp',
  '*.otp',
  'code',
  '*.code',
  'pickupOtp',
  '*.pickupOtp',
  'deliveryOtp',
  '*.deliveryOtp',
  'returnPickupOtp',
  '*.returnPickupOtp',

  // Payment & Financial Data
  'creditCard',
  '*.creditCard',
  'cardNumber',
  '*.cardNumber',
  'cvv',
  '*.cvv',
  'cvc',
  '*.cvc',
  'securityCode',
  '*.securityCode',
  'expiryDate',
  '*.expiryDate',

  // Third-Party & Infrastructure Secrets
  'SUPABASE_SECRET_KEY',
  '*.SUPABASE_SECRET_KEY',
  'serviceRoleKey',
  '*.serviceRoleKey',
  'supabaseKey',
  '*.supabaseKey',
  'stripeSecretKey',
  'STRIPE_SECRET_KEY',
  'private_key',
  '*.private_key',
];

let loggerTransport;

if (!isProduction) {
  try {
    loggerTransport = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    });
  } catch (err) {
    // Fall back to standard JSON output if pino-pretty transport encounters any issue
    loggerTransport = undefined;
  }
}

const logger = pino(
  {
    level: logLevel,
    base: {
      app: 'vexivo-server',
      env: process.env.NODE_ENV || 'development',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]',
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  },
  loggerTransport
);

module.exports = logger;
