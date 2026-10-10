const crypto = require('crypto');

/**
 * RazorpayX Indian Payout Service
 * Handles official RazorpayX contacts, fund accounts, payouts, and webhook validation.
 */
class RazorpayXService {
  constructor() {
    this.baseUrl = 'https://api.razorpay.com/v1';
  }

  getKeyId() {
    return process.env.RAZORPAYX_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
  }

  getKeySecret() {
    return process.env.RAZORPAYX_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
  }

  getAccountNumber() {
    return process.env.RAZORPAYX_ACCOUNT_NUMBER || '';
  }

  getWebhookSecret() {
    return process.env.RAZORPAYX_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || '';
  }

  isConfigured() {
    return Boolean(this.getKeyId() && this.getKeySecret() && this.getAccountNumber());
  }

  getAuthHeader() {
    const creds = `${this.getKeyId()}:${this.getKeySecret()}`;
    return `Basic ${Buffer.from(creds).toString('base64')}`;
  }

  /**
   * Create or retrieve RazorpayX Contact for delivery partner
   */
  async createContact({ name, email, phone, referenceId }) {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('RazorpayX payout provider is not configured in production mode. Contact creation is blocked.');
      }
      return {
        id: `cont_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        email: email || undefined,
        contact: phone || undefined,
        type: 'vendor',
        reference_id: referenceId,
        simulated: true,
      };
    }

    const payload = {
      name: name.trim(),
      email: email ? email.trim() : undefined,
      contact: phone ? phone.replace(/[^0-9]/g, '').slice(-10) : undefined,
      type: 'vendor',
      reference_id: referenceId || undefined,
      notes: { role: 'delivery_partner', platform: 'VEXIVO' },
    };

    const res = await fetch(`${this.baseUrl}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error?.description || 'Failed to create RazorpayX Contact');
      err.providerError = data.error;
      throw err;
    }
    return data;
  }

  /**
   * Create Fund Account (Bank Account or VPA/UPI)
   */
  async createFundAccount({ contactId, accountType, bankAccount, vpa }) {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('RazorpayX payout provider is not configured in production mode. Fund account creation is blocked.');
      }
      return {
        id: `fa_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contact_id: contactId,
        account_type: accountType || (vpa ? 'vpa' : 'bank_account'),
        active: true,
        simulated: true,
      };
    }

    const payload = {
      contact_id: contactId,
      account_type: accountType,
    };

    if (accountType === 'bank_account') {
      payload.bank_account = {
        name: bankAccount.name,
        ifsc: bankAccount.ifsc.toUpperCase().trim(),
        account_number: bankAccount.accountNumber.trim(),
      };
    } else if (accountType === 'vpa') {
      payload.vpa = {
        address: vpa.address.toLowerCase().trim(),
      };
    }

    const res = await fetch(`${this.baseUrl}/fund_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error?.description || 'Failed to create RazorpayX Fund Account');
      err.providerError = data.error;
      throw err;
    }
    return data;
  }

  /**
   * Initiate Bank/UPI Payout with strict Idempotency Key
   */
  async createPayout({
    fundAccountId,
    amountRupees,
    mode = 'IMPS',
    purpose = 'payout',
    referenceId,
    narration = 'VEXIVO RIDER PAYOUT',
    idempotencyKey,
  }) {
    // RazorpayX expects amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amountRupees) * 100);

    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('RazorpayX payout provider credentials (RAZORPAYX_KEY_ID, RAZORPAYX_KEY_SECRET, RAZORPAYX_ACCOUNT_NUMBER) are missing in production. Real payout transfers are strictly blocked.');
      }
      // Safe sandbox mode when keys are not configured in environment
      return {
        id: `pout_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        fund_account_id: fundAccountId,
        amount: amountInPaise,
        currency: 'INR',
        notes: { referenceId },
        fees: 0,
        tax: 0,
        status: 'processing', // Standard initial state in RazorpayX
        purpose,
        mode,
        reference_id: referenceId,
        narration,
        simulated: true,
      };
    }

    const payload = {
      account_number: this.getAccountNumber(),
      fund_account_id: fundAccountId,
      amount: amountInPaise,
      currency: 'INR',
      mode: mode.toUpperCase(),
      purpose,
      queue_if_low_balance: true,
      reference_id: referenceId,
      narration: narration.substring(0, 30),
      notes: {
        platform: 'VEXIVO Logistics',
        referenceId,
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.getAuthHeader(),
    };

    if (idempotencyKey) {
      headers['X-Payout-Idempotency'] = idempotencyKey;
    }

    const res = await fetch(`${this.baseUrl}/payouts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error?.description || 'RazorpayX Payout creation failed');
      err.providerError = data.error;
      err.statusCode = res.status;
      throw err;
    }
    return data;
  }

  /**
   * Fetch Payout details by provider payoutId
   */
  async getPayout(payoutId) {
    if (!this.isConfigured() || payoutId.startsWith('pout_sim_')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('RazorpayX payout provider is not configured or simulated payout ID received in production mode.');
      }
      return {
        id: payoutId,
        status: 'processed',
        simulated: true,
      };
    }

    const res = await fetch(`${this.baseUrl}/payouts/${payoutId}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error?.description || 'Failed to retrieve payout from RazorpayX');
      err.providerError = data.error;
      throw err;
    }
    return data;
  }

  /**
   * Verify official RazorpayX Webhook Signature (HMAC SHA-256)
   */
  verifyWebhookSignature(rawBody, signature) {
    const secret = this.getWebhookSecret();
    if (!secret) {
      // If secret is not configured, reject signature verification in production
      if (process.env.NODE_ENV === 'production') return false;
      return true; // permissive in non-production test mode
    }

    if (!rawBody || !signature) return false;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    } catch {
      return false;
    }
  }
}

module.exports = new RazorpayXService();
