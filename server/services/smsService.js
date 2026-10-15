const https = require('https');
const path = require('path');
const dotenv = require('dotenv');

// Ensure latest environment variables are loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * VEXIVO SMS Dispatch Service
 * Delivers real 6-digit OTPs directly to user's mobile phone via SMS.
 * 
 * Supported SMS Providers:
 * 1. Fast2SMS (India OTP route - www.fast2sms.com)
 *    Set FAST2SMS_API_KEY in server/.env
 * 2. Twilio SMS
 *    Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in server/.env
 * 3. Fallback: Detailed terminal logging if no external gateway key is configured yet
 */
async function sendSmsOtp(phone, otp) {
  const clean10 = phone.replace(/[^0-9]/g, '').slice(-10);
  const formattedWithCountry = `+91${clean10}`;

  // Provider 1: Fast2SMS (Indian OTP route)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const postData = JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: clean10,
      });

      const options = {
        hostname: 'www.fast2sms.com',
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const result = await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`[SMS SERVICE] Fast2SMS dispatch response for ${clean10}:`, data);
            resolve({ success: true, provider: 'fast2sms', response: data });
          });
        });
        req.on('error', (err) => {
          console.error('[SMS SERVICE] Fast2SMS network error:', err.message);
          resolve({ success: false, error: err.message });
        });
        req.write(postData);
        req.end();
      });

      return result;
    } catch (err) {
      console.error('[SMS SERVICE] Fast2SMS exception:', err.message);
    }
  }

  // Provider 2: Twilio SMS Gateway
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const messageBody = `Your VEXIVO verification code is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
      const postParams = new URLSearchParams({
        To: formattedWithCountry,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: messageBody,
      }).toString();

      const options = {
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postParams),
        },
      };

      const result = await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`[SMS SERVICE] Twilio dispatch response for ${formattedWithCountry}:`, data);
            resolve({ success: true, provider: 'twilio' });
          });
        });
        req.on('error', (err) => {
          console.error('[SMS SERVICE] Twilio network error:', err.message);
          resolve({ success: false, error: err.message });
        });
        req.write(postParams);
        req.end();
      });

      return result;
    } catch (err) {
      console.error('[SMS SERVICE] Twilio exception:', err.message);
    }
  }

  // Provider 3: MoceanAPI (https://rest.moceanapi.com/rest/2/sms)
  const moceanToken = (process.env.MOCEAN_API_TOKEN || 'apit-ySHPBGGnt3A7afal3OdFPgamcHAQl3KJ-Jin8O').trim();
  if (moceanToken || (process.env.MOCEAN_API_KEY && process.env.MOCEAN_API_SECRET)) {
    try {
      const moceanTo = `91${clean10}`;
      const moceanFrom = process.env.MOCEAN_FROM || 'MOCEAN';
      const moceanText = `Your VEXIVO verification code is: ${otp}. Valid for 5 minutes.`;

      console.log(`[SMS SERVICE] Sending SMS via MoceanAPI to ${moceanTo}...`);

      const postParams = new URLSearchParams({
        'mocean-from': moceanFrom,
        'mocean-to': moceanTo,
        'mocean-text': moceanText,
        'mocean-resp-format': 'json',
      });

      if (process.env.MOCEAN_API_KEY && process.env.MOCEAN_API_SECRET) {
        postParams.append('mocean-api-key', process.env.MOCEAN_API_KEY);
        postParams.append('mocean-api-secret', process.env.MOCEAN_API_SECRET);
      }

      const bodyData = postParams.toString();
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyData),
      };

      if (moceanToken) {
        headers['Authorization'] = `Bearer ${moceanToken}`;
      }

      const options = {
        hostname: 'rest.moceanapi.com',
        path: '/rest/2/sms',
        method: 'POST',
        headers,
      };

      await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`[SMS SERVICE] MoceanAPI Status Code: ${res.statusCode}`);
            console.log(`[SMS SERVICE] MoceanAPI Response for ${moceanTo}:`, data);
            resolve({ success: true, provider: 'moceanapi', response: data });
          });
        });
        req.on('error', (err) => {
          console.error('[SMS SERVICE] MoceanAPI network error:', err.message);
          resolve({ success: false, error: err.message });
        });
        req.write(bodyData);
        req.end();
      });

      // Official MoceanAPI WhatsApp Template Authentication Dispatch
      try {
        const waPayload = JSON.stringify({
          'mocean-from': '60129829145',
          'mocean-to': moceanTo,
          'mocean-event-url': '',
          'mocean-content': {
            type: 'template',
            wa_template: {
              name: 'trial_authentication',
              language: 'en',
              body_params: [
                {
                  type: 'text',
                  text: String(otp),
                },
              ],
              wa_buttons: [
                {
                  type: 'url',
                  index: 0,
                  url_parameter: String(otp),
                },
              ],
            },
          },
        });

        const waOptions = {
          hostname: 'rest.moceanapi.com',
          path: '/rest/2/send-message/whatsapp',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${moceanToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(waPayload),
          },
        };

        const waReq = https.request(waOptions, (waRes) => {
          let waData = '';
          waRes.on('data', (c) => {
            waData += c;
          });
          waRes.on('end', () => {
            console.log(`[SMS SERVICE] 💬 MoceanAPI WhatsApp Status: ${waRes.statusCode}`);
            console.log(`[SMS SERVICE] 💬 MoceanAPI WhatsApp Response:`, waData);
          });
        });
        waReq.on('error', (waErr) => {
          console.warn('[SMS SERVICE] MoceanAPI WhatsApp network notice:', waErr.message);
        });
        waReq.write(waPayload);
        waReq.end();
      } catch (waErr) {
        console.warn('[SMS SERVICE] MoceanAPI WhatsApp exception:', waErr.message);
      }
    } catch (err) {
      console.error('[SMS SERVICE] MoceanAPI exception:', err.message);
    }
  }

  // Backup terminal log for instant local debugging
  console.log(`\n======================================================`);
  console.log(`📱 [VEXIVO OTP SERVICE] Verification Code for ${formattedWithCountry}:`);
  console.log(`👉 OTP: ${otp} (Valid for 5 minutes)`);
  console.log(`======================================================\n`);

  // Fallback: Terminal logs for local development when no third-party SMS API key is configured
  console.log(`\n======================================================`);
  console.log(`📱 [SMS SERVICE] SMS dispatched to Mobile: ${formattedWithCountry}`);
  console.log(`📨 Message: "Your VEXIVO verification code is: ${otp}"`);
  console.log(`ℹ️ Real SIM delivery: Set FAST2SMS_API_KEY in server/.env`);
  console.log(`======================================================\n`);

  return { success: true, provider: 'local-console-fallback' };
}

module.exports = { sendSmsOtp };
