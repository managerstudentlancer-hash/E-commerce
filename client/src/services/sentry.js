import * as Sentry from '@sentry/react';

let isInitialized = false;

// List of sensitive keys to scrub from frontend Sentry events and breadcrumbs
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
];

/**
 * Deep recursive sanitizer for client-side event scrubbing
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeData);

  const clean = {};
  for (const [key, val] of Object.entries(data)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lower.includes(sensitive))) {
      clean[key] = '[REDACTED]';
    } else if (val && typeof val === 'object') {
      clean[key] = sanitizeData(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
};

/**
 * Initialize Sentry on frontend client
 */
export const initSentry = () => {
  const dsn = (import.meta.env.VITE_SENTRY_DSN || '').trim();

  // If DSN is absent, fail safely and noiselessly — app runs completely normally
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[VEXIVO Sentry] VITE_SENTRY_DSN not configured — running without remote error reporting.');
    }
    return { isInitialized: false, Sentry };
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development',
      release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: Number(
        import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || (import.meta.env.PROD ? 0.1 : 1.0)
      ),
      sendDefaultPii: false,
      beforeSend(event) {
        // Strip sensitive fields from request data
        if (event.request?.data) {
          event.request.data = sanitizeData(event.request.data);
        }
        // Scrub breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map((b) => {
            if (b.data) b.data = sanitizeData(b.data);
            return b;
          });
        }
        // Scrub extra context
        if (event.extra) {
          event.extra = sanitizeData(event.extra);
        }
        return event;
      },
    });

    isInitialized = true;
    if (import.meta.env.DEV) {
      console.info('[VEXIVO Sentry] Initialized successfully.');
    }
  } catch (err) {
    console.warn('[VEXIVO Sentry] Initialization error:', err?.message || err);
    isInitialized = false;
  }

  return { isInitialized, Sentry };
};

/**
 * Capture an error on the frontend with safe metadata
 */
export const captureFrontendException = (error, context = {}) => {
  if (!isInitialized) return;
  try {
    Sentry.captureException(error, {
      extra: sanitizeData(context.extra || {}),
      tags: sanitizeData(context.tags || {}),
    });
  } catch (e) {
    // Fail safe
  }
};

export { Sentry };
export default Sentry;
