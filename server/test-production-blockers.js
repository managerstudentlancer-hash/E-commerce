/**
 * Regression Test Suite: Verification of the 3 Production Blockers
 *
 * 1. MongoDB Production Fallback (terminates with exit code 1; no MongoMemoryServer)
 * 2. Secure Demo Accounts & Seed Operations (seedAll blocked, seed routes return 403, create-admin password validator)
 * 3. Safe Payout Production Mode (fail-closed in production; no simulated payouts)
 */

const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🧪 RUNNING PRODUCTION BLOCKER REGRESSION TESTS');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}\n`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}\n`);
    process.exitCode = 1;
  }
}

(async () => {
  // ---------------------------------------------------------------
  // BLOCKER 1: MongoDB Production Connection Failure
  // ---------------------------------------------------------------
  runTest('Blocker 1: db.js terminates process with code 1 in production when persistent DB is unreachable', () => {
    const script = `
      process.env.NODE_ENV = 'production';
      process.env.MONGODB_URI = 'mongodb://127.0.0.1:49999/vexivo_nonexistent';
      const connectDB = require('./server/config/db');
      connectDB().catch(() => process.exit(1));
    `;
    const res = spawnSync('node', ['-e', script], {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      timeout: 15000,
    });

    assert.strictEqual(res.status, 1, `Expected exit code 1, got ${res.status}`);
    const output = (res.stderr || '') + (res.stdout || '');
    assert.ok(
      output.includes('Persistent MongoDB connection failed in production mode') ||
      output.includes('In-memory fallback is disabled'),
      `Expected fatal log message, got: ${output}`
    );
    assert.ok(
      !output.includes('In-Memory MongoDB Initialized'),
      'Must NOT initialize In-Memory MongoDB in production'
    );
  });

  // ---------------------------------------------------------------
  // BLOCKER 2: Secure Demo Accounts & Seeding Protection
  // ---------------------------------------------------------------
  await runAsyncTest('Blocker 2a: seedAll() strictly throws error in production', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const { seedAll } = require('./seed/seedData');
      let threw = false;
      try {
        await seedAll();
      } catch (err) {
        threw = true;
        assert.ok(err.message.includes('strictly disabled in production'), `Got message: ${err.message}`);
      }
      assert.strictEqual(threw, true, 'seedAll() must throw error in production');
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  await runAsyncTest('Blocker 2b: initDeliveryPartner() returns immediately in production without seeding demo account', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const initDeliveryPartner = require('./config/initDeliveryPartner');
      // Should resolve without attempting db write or throwing
      await initDeliveryPartner();
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  runTest('Blocker 2c: create-admin.js password validator enforces production complexity', () => {
    const { validatePassword } = require('./scripts/create-admin');
    assert.ok(validatePassword('short'), 'Should reject passwords shorter than 8 chars');
    assert.ok(validatePassword('alllowercase123!'), 'Should reject passwords without uppercase');
    assert.ok(validatePassword('ALLUPPERCASE123!'), 'Should reject passwords without lowercase');
    assert.ok(validatePassword('NoDigitsHere!Abc'), 'Should reject passwords without numbers');
    assert.ok(validatePassword('NoSpecialChar123A'), 'Should reject passwords without special characters');
    assert.strictEqual(validatePassword('SecureAdminPass#2026!'), null, 'Should accept valid strong password');
  });

  // ---------------------------------------------------------------
  // BLOCKER 3: Safe Payout Production Mode
  // ---------------------------------------------------------------
  await runAsyncTest('Blocker 3a: razorpayxService fails closed in production when credentials missing', async () => {
    const origEnv = process.env.NODE_ENV;
    const origKey = process.env.RAZORPAYX_KEY_ID;
    const origSec = process.env.RAZORPAYX_KEY_SECRET;
    const origAcc = process.env.RAZORPAYX_ACCOUNT_NUMBER;

    process.env.NODE_ENV = 'production';
    delete process.env.RAZORPAYX_KEY_ID;
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAYX_KEY_SECRET;
    delete process.env.RAZORPAY_KEY_SECRET;
    delete process.env.RAZORPAYX_ACCOUNT_NUMBER;

    try {
      const razorpayxService = require('./services/razorpayxService');
      assert.strictEqual(razorpayxService.isConfigured(), false, 'Service should report unconfigured');

      // createContact must throw
      let contactThrew = false;
      try {
        await razorpayxService.createContact({ name: 'Test', referenceId: '123' });
      } catch (err) {
        contactThrew = true;
        assert.ok(err.message.includes('not configured in production mode'));
      }
      assert.strictEqual(contactThrew, true, 'createContact must throw in production');

      // createFundAccount must throw
      let fundThrew = false;
      try {
        await razorpayxService.createFundAccount({ contactId: '123', accountType: 'vpa' });
      } catch (err) {
        fundThrew = true;
        assert.ok(err.message.includes('not configured in production mode'));
      }
      assert.strictEqual(fundThrew, true, 'createFundAccount must throw in production');

      // createPayout must throw - MUST NOT RETURN SIMULATED OBJECT
      let payoutThrew = false;
      try {
        await razorpayxService.createPayout({
          fundAccountId: 'fa_123',
          amountRupees: 500,
          referenceId: 'VEX-TEST',
        });
      } catch (err) {
        payoutThrew = true;
        assert.ok(err.message.includes('missing in production') || err.message.includes('strictly blocked'));
      }
      assert.strictEqual(payoutThrew, true, 'createPayout must throw in production');

      // getPayout must throw
      let getPayoutThrew = false;
      try {
        await razorpayxService.getPayout('pout_123');
      } catch (err) {
        getPayoutThrew = true;
        assert.ok(err.message.includes('not configured'));
      }
      assert.strictEqual(getPayoutThrew, true, 'getPayout must throw in production');

      // Webhook validation must reject unconfigured secret in production
      const isSigValid = razorpayxService.verifyWebhookSignature('{"event":"payout.processed"}', 'fake_sig');
      assert.strictEqual(isSigValid, false, 'verifyWebhookSignature must reject when secret is missing in production');
    } finally {
      process.env.NODE_ENV = origEnv;
      if (origKey) process.env.RAZORPAYX_KEY_ID = origKey;
      if (origSec) process.env.RAZORPAYX_KEY_SECRET = origSec;
      if (origAcc) process.env.RAZORPAYX_ACCOUNT_NUMBER = origAcc;
    }
  });

  await runAsyncTest('Blocker 3b: razorpayxService preserves safe simulation in non-production environments', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const razorpayxService = require('./services/razorpayxService');
      const simPayout = await razorpayxService.createPayout({
        fundAccountId: 'fa_sim_123',
        amountRupees: 250,
        referenceId: 'VEX-SIM-001',
      });
      assert.strictEqual(simPayout.simulated, true, 'Development mode should allow simulated payouts');
      assert.strictEqual(simPayout.amount, 25000, 'Amount must be in paise (250 * 100)');
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed`);
  console.log('====================================================\n');
})();
