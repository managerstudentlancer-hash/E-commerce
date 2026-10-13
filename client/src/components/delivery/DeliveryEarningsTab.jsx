import React, { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Building2,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  HelpCircle,
  FileText,
} from 'lucide-react';
import api from '../../services/api';

const DeliveryEarningsTab = ({ onRefreshProfile }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Data states
  const [summary, setSummary] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [config, setConfig] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [ledgerTotal, setLedgerTotal] = useState(0);
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerPages, setLedgerPages] = useState(1);
  const [ledgerFilter, setLedgerFilter] = useState('');

  const [payouts, setPayouts] = useState([]);
  const [payoutsTotal, setPayoutsTotal] = useState(0);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [payoutsPages, setPayoutsPages] = useState(1);

  const [bankDetails, setBankDetails] = useState(null);

  // Modals
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
  });
  const [bankSaving, setBankSaving] = useState(false);
  const [bankError, setBankError] = useState('');

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchEarningsData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [sumRes, ledgRes, payRes, bankRes] = await Promise.all([
        api.delivery.getEarningsSummary().catch(() => null),
        api.delivery.getEarningsLedger({ page: ledgerPage, type: ledgerFilter }).catch(() => null),
        api.delivery.getPayouts({ page: payoutsPage }).catch(() => null),
        api.delivery.getBankDetails().catch(() => null),
      ]);

      if (sumRes?.success) {
        setSummary(sumRes.summary);
        setEligibility(sumRes.eligibility);
        setConfig(sumRes.config);
      }

      if (ledgRes?.success) {
        setLedger(ledgRes.ledger || []);
        setLedgerTotal(ledgRes.total || 0);
        setLedgerPages(ledgRes.pages || 1);
      }

      if (payRes?.success) {
        setPayouts(payRes.payouts || []);
        setPayoutsTotal(payRes.total || 0);
        setPayoutsPages(payRes.pages || 1);
      }

      if (bankRes?.success) {
        setBankDetails(bankRes.bankDetails);
        setBankForm((prev) => ({
          ...prev,
          accountHolderName: bankRes.bankDetails.accountHolderName || '',
          ifscCode: bankRes.bankDetails.ifscCode || '',
          bankName: bankRes.bankDetails.bankName || '',
          upiId: bankRes.bankDetails.upiId || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load earnings data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankError('');

    if (!bankForm.accountHolderName.trim()) {
      setBankError('Account holder name is required.');
      return;
    }

    if (!bankForm.upiId && !bankForm.accountNumber) {
      setBankError('Please enter either a Bank Account Number or a UPI ID.');
      return;
    }

    if (bankForm.accountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      setBankError('Bank account numbers do not match.');
      return;
    }

    setBankSaving(true);
    try {
      const res = await api.delivery.updateBankDetails({
        accountHolderName: bankForm.accountHolderName,
        accountNumber: bankForm.accountNumber || undefined,
        ifscCode: bankForm.ifscCode ? bankForm.ifscCode.toUpperCase() : undefined,
        bankName: bankForm.bankName || undefined,
        upiId: bankForm.upiId || undefined,
      });

      if (res.success) {
        setBankDetails(res.bankDetails);
        setShowBankModal(false);
        showToast('Payout destination verified and updated successfully!');
        fetchEarningsData();
        if (onRefreshProfile) onRefreshProfile();
      }
    } catch (err) {
      setBankError(err.message || 'Failed to update bank details');
    } finally {
      setBankSaving(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    setWithdrawError('');
    setWithdrawLoading(true);
    try {
      const res = await api.delivery.requestWithdrawal();
      if (res.success) {
        setShowWithdrawModal(false);
        showToast('Payout initiated! Bank transfer will be credited per IMPS/UPI clearing.');
        fetchEarningsData();
        if (onRefreshProfile) onRefreshProfile();
      }
    } catch (err) {
      setWithdrawError(err.message || 'Withdrawal request failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs font-semibold text-slate-400">Loading your earnings and payout ledger...</p>
      </div>
    );
  }

  const s = summary || {};
  const elig = eligibility || {};
  const cfg = config || {};
  const minThreshold = elig.minimumPayoutThreshold || 500;
  const availBalance = s.availablePayoutBalance || 0;
  const thresholdProgress = Math.min(100, Math.round((availBalance / minThreshold) * 100));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Flipkart Fleet Earnings & Payout Center</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Real-time delivery compensation, surge incentives, and automated bank settlements.
          </p>
        </div>
        <button
          onClick={() => fetchEarningsData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Balance'}</span>
        </button>
      </div>

      {/* Hero Available Balance & Fast Withdrawal Card */}
      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                Ready for Payout
              </span>
              {elig.isPaused && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Settlements Paused
                </span>
              )}
            </div>

            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Available Payable Balance</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                ₹{availBalance.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Net Eligible</span>
            </div>

            {/* Threshold Progress */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>Threshold: ₹{minThreshold}</span>
                <span className={availBalance >= minThreshold ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {thresholdProgress}% {availBalance >= minThreshold ? '• Eligible' : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${thresholdProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={!elig.isEligible}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Wallet className="w-4 h-4" />
              <span>Request Payout</span>
            </button>

            {/* Ineligibility Reason Note */}
            {!elig.isEligible && elig.reasons && elig.reasons.length > 0 && (
              <p className="text-[11px] text-amber-300/90 text-left md:text-right max-w-xs leading-relaxed">
                ℹ️ {elig.reasons[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Today's Earnings</span>
          </span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
            ₹{(s.todayEarnings || 0).toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400">From verified dropoffs today</p>
        </div>

        {/* This Week */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>This Week</span>
          </span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ₹{(s.weekEarnings || 0).toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400">Settles on {cfg.payoutSchedule === 'weekly_monday' ? 'Monday' : 'Schedule'}</p>
        </div>

        {/* This Month */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-purple-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>This Month</span>
          </span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
            ₹{(s.monthEarnings || 0).toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400">Includes surges & incentives</p>
        </div>

        {/* Lifetime Paid Out */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Paid Out</span>
          </span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-white">
            ₹{(s.totalPaid || 0).toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400">Settled to your bank account</p>
        </div>
      </div>

      {/* Middle Row: Bank Destination & Rate Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Payout Destination Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Payout Destination</span>
            </h3>
            <button
              onClick={() => {
                setBankError('');
                setShowBankModal(true);
              }}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              {bankDetails?.isVerified ? 'Edit Account' : 'Set Up Account'}
            </button>
          </div>

          {bankDetails?.isVerified ? (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="font-bold text-white">{bankDetails.accountHolderName}</span>
              </div>
              {bankDetails.accountNumberMasked && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bank Account:</span>
                  <span className="font-mono font-bold text-white">{bankDetails.accountNumberMasked}</span>
                </div>
              )}
              {bankDetails.ifscCode && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono font-bold text-emerald-400">{bankDetails.ifscCode}</span>
                </div>
              )}
              {bankDetails.upiId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UPI VPA:</span>
                  <span className="font-mono font-bold text-purple-400">{bankDetails.upiId}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Destination</span>
                </span>
                <span className="text-slate-400">Direct IMPS / UPI</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
              <p className="font-bold">⚠️ No Payout Destination Configured</p>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Add your bank account number + IFSC code or UPI ID so VEXIVO can transfer your earnings directly.
              </p>
              <button
                onClick={() => {
                  setBankError('');
                  setShowBankModal(true);
                }}
                className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Add Bank / UPI Details
              </button>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">🛡️ 100% Secure Clearing:</p>
            <p className="text-[10px] leading-relaxed">
              Bank transfers are cleared via Reserve Bank of India (RBI) authorized payment gateways. 1% TDS deducted per Section 194C Indian Contractor norms.
            </p>
          </div>
        </div>

        {/* Earning Rates Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Configurable VEXIVO Earnings Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Standard Dropoff Base Pay</span>
              <p className="text-lg font-black font-mono text-emerald-400">₹{cfg.baseDeliveryFee || 50}.00</p>
              <p className="text-[10px] text-slate-500">Credited upon Customer OTP verification</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Return Doorstep Pickup</span>
              <p className="text-lg font-black font-mono text-purple-400">₹{cfg.returnPickupFee || 40}.00</p>
              <p className="text-[10px] text-slate-500">Reverse logistics pickup from customer</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Rain / Adverse Weather Surge</span>
              <p className="text-lg font-black font-mono text-amber-400">+₹{cfg.rainSurgeFee || 15}.00</p>
              <p className="text-[10px] text-slate-500">Added automatically during monsoon surge</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Long-Distance Incentive</span>
              <p className="text-lg font-black font-mono text-cyan-400">₹{cfg.distanceRatePerKm || 5}.00 / km</p>
              <p className="text-[10px] text-slate-500">For transit beyond {cfg.distanceThresholdKm || 3} km threshold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deliveries Immutable Ledger Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Deliveries Earnings Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified order dropoffs and applicable delivery compensation.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total Records: {ledgerTotal}</span>
        </div>

        {ledger.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-300">No earnings recorded in this period yet.</p>
            <p>Complete customer order dropoffs with verified Delivery OTP to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar touch-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Earning Type</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledger.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {item.orderNumber || 'Adjustment'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(item.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                      {item.metadata?.distanceKm > 0 && (
                        <span className="text-[10px] text-slate-400 ml-1">({item.metadata.distanceKm} km)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-400">
                      ₹{Number(item.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'eligible'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'paid'
                            ? 'bg-blue-500/20 text-blue-300'
                            : item.status === 'locked_for_payout'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout History Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payout Settlement History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable bank settlement transactions, reference IDs, and clearing status.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total Payouts: {payoutsTotal}</span>
        </div>

        {payouts.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No payout settlement requests generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar touch-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Payout ID</th>
                  <th className="py-3 px-3">Initiated Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Reference / UTR</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{p.payoutNumber}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(p.initiatedAt || p.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-400">
                      ₹{Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-bold">{p.mode || 'IMPS'}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {p.providerReferenceId || 'Processing...'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'processing' || p.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : p.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Bank Details Setup / Edit */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>Bank / UPI Payout Destination</span>
              </h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bankError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                {bankError}
              </div>
            )}

            <form onSubmit={handleBankSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Account Holder Legal Name *</label>
                <input
                  type="text"
                  required
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                  placeholder="As per bank passbook / PAN"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Option A: Direct Bank Account (Recommended)
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      placeholder="e.g. 50100234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Confirm Account Number</label>
                    <input
                      type="text"
                      value={bankForm.confirmAccountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                      placeholder="Re-enter bank account number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={bankForm.ifscCode}
                        onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 outline-none font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2">
                  Option B: UPI ID (Instant Transfer)
                </span>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">UPI Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={bankForm.upiId}
                    onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                    placeholder="e.g. rider@okhdfcbank or 9876543210@paytm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-purple-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bankSaving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {bankSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{bankSaving ? 'Saving...' : 'Verify & Save Destination'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Withdrawal Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>Confirm Payout Withdrawal</span>
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                {withdrawError}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Eligible Balance:</span>
                <span className="font-mono font-bold text-white">₹{availBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TDS Deduction (1% Sec 194C):</span>
                <span className="font-mono font-bold text-amber-400">
                  -₹{((availBalance * (cfg.tdsPercentage || 1)) / 100).toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black">
                <span className="text-white">Net Bank Deposit:</span>
                <span className="font-mono text-emerald-400 text-base">
                  ₹{(availBalance - (availBalance * (cfg.tdsPercentage || 1)) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="font-bold">Transfer To:</p>
              <p className="font-mono text-white bg-slate-950 p-2.5 rounded-xl border border-white/5">
                {bankDetails?.accountHolderName} • {bankDetails?.accountNumberMasked || bankDetails?.upiId}
              </p>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              ⚠️ Payout transfer will be dispatched directly to your verified bank account via IMPS / UPI. Standard clearing window: 5-30 minutes.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={withdrawLoading}
                onClick={handleWithdrawSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 disabled:opacity-50"
              >
                {withdrawLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{withdrawLoading ? 'Processing...' : 'Confirm Bank Transfer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryEarningsTab;
