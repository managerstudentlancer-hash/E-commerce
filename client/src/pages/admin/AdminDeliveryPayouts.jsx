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
  Sliders,
  Filter,
  Search,
  Check,
  FileText,
  User,
  Power,
  Zap,
} from 'lucide-react';
import api from '../../services/api';

const AdminDeliveryPayouts = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Overview metrics
  const [metrics, setMetrics] = useState({
    totalDisbursed: 0,
    pendingVolume: 0,
    pendingCount: 0,
    failedCount: 0,
    paidCount: 0,
    activeRidersCount: 0,
    isPaused: false,
  });

  // Payouts list
  const [payouts, setPayouts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Config modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [configError, setConfigError] = useState('');

  // Manual Adjustment modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [riders, setRiders] = useState([]);
  const [adjustForm, setAdjustForm] = useState({
    partnerId: '',
    type: 'adjustment_credit',
    amount: '',
    description: '',
  });
  const [adjustSaving, setAdjustSaving] = useState(false);
  const [adjustError, setAdjustError] = useState('');

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    fetchOverview();
    fetchPayoutsList();
    fetchConfig();
  }, [page, statusFilter]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchOverview = async () => {
    try {
      const res = await api.adminLogistics.getPayoutsOverview();
      if (res?.success) {
        setMetrics(res.metrics || {});
      }
    } catch (err) {
      console.error('Failed to load payout overview:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await api.adminLogistics.getPayoutConfig();
      if (res?.success) {
        setConfig(res.config);
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  };

  const fetchPayoutsList = async (manualRefresh = false) => {
    if (manualRefresh) setRefreshing(true);
    try {
      const res = await api.adminLogistics.getPayoutsList({
        page,
        status: statusFilter,
      });
      if (res?.success) {
        setPayouts(res.payouts || []);
        setTotalCount(res.total || 0);
        setPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load payouts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await api.adminLogistics.getDeliveryPartners();
      if (res?.success) {
        setRiders(res.partners || []);
      }
    } catch (err) {
      console.error('Failed to load riders list:', err);
    }
  };

  const handleConfigSave = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigError('');
    try {
      const res = await api.adminLogistics.updatePayoutConfig(config);
      if (res?.success) {
        setConfig(res.config);
        setShowConfigModal(false);
        showToast('Logistics payout configuration updated successfully!');
        fetchOverview();
      }
    } catch (err) {
      setConfigError(err.message || 'Failed to update configuration');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setAdjustSaving(true);
    setAdjustError('');
    try {
      const res = await api.adminLogistics.adjustEarning(adjustForm);
      if (res?.success) {
        setShowAdjustModal(false);
        showToast('Earning adjustment applied to rider ledger!');
        setAdjustForm({
          partnerId: '',
          type: 'adjustment_credit',
          amount: '',
          description: '',
        });
        fetchOverview();
        fetchPayoutsList();
      }
    } catch (err) {
      setAdjustError(err.message || 'Failed to apply adjustment');
    } finally {
      setAdjustSaving(false);
    }
  };

  const handleBatchSettle = async () => {
    if (!window.confirm('Run batch settlement for all eligible riders meeting the minimum payout threshold?')) {
      return;
    }
    setBatchLoading(true);
    try {
      const res = await api.adminLogistics.batchSettlePayouts();
      if (res?.success) {
        showToast(res.message || 'Batch settlement executed successfully!');
        fetchOverview();
        fetchPayoutsList();
      }
    } catch (err) {
      showToast(err.message || 'Batch settlement failed');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleReconcile = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await api.adminLogistics.reconcilePayout(id);
      if (res?.success) {
        showToast(res.message || 'Payout reconciled with gateway!');
        fetchOverview();
        fetchPayoutsList();
      }
    } catch (err) {
      showToast(err.message || 'Reconciliation failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRetry = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await api.adminLogistics.retryPayout(id);
      if (res?.success) {
        showToast('Payout retried and submitted to gateway!');
        fetchOverview();
        fetchPayoutsList();
      }
    } catch (err) {
      showToast(err.message || 'Retry failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.payoutNumber && p.payoutNumber.toLowerCase().includes(q)) ||
      (p.deliveryPartner?.name && p.deliveryPartner.name.toLowerCase().includes(q)) ||
      (p.providerReferenceId && p.providerReferenceId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Delivery Fleet Payouts & Settlement</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
              RazorpayX Gateway
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Automated bank settlement ledger, provider transaction reconciliation, and rider compensation controls.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              fetchRiders();
              setShowAdjustModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Adjustment</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Payout Policy & Rates</span>
          </button>

          <button
            onClick={handleBatchSettle}
            disabled={batchLoading || metrics.isPaused}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md active:scale-95 disabled:opacity-40"
          >
            {batchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>Batch Settle Queue</span>
          </button>

          <button
            onClick={() => {
              fetchOverview();
              fetchPayoutsList(true);
            }}
            disabled={refreshing}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Circuit Breaker Warning Banner */}
      {metrics.isPaused && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-200 text-xs font-semibold">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>EMERGENCY CIRCUIT BREAKER ACTIVE:</strong> Automatic delivery payouts are currently paused by administrator.
            </span>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] uppercase"
          >
            Resume Payouts
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Disbursed */}
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-emerald-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Total Disbursed (Paid)</span>
          </span>
          <p className="text-3xl font-black font-mono text-emerald-400">
            ₹{Number(metrics.totalDisbursed || 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-neutral-400">Total settled to delivery partner accounts</p>
        </div>

        {/* In-Flight Processing Volume */}
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-amber-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>In-Flight Processing</span>
          </span>
          <p className="text-3xl font-black font-mono text-amber-400">
            ₹{Number(metrics.pendingVolume || 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-neutral-400">{metrics.pendingCount || 0} transaction(s) at clearing gateway</p>
        </div>

        {/* Failed Payouts */}
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-rose-500/20 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Failed Payouts</span>
          </span>
          <p className="text-3xl font-black font-mono text-rose-400">{metrics.failedCount || 0}</p>
          <p className="text-[11px] text-neutral-400">Action required: inspect & retry</p>
        </div>

        {/* Active Riders */}
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Fleet Riders</span>
          </span>
          <p className="text-3xl font-black font-mono text-white">{metrics.activeRidersCount || 0}</p>
          <p className="text-[11px] text-neutral-400">Min. payout threshold: ₹{config?.minimumPayoutThreshold || 500}</p>
        </div>
      </div>

      {/* Payouts Ledger Table Card */}
      <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'pending', 'processing', 'paid', 'failed', 'reversed'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Payout ID, Rider, UTR..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {filteredPayouts.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            No payout transactions match your search/filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Payout ID</th>
                  <th className="py-3 px-3">Delivery Partner</th>
                  <th className="py-3 px-3">Amount (INR)</th>
                  <th className="py-3 px-3">Beneficiary Account</th>
                  <th className="py-3 px-3">Provider Reference</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredPayouts.map((p) => {
                  const isActing = actionLoadingId === p._id;
                  return (
                    <tr key={p._id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-white block">{p.payoutNumber}</span>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(p.initiatedAt || p.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-white block">{p.deliveryPartner?.name || 'Rider'}</span>
                        <span className="text-[10px] text-neutral-400">{p.deliveryPartner?.phone || 'No phone'}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-mono font-black text-emerald-400 text-sm block">
                          ₹{Number(p.amount).toFixed(2)}
                        </span>
                        {p.tdsAmount > 0 && (
                          <span className="text-[10px] text-neutral-400">TDS: ₹{p.tdsAmount}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-neutral-300 font-semibold block">
                          {p.beneficiary?.accountHolderName || 'N/A'}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 block">
                          {p.beneficiary?.accountNumberMasked || p.beneficiary?.upiId || 'No account'}
                          {p.beneficiary?.ifscCode ? ` • ${p.beneficiary.ifscCode}` : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] text-neutral-300 block">
                          {p.providerReferenceId || 'Pending Gateway'}
                        </span>
                        {p.failureReason && (
                          <span className="text-[10px] text-rose-400 block max-w-xs truncate" title={p.failureReason}>
                            ⚠️ {p.failureReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
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

                      <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleReconcile(p._id)}
                          disabled={isActing}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-bold"
                          title="Query Gateway Status"
                        >
                          {isActing ? 'Syncing...' : 'Reconcile'}
                        </button>
                        {p.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(p._id)}
                            disabled={isActing}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/30"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Config Drawer / Modal */}
      {showConfigModal && config && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Logistics Earning Rates & Payout Policy</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {configError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                {configError}
              </div>
            )}

            <form onSubmit={handleConfigSave} className="space-y-4 text-xs">
              {/* Earning Rates */}
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Delivery Partner Rate Schedule (INR)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Base Delivery Fee (₹)</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={config.baseDeliveryFee}
                      onChange={(e) => setConfig({ ...config, baseDeliveryFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Return Pickup Fee (₹)</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={config.returnPickupFee}
                      onChange={(e) => setConfig({ ...config, returnPickupFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Rain Surge Bonus (₹)</label>
                    <input
                      type="number"
                      step="1"
                      value={config.rainSurgeFee}
                      onChange={(e) => setConfig({ ...config, rainSurgeFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Distance Rate (₹ / km above 3km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={config.distanceRatePerKm}
                      onChange={(e) => setConfig({ ...config, distanceRatePerKm: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payout Policies */}
              <div className="pt-3 border-t border-neutral-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Settlement & Withdrawal Policy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Minimum Payout Threshold (₹)</label>
                    <input
                      type="number"
                      step="50"
                      required
                      value={config.minimumPayoutThreshold}
                      onChange={(e) => setConfig({ ...config, minimumPayoutThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Settlement Cycle</label>
                    <select
                      value={config.payoutSchedule}
                      onChange={(e) => setConfig({ ...config, payoutSchedule: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="weekly_monday">Weekly on Monday (Flipkart Standard)</option>
                      <option value="daily">Daily Settlement</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly Cycle</option>
                      <option value="manual_only">Manual Withdrawals Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">TDS Contractor Deduction (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.tdsPercentage}
                      onChange={(e) => setConfig({ ...config, tdsPercentage: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Allow Manual Withdrawals</label>
                    <select
                      value={config.allowManualWithdrawal ? 'true' : 'false'}
                      onChange={(e) => setConfig({ ...config, allowManualWithdrawal: e.target.value === 'true' })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="true">Enabled (Rider can withdraw if balance meets threshold)</option>
                      <option value="false">Disabled (Auto-settlement only)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Circuit Breaker */}
              <div className="pt-3 border-t border-neutral-800 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Emergency Circuit Breaker</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.isPayoutsPaused}
                      onChange={(e) => setConfig({ ...config, isPayoutsPaused: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Toggle to immediately pause or resume all automatic and manual payout transfers across the platform.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={configSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center space-x-1.5"
                >
                  {configSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manual Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Audited Earning Adjustment</span>
              </h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adjustError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Select Delivery Partner *</label>
                <select
                  required
                  value={adjustForm.partnerId}
                  onChange={(e) => setAdjustForm({ ...adjustForm, partnerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-400 outline-none"
                >
                  <option value="">Select Rider...</option>
                  {riders.map((r) => (
                    <option key={r._id || r.id} value={r._id || r.id}>
                      {r.name} ({r.phone || r.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Adjustment Type *</label>
                <select
                  value={adjustForm.type}
                  onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-400 outline-none"
                >
                  <option value="adjustment_credit">Credit Bonus (Add Funds)</option>
                  <option value="deduction">Debit Deduction (Subtract Funds)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Amount (INR) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={adjustForm.amount}
                  onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
                  placeholder="e.g. 250"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Auditable Reason / Note *</label>
                <textarea
                  required
                  rows={2}
                  value={adjustForm.description}
                  onChange={(e) => setAdjustForm({ ...adjustForm, description: e.target.value })}
                  placeholder="e.g. Performance SLA bonus / COD discrepancy resolution"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustSaving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center space-x-1.5"
                >
                  {adjustSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Apply Adjustment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPayouts;
