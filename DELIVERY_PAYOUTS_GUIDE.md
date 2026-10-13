# VEXIVO — Flipkart-Style Delivery Partner Earnings & Payout System

## 1. Executive Summary & Architecture Overview

The VEXIVO Delivery Partner Earnings & Payout System is a production-ready financial settlement pipeline engineered to emulate Indian e-commerce logistics leaders like Flipkart (Ekart Logistics) and Delhivery. 

### Core Tech Stack
* **Database:** MongoDB with Mongoose (Atomic reservation & duplicate-resistant ledgers).
* **Backend:** Node.js / Express with JWT authentication and strict role-based access control (`delivery_partner`, `admin`).
* **Media & Cloud Storage:** Supabase Storage (zero Firebase dependency).
* **Payout Gateway:** RazorpayX official Indian REST API integration with HMAC SHA-256 webhook validation, idempotent transaction keys, and automated failure rollback.
* **Frontend:** React + Tailwind CSS with responsive Flipkart-inspired rider earnings dashboard and comprehensive admin financial control suite.

---

## 2. Earnings Calculation & Immutable Ledger System

Earnings are credited to an immutable audit ledger (`DeliveryEarningLedger`) upon verified delivery or return pickup.

### Earnings Formula
$$\text{Gross Earning} = \text{Base Fee} + \text{Distance Incentive} + \text{Surge Fees} + \text{SLA Bonuses}$$

1. **Standard Delivery Base Fee:** Configurable (Default ₹50.00). Credited when order transitions to `delivered`.
2. **Doorstep Return Pickup Fee:** Configurable (Default ₹40.00). Credited when return shipment transitions to `picked_up`.
3. **Long-Distance Incentive:** Distance exceeding configurable threshold (Default 3 km) is calculated at ₹5.00/km:
   $$\text{Distance Bonus} = (\text{Estimated Distance (km)} - 3) \times ₹5.00$$
4. **Rain & Weather Surge:** Dynamic surge fee (Default ₹15.00) activated during adverse weather conditions.
5. **Festival / Peak Surge:** Dynamic festival demand incentive (Default ₹20.00).
6. **On-Time SLA Bonus:** Monthly/weekly performance bonus for partners maintaining $\ge 95\%$ on-time dispatch rate.

### Financial Safety & Anti-Fraud
* **Compound Unique Index:** `{ deliveryPartner: 1, order: 1, type: 1 }` prevents double-crediting if callbacks or updates trigger more than once.
* **Separation of Balances:**
  * `availablePayoutBalance`: Unlocked funds eligible for payout.
  * `pendingPayoutAmount`: In-flight funds reserved during gateway processing.
  * `totalPaidOut`: Lifetime successfully disbursed funds confirmed via gateway UTR.

---

## 3. Payout Settlement & Withdrawal Policy

* **Configurable Settlement Schedule:** Admin selects payout cadence: Daily, Weekly (Every Monday), Bi-weekly, Monthly, or Manual withdrawal.
* **Minimum Payout Threshold:** Configurable threshold (Default ₹500.00). Withdrawal is rejected if eligible balance is below this amount.
* **TDS Deduction (Indian Tax Compliance):** Automatically applies Section 194C contractor TDS (Default 1.0%) on gross earnings prior to gateway dispatch.
* **Emergency Circuit Breaker:** Admin toggle (`isPayoutsPaused`) immediately blocks automated and manual payouts during maintenance or audit windows.

---

## 4. RazorpayX Payout Gateway Integration

The system natively interfaces with RazorpayX using Node.js `crypto` and `fetch` with no unnecessary external dependencies.

### Environment Variables
Configure the following in `server/.env`:

```env
# RazorpayX Indian Payout Credentials
RAZORPAYX_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAYX_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAYX_ACCOUNT_NUMBER=7878780080316316
RAZORPAYX_WEBHOOK_SECRET=your_configured_webhook_secret_here

# Payout Mode: 'IMPS' (Instant Bank), 'NEFT', 'RTGS', or 'UPI'
DEFAULT_PAYOUT_MODE=IMPS
```

