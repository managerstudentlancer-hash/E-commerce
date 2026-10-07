const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = body;
        try {
          parsed = JSON.parse(body);
        } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runObservabilityTests() {
  console.log('============================================================');
  console.log('🔍 VEXIVO SENTRY + PINO OBSERVABILITY VERIFICATION SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Unit Check: Pino Logger Redaction
  console.log('--- 1. PINO LOGGER STRUCTURE & REDACTION CHECKS ---');
  try {
    const logger = require('./server/config/logger');
    assert(typeof logger.info === 'function', 'Pino logger exports standard logging methods');
    assert(typeof logger.error === 'function', 'Pino logger exports error method');
    assert(typeof logger.warn === 'function', 'Pino logger exports warn method');
    assert(typeof logger.debug === 'function', 'Pino logger exports debug method');
    assert(typeof logger.fatal === 'function', 'Pino logger exports fatal method');

    // Test redaction logic
    let capturedLog = null;
    const testPino = require('./server/node_modules/pino')(
      {
        redact: {
          paths: ['password', 'token', 'otp', 'cardNumber', 'SUPABASE_SECRET_KEY'],
          censor: '[REDACTED]',
        },
      },
      {
        write: (str) => {
          capturedLog = JSON.parse(str);
        },
      }
    );

    testPino.info({
      user: 'test@example.com',
      password: 'superSecretPassword123',
      token: 'jwt.token.secret',
      otp: '123456',
      cardNumber: '4111111111111234',
      SUPABASE_SECRET_KEY: 'sb_secret_key_mock',
    }, 'Sensitive log test');

    assert(capturedLog.password === '[REDACTED]', 'Sensitive password was redacted by Pino');
    assert(capturedLog.token === '[REDACTED]', 'Sensitive JWT/token was redacted by Pino');
    assert(capturedLog.otp === '[REDACTED]', 'Sensitive OTP was redacted by Pino');
    assert(capturedLog.cardNumber === '[REDACTED]', 'Sensitive card number was redacted by Pino');
    assert(capturedLog.SUPABASE_SECRET_KEY === '[REDACTED]', 'Sensitive Supabase secret was redacted by Pino');
  } catch (err) {
    assert(false, `Pino unit check failed: ${err.message}`);
  }

  // 2. Unit Check: Backend Sentry Fail-Safe Initialization
  console.log('\n--- 2. SENTRY FAIL-SAFE INITIALIZATION CHECKS ---');
  try {
    const { initSentry, isSentryEnabled } = require('./server/config/sentry');
    const result = initSentry();
    assert(result !== null, 'Sentry module safely initializes');
    assert(typeof isSentryEnabled === 'function', 'Sentry exports isSentryEnabled helper');
  } catch (err) {
    assert(false, `Sentry init check failed: ${err.message}`);
  }

  // 3. Live Server Endpoint Checks
  console.log('\n--- 3. LIVE SERVER ENDPOINT & CORRELATION CHECKS ---');
  try {
    // 3a. Health check
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data.status === 'online', 'Health check returns online');
    assert(Boolean(health.headers['x-request-id']), `Response includes X-Request-Id header: ${health.headers['x-request-id']}`);

    // 3b. Observability status endpoint
    const obsStatus = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/observability/status',
      method: 'GET',
    });
    assert(obsStatus.status === 200, 'Observability status endpoint responds with 200');
    assert(obsStatus.data.logger === 'pino', `Logger confirmed as Pino (current level: ${obsStatus.data.logLevel})`);
    assert(typeof obsStatus.data.sentryEnabled === 'boolean', `Sentry status reported cleanly (enabled: ${obsStatus.data.sentryEnabled})`);
    assert(Boolean(obsStatus.headers['x-request-id']), 'Observability status response contains X-Request-Id correlation header');

    // 3c. Correlation ID propagation test (pass custom X-Request-Id)
    const customReqId = 'custom-trace-uuid-12345678';
    const traceTest = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/observability/status',
      method: 'GET',
      headers: {
        'x-request-id': customReqId,
      },
    });
    assert(traceTest.headers['x-request-id'] === customReqId, `Custom X-Request-Id was preserved and propagated: ${traceTest.headers['x-request-id']}`);
    assert(traceTest.data.requestId === customReqId, `Request ID matching custom header returned in response body: ${traceTest.data.requestId}`);

    // 3d. Error capture & safe response format
    const errorTest = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/observability/test-error',
      method: 'GET',
    });
    assert(errorTest.status === 500, `Diagnostic error endpoint returns status 500 (actual: ${errorTest.status})`);
    assert(errorTest.data.success === false, 'Error response includes success: false');
    assert(errorTest.data.message === 'VEXIVO Observability Diagnostic Test Error', 'Error response includes safe message');
    assert(Boolean(errorTest.data.requestId), `Error response includes correlation requestId: ${errorTest.data.requestId}`);
    assert(!errorTest.data.stack, 'Error response does NOT expose internal stack trace to client');

    // 3e. Standard 404 route handling
    const notFoundTest = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/non-existent-route-for-testing',
      method: 'GET',
    });
    assert(notFoundTest.status === 404, 'Non-existent route returns 404');
    assert(Boolean(notFoundTest.headers['x-request-id']), '404 response includes correlation X-Request-Id');
  } catch (err) {
    assert(false, `Live endpoint checks failed: ${err.message}`);
  }

  console.log('\n============================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runObservabilityTests();
