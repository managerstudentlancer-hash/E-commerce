const Sentry = require('@sentry/node');
const logger = require('./logger');

let isInitialized = false;

// List of sensitive keys to scrub from Sentry events and breadcrumbs
const SENSITIVE_KEYS = [
  'password',
  'confirmpassword',
  'newpassword',
  'currentpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'jwt',
  'authorization',
  'cookie',
  'otp',
  'code',
  'pickupotp',
  'deliveryotp',
  'returnpickupotp',
  'creditcard',
  'cardnumber',
  'cvv',
  'cvc',
  'securitycode',
  'secret',
  'apikey',
  'supabase_secret_key',
];

/**
 * Deep recursive sanitizer to scrub sensitive data before sending to Sentry
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

/**
 * Initialize Sentry for Node.js / Express backend
 */
const initSentry = () => {
  const dsn = process.env.SENTRY_DSN ? process.env.SENTRY_DSN.trim() : '';

  if (!dsn) {
    logger.info('Sentry DSN not configured — running with local Pino structured logging only.');
    return { isInitialized: false, Sentry };
  }

  try {
    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
      release: process.env.SENTRY_RELEASE || undefined,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || (process.env.NODE_ENV === 'production' ? 0.1 : 1.0)),
      sendDefaultPii: false, // Never send default PII
      beforeSend(event, hint) {
        // Strip sensitive request headers if attached
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
          delete event.request.headers['x-auth-token'];
          delete event.request.headers['x-access-token'];
        }

        // Strip sensitive data from request data
        if (event.request?.data) {
          event.request.data = sanitizeObject(event.request.data);
        }

        // Strip sensitive info from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
            if (breadcrumb.data) {
              breadcrumb.data = sanitizeObject(breadcrumb.data);
            }
            return breadcrumb;
          });
        }

        // Sanitize extra context
        if (event.extra) {
          event.extra = sanitizeObject(event.extra);
        }

        return event;
      },
    });

    isInitialized = true;
    logger.info({ environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development' }, '✅ Sentry initialized successfully on backend.');
  } catch (err) {
    logger.warn({ error: err.message }, 'Failed to initialize Sentry on backend — running with Pino logging only.');
    isInitialized = false;
  }

  return { isInitialized, Sentry };
};

/**
 * Safely capture an exception to Sentry with context metadata
 */
const captureException = (err, context = {}) => {
  if (!isInitialized) return null;

  try {
    return Sentry.captureException(err, {
      tags: sanitizeObject(context.tags || {}),
      extra: sanitizeObject(context.extra || {}),
    });
  } catch (captureErr) {
    logger.warn({ error: captureErr.message }, 'Failed to send exception to Sentry');
    return null;
  }
};

module.exports = {
  initSentry,
  Sentry,
  isSentryEnabled: () => isInitialized,
  captureException,
};
