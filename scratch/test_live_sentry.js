const dotenv = require('../server/node_modules/dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { initSentry, captureException, isSentryEnabled } = require('../server/config/sentry');

console.log('SENTRY_DSN from env:', process.env.SENTRY_DSN ? 'FOUND' : 'MISSING');
const sentryRes = initSentry();
console.log('Sentry isInitialized:', isSentryEnabled());

if (isSentryEnabled()) {
  const eventId = captureException(new Error('VEXIVO Backend Sentry Live Verification Test'), {
    tags: {
      source: 'live_verification',
      service: 'vexivo-server'
    },
    extra: {
      verifiedAt: new Date().toISOString()
    }
  });
  console.log('✅ Sent live test event to Sentry! Event ID:', eventId);
} else {
  console.log('Sentry was not initialized.');
}

setTimeout(() => process.exit(0), 1000);