> **Sandbox / Simulation Mode:** When credentials are omitted in development or staging, the system automatically activates a safe simulation sandbox, allowing seamless end-to-end testing without incurring bank fees or failing network requests.

### RazorpayX Lifecycle & Webhook Events
Mount Point: `POST /api/webhooks/razorpayx`

| Webhook Event | Meaning | System Action |
|---|---|---|
| `payout.processed` | Bank transfer succeeded and UTR issued. | Sets payout status to `paid`, marks ledger entries as `paid`, shifts pending funds to `totalPaidOut`. |
| `payout.failed` / `payout.rejected` | Bank rejected transfer (e.g. invalid IFSC, closed account). | Sets payout status to `failed`, safely releases locked ledger items back to `eligible`, restores funds to rider's `availablePayoutBalance`. |
| `payout.reversed` | Gateway reversed settled transfer. | Sets payout status to `reversed`, marks ledger entries `reversed` for financial reconciliation. |

### Webhook Signature Verification
Every incoming webhook is verified with HMAC SHA-256 against `req.rawBody` and `x-razorpay-signature`:
$$\text{Expected Signature} = \text{HMAC-SHA256}(\text{rawBody}, \text{RAZORPAYX\_WEBHOOK\_SECRET})$$

---

## 5. Delivery Partner Dashboard UI

Located in the Delivery Partner Portal (`/delivery/dashboard` $\rightarrow$ **Earnings & Payouts** tab):

* **KPI Cards:** Today's Earnings, This Week, This Month, Lifetime Total, and Available Payout Balance.
* **Eligibility Progress Bar:** Visual bar indicating distance to minimum payout threshold (e.g., ₹240 / ₹500 earned).
* **Payout Destination Modal:** Riders can register and verify:
  * Bank Account (Account Holder Name, Account Number, IFSC Code, Bank Name)
  * UPI ID (`username@bank` / `phone@upi`)
  * Masked security display (e.g., `••••••••1234`).
* **Request Payout Button:** One-click withdrawal when balance $\ge$ threshold.
* **Payout History Table:** Displays Date, Payout ID, Payment Mode, UTR/Reference ID, Status badge (`Paid`, `Processing`, `Failed`), and exact failure reasons.

---

## 6. Admin Payout Control Center

Located in the Admin Navigation Menu (`/admin/delivery-payouts`):

* **Summary Metrics:** Total Disbursed, Total Pending In-Flight, Total Outstanding Payable, and Active Partner counts.
* **Batch Settlement Runner:** One-click automated settlement that discovers all eligible riders exceeding threshold and creates batch payouts.
* **Policy Settings Modal:** Real-time updates for base fees, return pickup rates, rain surge fees, distance rates, minimum threshold, TDS percentage, and payout schedule.
* **Manual Audited Adjustment:** Ability to credit performance bonuses or apply verified deductions with full audit comments.
* **Payout Reconciliation:** One-click reconciliation button that fetches live status from RazorpayX for any stuck or pending transfer.

---

## 7. Production Activation Checklist

1. **KYC & Bank Verification:**
   * Partner inputs Account Number & IFSC or UPI ID.
   * Bank IFSC format validated via regex: `^[A-Z]{4}0[A-Z0-9]{6}$`.
   * UPI ID format validated via regex: `^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$`.
2. **RazorpayX Dashboard Setup:**
   * Create an API Key in RazorpayX Dashboard $\rightarrow$ Settings $\rightarrow$ API Keys.
   * Note the Virtual Account Number (`RAZORPAYX_ACCOUNT_NUMBER`).
   * Setup Webhook in RazorpayX Dashboard:
     * Webhook URL: `https://yourdomain.com/api/webhooks/razorpayx`
     * Secret: Enter a strong random string and put in `RAZORPAYX_WEBHOOK_SECRET`.
     * Events to subscribe: `payout.processed`, `payout.failed`, `payout.rejected`, `payout.reversed`.
3. **Run Test Suite:**
   ```bash
   node server/test-delivery-payouts.js
   ```
   Verify 100% test pass rate across all 9 tests.
4. **Build & Deploy Frontend:**
   ```bash
   cd client && npm run build
   ```
