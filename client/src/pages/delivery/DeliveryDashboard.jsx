import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  RotateCcw,
  Ban,
  Calendar,
  LogOut,
  Power,
  RefreshCw,
  Wallet,
  Star,
  Package,
  Layers,
  ChevronRight,
  ExternalLink,
  Loader2,
  ArrowRight,
  User,
  QrCode,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  HelpCircle,
  BarChart3,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DeliveryDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'active' | 'available' | 'earnings' | 'performance' | 'completed' | 'failed' | 'returns'
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState({
    todayDeliveries: 0,
    activeDeliveries: 0,
    newAssignmentsCount: 0,
    inTransitCount: 0,
    availableCount: 0,
    totalDeliveries: 0,
    earnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    codInHand: 0,
    rating: 4.95,
    onTimeRate: '98.4%',
    failedDeliveries: 0,
    returnedDeliveries: 0,
    isOnline: true,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // OTP & Action Modal States
  const [activeModalOrder, setActiveModalOrder] = useState(null);
  const [modalType, setModalType] = useState(''); // 'pickup' | 'deliver' | 'fail' | 'reschedule' | 'return_pickup'
  const [verificationMode, setVerificationMode] = useState('otp'); // 'otp' | 'barcode'
  const [inputOtp, setInputOtp] = useState('');
  const [inputBarcode, setInputBarcode] = useState('');
  const [failureReason, setFailureReason] = useState('Customer unreachable / phone busy');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [modalError, setModalError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Decline Modal State
  const [declineModalOrder, setDeclineModalOrder] = useState(null);
  const [declineReason, setDeclineReason] = useState('Address too far / out of assigned zone');
  const [declineLoading, setDeclineLoading] = useState(false);

  // Emergency SOS Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosType, setSosType] = useState('Vehicle Breakdown');
  const [sosMessage, setSosMessage] = useState('');
  const [sosLoading, setSosLoading] = useState(false);

  // Profile / Vehicle Edit Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    vehicleType: 'Bike',
    vehicleNumber: '',
    phone: '',
    city: 'Jaipur Central',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Fetch logged-in delivery partner identity and live metrics (Section 3, 4, 5)
  const fetchProfileAndStats = async (showSpinner = false) => {
    try {
      if (showSpinner) setIsRefreshing(true);
      const [meRes, profRes] = await Promise.all([
        api.delivery.me().catch(() => null),
        api.delivery.getProfile().catch(() => null),
      ]);

      if (meRes?.success && meRes.partner) {
        setProfile((prev) => ({
          ...(prev || {}),
          ...meRes.partner,
          _id: meRes.partner.id || meRes.partner._id,
        }));
        setProfileForm({
          vehicleType: meRes.partner.vehicleType || 'Bike',
          vehicleNumber: meRes.partner.vehicleNumber || '',
          phone: meRes.partner.phone || meRes.partner.mobile || '',
          city: meRes.partner.city || 'Jaipur',
        });
      }

      if (profRes?.success) {
        if (profRes.user) {
          setProfile((prev) => ({
            ...(prev || {}),
            ...profRes.user,
            deliveryProfile: profRes.user.deliveryProfile || prev?.deliveryProfile,
          }));
        }
        if (profRes.metrics) {
          setMetrics(profRes.metrics);
        }
      }
    } catch (err) {
      console.warn('Failed to load rider profile:', err.message);
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  };

  // Fetch orders with Error State (Section 18 & 19)
  const fetchOrders = async (tabToFetch = activeTab, showSpinner = true) => {
    if (tabToFetch === 'earnings' || tabToFetch === 'performance') {
      if (showSpinner) setLoading(false);
      return;
    }
    try {
      if (showSpinner) {
        setLoading(true);
        setFetchError('');
      }
      const res = await api.delivery.getOrders(tabToFetch);
      if (res.success) {
        setOrders(res.orders || []);
        setFetchError('');
      } else {
        setFetchError(res.message || 'Unable to load deliveries');
      }
    } catch (err) {
      setFetchError(err.message || 'Unable to load deliveries. Please check connection and try again.');
      if (showSpinner) {
        showToast(err.message || 'Failed to load deliveries');
      }
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  };

  // Realtime Polling Interval: Auto-refreshes every 12 seconds in background (Section 13 & 14)
  useEffect(() => {
    fetchProfileAndStats(false);
    fetchOrders(activeTab, true);

    const pollingTimer = setInterval(() => {
      fetchOrders(activeTab, false);
      fetchProfileAndStats(false);
    }, 12000);

    return () => clearInterval(pollingTimer);
  }, [activeTab]);

  const handleToggleOnline = async () => {
    try {
      setIsTogglingDuty(true);
      const res = await api.delivery.toggleOnline();
      if (res.success) {
        setMetrics((prev) => ({ ...prev, isOnline: res.isOnline }));
        showToast(res.message);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update duty status');
    } finally {
      setIsTogglingDuty(false);
    }
  };

  const handleAcceptDelivery = async (orderId) => {
    try {
      setActionLoading(true);
      const res = await api.delivery.accept(orderId);
      if (res.success) {
        showToast('Delivery accepted! Order added to Active Tasks.');
        fetchOrders('active');
        setActiveTab('active');
        fetchProfileAndStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to accept delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDecline = async (e) => {
    e.preventDefault();
    if (!declineModalOrder) return;
    try {
      setDeclineLoading(true);
      const res = await api.delivery.decline(declineModalOrder._id, declineReason);
      if (res.success) {
        showToast('Order declined and returned to dispatch pool.');
        setDeclineModalOrder(null);
        fetchOrders(activeTab);
        fetchProfileAndStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to decline order');
    } finally {
      setDeclineLoading(false);
    }
  };

  const handleReachedPickup = async (orderId) => {
    try {
      const res = await api.delivery.reachedPickup(orderId);
      if (res.success) {
        showToast('Status updated: Reached Seller Warehouse');
        fetchOrders('active');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleConfirmPickupSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    try {
      setActionLoading(true);
      setModalError('');
      const codeToSend = verificationMode === 'barcode' ? inputBarcode : inputOtp;
      const res = await api.delivery.confirmPickup(activeModalOrder._id, codeToSend);
      if (res.success) {
        showToast('Package picked up successfully! Ready to deliver.');
        closeModal();
        fetchOrders('active');
      }
    } catch (err) {
      setModalError(err.message || 'Pickup verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOutForDelivery = async (orderId) => {
    try {
      const res = await api.delivery.outForDelivery(orderId);
      if (res.success) {
        showToast('Order marked as OUT FOR DELIVERY! Customer notified.');
        fetchOrders('active');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleReachedCustomer = async (orderId) => {
    try {
      const res = await api.delivery.reachedCustomer(orderId);
      if (res.success) {
        showToast('Reached customer delivery location');
        fetchOrders('active');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleCompleteDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    try {
      setActionLoading(true);
      setModalError('');
      const codeToSend = verificationMode === 'barcode' ? inputBarcode : inputOtp;
      const res = await api.delivery.completeDelivery(activeModalOrder._id, codeToSend);
      if (res.success) {
        showToast('🎉 Delivery verified & completed! ₹50 payout added.');
        closeModal();
        fetchOrders('active');
        fetchProfileAndStats();
      }
    } catch (err) {
      setModalError(err.message || 'Delivery OTP verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFailSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    try {
      setActionLoading(true);
      setModalError('');
      const res = await api.delivery.failDelivery(activeModalOrder._id, failureReason);
      if (res.success) {
        showToast('Delivery marked as failed. Hub notified.');
        closeModal();
        fetchOrders('active');
        fetchProfileAndStats();
      }
    } catch (err) {
      setModalError(err.message || 'Failed to update delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    try {
      setActionLoading(true);
      setModalError('');
      const res = await api.delivery.reschedule(activeModalOrder._id, rescheduleDate, failureReason);
      if (res.success) {
        showToast('Shipment rescheduled for tomorrow');
        closeModal();
        fetchOrders('active');
      }
    } catch (err) {
      setModalError(err.message || 'Failed to reschedule');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnPickupSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    try {
      setActionLoading(true);
      setModalError('');
      const res = await api.delivery.pickupReturn(activeModalOrder._id, inputOtp);
      if (res.success) {
        showToast('Return package picked up! ₹40 fee credited.');
        closeModal();
        fetchOrders('returns');
        fetchProfileAndStats();
      }
    } catch (err) {
      setModalError(err.message || 'Return pickup verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitSos = async (e) => {
    e.preventDefault();
    try {
      setSosLoading(true);
      const res = await api.delivery.submitSupport({
        issueType: sosType,
        message: sosMessage || `Emergency SOS reported: ${sosType}`,
        isUrgent: true,
      });
      if (res.success) {
        showToast('🚨 SOS alert broadcasted to Jaipur Logistics Hub! Manager is alerted.');
        setShowSosModal(false);
        setSosMessage('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to trigger SOS');
    } finally {
      setSosLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await api.delivery.updateProfile(profileForm);
      if (res.success) {
        showToast('Vehicle and rider details saved successfully!');
        setShowProfileModal(false);
        fetchProfileAndStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const openModal = (order, type) => {
    setActiveModalOrder(order);
    setModalType(type);
    setVerificationMode('otp');
    setInputOtp('');
    setInputBarcode('');
    setModalError('');
    setFailureReason('Customer unreachable / phone busy');
    setRescheduleDate('');
  };

  const closeModal = () => {
    setActiveModalOrder(null);
    setModalType('');
    setInputOtp('');
    setInputBarcode('');
    setModalError('');
  };

  const openGoogleMaps = (address) => {
    if (!address) return;
    const query = encodeURIComponent(`${address.address || ''}, ${address.city || ''}, ${address.postalCode || ''}, India`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const partnerStatus =
    profile?.deliveryProfile?.status ||
    user?.deliveryProfile?.status ||
    (profile?.deliveryProfile?.isApproved || user?.deliveryProfile?.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION');

  const partnerName = profile?.name || user?.name || 'Delivery Partner';
  const partnerPhone = profile?.phone || profile?.mobile || user?.phone || 'N/A';
  const partnerCity = profile?.city || profile?.deliveryProfile?.city || profileForm.city || 'Jaipur Central';
  const partnerVehicle = profile?.vehicleType || profile?.deliveryProfile?.vehicleType || profileForm.vehicleType || 'Two-Wheeler';
  const partnerIdShort = (profile?._id || user?._id || 'DP').toString().slice(-6).toUpperCase();
  const partnerInitials = partnerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'DP';

  const isPendingOrSuspended =
    user?.role === 'delivery_partner' &&
    partnerStatus !== 'ACTIVE' &&
    partnerStatus !== 'APPROVED';

  if (isPendingOrSuspended) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {partnerStatus === 'REJECTED'
                ? 'APPLICATION REJECTED'
                : partnerStatus === 'SUSPENDED'
                ? 'ACCOUNT SUSPENDED'
                : 'PENDING VERIFICATION'}
            </span>
            <h2 className="text-2xl font-black font-mono">
              {partnerStatus === 'REJECTED'
                ? 'Application Not Approved'
                : partnerStatus === 'SUSPENDED'
                ? 'Account Suspended'
                : 'Account Under Verification'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {partnerStatus === 'REJECTED'
                ? 'Your Delivery Partner application was rejected during review. Please contact logistics dispatch support.'
                : partnerStatus === 'SUSPENDED'
                ? 'Your account has been temporarily suspended. Please contact dispatch management.'
                : 'Your Delivery Partner account is currently under verification. You will be able to start deliveries after your account is approved.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Rider:</span>
              <span className="font-semibold">{partnerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mobile:</span>
              <span className="font-semibold">{partnerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-mono text-amber-400 font-bold">{partnerStatus}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={async () => {
                await logout();
                navigate('/delivery/login', { replace: true });
              }}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch Account</span>
            </button>
            <Link
              to="/"
              className="w-full py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider text-center transition-all"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Rider Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black font-mono tracking-tight text-white">
                  VEXIVO FLEET
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Rider Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                <span className="font-semibold text-white">{partnerName}</span> • {partnerCity} ({partnerVehicle})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Refresh */}
            <button
              onClick={() => {
                fetchProfileAndStats(true);
                fetchOrders(activeTab, true);
              }}
              disabled={isRefreshing}
              title="Refresh Deliveries"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setShowSosModal(true)}
              title="Emergency SOS / Incident Report"
              className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all shadow-md active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span className="hidden sm:inline">EMERGENCY SOS</span>
              <span className="sm:hidden">SOS</span>
            </button>

            {/* Profile / Vehicle Settings Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              title="Vehicle & Profile Settings"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Online/Offline Duty Toggle */}
            <button
              onClick={handleToggleOnline}
              disabled={isTogglingDuty}
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                metrics.isOnline
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${metrics.isOnline ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{metrics.isOnline ? 'DUTY ONLINE' : 'OFFLINE'}</span>
              <span className="sm:hidden">{metrics.isOnline ? 'ON' : 'OFF'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/delivery/login');
              }}
              title="Logout"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Partner Identity Card / Welcome Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              {partnerInitials}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {partnerName}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  ID: #{partnerIdShort}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  metrics.isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {metrics.isOnline ? 'Active on Duty' : 'Off-Duty'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>📍 Zone: <span className="text-slate-200 font-semibold">{partnerCity}</span></span>
                <span>•</span>
                <span>🛵 Vehicle: <span className="text-slate-200 font-semibold">{partnerVehicle}</span></span>
                <span>•</span>
                <span className="text-slate-300 font-mono">📱 {partnerPhone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={() => {
                fetchProfileAndStats(true);
                fetchOrders(activeTab, true);
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Deliveries'}</span>
            </button>
          </div>
        </div>

        {/* Rider KPI Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>New Assignments</span>
            </span>
            <p className="text-2xl font-black text-amber-400 font-mono">{metrics.newAssignmentsCount || 0}</p>
            <p className="text-[10px] text-slate-400">Awaiting your acceptance</p>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Truck className="w-3 h-3 text-cyan-400" />
              <span>Active In Transit</span>
            </span>
            <p className="text-2xl font-black text-cyan-400 font-mono">{metrics.inTransitCount || (metrics.activeDeliveries - (metrics.newAssignmentsCount || 0)) || 0}</p>
            <p className="text-[10px] text-slate-400">Pickup & Run</p>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Wallet className="w-3 h-3 text-emerald-400" />
              <span>Earnings Today</span>
            </span>
            <p className="text-2xl font-black text-emerald-400 font-mono">₹{metrics.todayEarnings || 0}</p>
            <p className="text-[10px] text-slate-400">COD Cash: ₹{metrics.codInHand || 0}</p>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Star className="w-3 h-3 text-amber-400" />
              <span>Rider Rating</span>
            </span>
            <p className="text-2xl font-black text-amber-400 font-mono">
              ★ {metrics.rating ? Number(metrics.rating).toFixed(2) : '4.95'}
            </p>
            <p className="text-[10px] text-emerald-400">{metrics.onTimeRate || 98.4}% On-Time ✓</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto custom-scrollbar">
          {[
            {
              id: 'assigned',
              label: 'New Assignments',
              count: metrics.newAssignmentsCount,
              badge: (metrics.newAssignmentsCount > 0) ? 'ACTION REQUIRED' : null,
              highlight: (metrics.newAssignmentsCount > 0),
            },
            {
              id: 'active',
              label: 'Active Deliveries',
              count: metrics.activeDeliveries,
            },
            { id: 'available', label: 'Available Orders' },
            { id: 'earnings', label: 'Earnings & Cash (COD)' },
            { id: 'performance', label: 'Performance & SLA' },
            { id: 'completed', label: 'Delivery History', count: metrics.totalDeliveries },
            { id: 'returns', label: 'Customer Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : tab.highlight
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === tab.id ? 'bg-slate-950 text-white' : tab.highlight ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-extrabold uppercase animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: EARNINGS & COD RECONCILIATION */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Today's Earnings</span>
                </span>
                <p className="text-3xl font-black font-mono text-cyan-400">₹{metrics.todayEarnings || 0}</p>
                <p className="text-[11px] text-slate-400">From {metrics.todayDeliveries || 0} completed dropoffs</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>This Week</span>
                </span>
                <p className="text-3xl font-black font-mono text-emerald-400">₹{metrics.weekEarnings || 0}</p>
                <p className="text-[11px] text-slate-400">Weekly cycle deposits on Monday</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>This Month</span>
                </span>
                <p className="text-3xl font-black font-mono text-purple-400">₹{metrics.monthEarnings || metrics.earnings || 0}</p>
                <p className="text-[11px] text-slate-400">Includes performance incentives</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>COD Cash in Hand</span>
                </span>
                <p className="text-3xl font-black font-mono text-amber-400">₹{metrics.codInHand || 0}</p>
                <p className="text-[11px] text-amber-300">To be settled at Hub by 9 PM</p>
              </div>
            </div>

            {/* Payout & Structure Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Payout Rate Structure (INR)</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-300">Standard Delivery Base Fee</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">₹50.00 / order</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-300">Customer Return Reverse Pickup</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">₹40.00 / return</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-300">Peak Festival / Rainy Weather Surge</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">+₹15.00 / trip</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-300">Weekly On-Time SLA Incentive (95%+)</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">₹500.00 bonus</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/20 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Cash on Delivery (COD) Compliance</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All Cash on Delivery (COD) payments collected from customers during your delivery run are strictly tracked in real-time under your rider ID.
                </p>
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <p className="font-bold">⚠️ Daily Settlement Rule:</p>
                  <p className="text-[11px] text-amber-200/80">
                    Hand over collected cash at the Sitapura Hub Cashier Desk before closing your shift. The Logistics Admin will mark your balance as settled upon deposit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERFORMANCE & SLA ANALYTICS */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On-Time Delivery Rate</span>
                </span>
                <p className="text-3xl font-black font-mono text-emerald-400">{metrics.onTimeRate || 98.4}%</p>
                <p className="text-[11px] text-emerald-400">Target: ≥ 95.0%</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buyer Rating</span>
                </span>
                <p className="text-3xl font-black font-mono text-amber-400">
                  ★ {metrics.rating ? Number(metrics.rating).toFixed(2) : '4.95'}
                </p>
                <p className="text-[11px] text-slate-400">Top 5% of Jaipur Fleet</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lifetime Deliveries</span>
                </span>
                <p className="text-3xl font-black font-mono text-cyan-400">{metrics.totalDeliveries || 0}</p>
                <p className="text-[11px] text-slate-400">Successful completions</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Returns Handled</span>
                </span>
                <p className="text-3xl font-black font-mono text-purple-400">{metrics.returnedDeliveries || 0}</p>
                <p className="text-[11px] text-slate-400">Verified OTP handovers</p>
              </div>
            </div>

            {/* SLA Badges & Tier */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Rider Tier & SLA Badges</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                  <p className="text-xs font-bold text-white">Tier: Platinum Partner</p>
                  <p className="text-[11px] text-emerald-400">Priority order dispatch assignment</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-1">
                  <p className="text-xs font-bold text-white">OTP Compliance: 100%</p>
                  <p className="text-[11px] text-cyan-400">Zero non-verified deliveries</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-500/20 space-y-1">
                  <p className="text-xs font-bold text-white">Zone: Jaipur Central & Sitapura</p>
                  <p className="text-[11px] text-purple-400">Avg handover distance: 4.2 km</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDER LIST (FOR ASSIGNED, ACTIVE, AVAILABLE, COMPLETED, RETURNS TABS) */}
        {activeTab !== 'earnings' && activeTab !== 'performance' && (
          <>
            {/* Error Notification with Retry (Section 18 & 19) */}
            {fetchError && (
              <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Failed to load dispatch records</p>
                    <p className="text-[11px] text-rose-300/80">{fetchError}</p>
                  </div>
                </div>
                <button
                  onClick={() => fetchOrders(activeTab, true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 active:scale-95"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-xs text-slate-400 font-medium">Fetching dispatch logistics records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white">No deliveries in this section</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {activeTab === 'assigned'
                    ? 'No new delivery assignments pending. When dispatch assigns you an order, it will appear here in real time.'
                    : activeTab === 'active'
                    ? 'You currently have no active deliveries in progress. Check the "New Assignments" or "Available Orders" tab.'
                    : activeTab === 'available'
                    ? 'All current orders are assigned. Please keep your duty online to receive incoming requests.'
                    : 'No delivery history recorded in this category.'}
                </p>
                {activeTab === 'assigned' && (
                  <button
                    onClick={() => fetchOrders('assigned', true)}
                    className="mt-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all inline-flex items-center space-x-2 active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Check for New Assignments</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.map((ord) => {
                  const deliveryStatus = ord.deliveryDetails?.deliveryStatus || 'unassigned';
                  const isCod = ord.paymentMethod?.toLowerCase().includes('cash') || ord.paymentMethod?.toLowerCase().includes('cod');
                  const isReturn = ord.returnDetails?.status && ord.returnDetails?.status !== 'none';

                  return (
                    <div
                      key={ord._id}
                      className={`bg-slate-900/70 border rounded-3xl p-5 sm:p-6 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between ${
                        deliveryStatus === 'assigned'
                          ? 'border-amber-500/60 shadow-lg shadow-amber-500/5 bg-gradient-to-b from-amber-500/5 via-slate-900/70 to-slate-900/70'
                          : 'border-white/10'
                      }`}
                    >
                      {deliveryStatus === 'assigned' && (
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>ACTION REQUIRED: New Assignment awaiting your acceptance</span>
                          </span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                            Assigned to You
                          </span>
                        </div>
                      )}
                      <div className="space-y-3.5">
                        {/* Card Header: Order Number & Delivery Pill */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-white text-sm">{ord.orderNumber}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                                {ord.trackingNumber || 'EKART'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Placed: {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div className="text-right space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              deliveryStatus === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : deliveryStatus === 'out_for_delivery'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                                : deliveryStatus === 'failed'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {deliveryStatus.replace('_', ' ')}
                            </span>
                            <div>
                              <span className={`text-[10px] font-bold uppercase ${isCod ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isCod ? 'Collect Cash (COD)' : 'Prepaid (Online)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 1: Merchant Pickup Info */}
                        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              <span>1. Seller Pickup Hub:</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              OTP: {ord.deliveryDetails?.pickupOtp || '4921'}
                            </span>
                          </div>
                          <p className="font-bold text-white">
                            {ord.items?.[0]?.sellerName || 'VEXIVO Official Warehouse (Hub 4)'}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            Plot 14, Sitapura Industrial Area, Tonk Road, Jaipur - 302022
                          </p>
                        </div>

                        {/* Step 2: Customer Destination Info */}
                        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              <span>2. Customer Destination:</span>
                            </span>
                            {/* Call Customer Button */}
                            {ord.shippingAddress?.phone && (
                              <a
                                href={`tel:${ord.shippingAddress.phone}`}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call Buyer</span>
                              </a>
                            )}
                          </div>
                          <p className="font-bold text-white">
                            {ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName || ''}
                          </p>
                          <p className="text-[11px] text-slate-300">
                            {ord.shippingAddress?.address}, {ord.shippingAddress?.landmark ? `${ord.shippingAddress.landmark}, ` : ''}{ord.shippingAddress?.city} - {ord.shippingAddress?.postalCode}
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => openGoogleMaps(ord.shippingAddress)}
                              className="inline-flex items-center space-x-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Navigate in Google Maps ↗</span>
                            </button>
                            <span className="text-slate-400 text-[11px]">
                              Ph: +91 {ord.shippingAddress?.phone || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="flex items-center justify-between pt-1 px-1 text-xs">
                          <span className="text-slate-400">
                            {ord.items?.length || 1} item(s) • Handover Amount:
                          </span>
                          <span className={`font-mono font-black text-sm ${isCod ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {isCod ? `Collect ₹${ord.total?.toFixed(2)}` : `₹${ord.total?.toFixed(2)} (Paid)`}
                          </span>
                        </div>
                      </div>

                      {/* Rider Action Toolbar */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                        {/* 1. New Assignment awaiting acceptance (in 'assigned' tab or 'active' tab) */}
                        {(activeTab === 'assigned' || deliveryStatus === 'assigned') && (
                          <div className="w-full space-y-2">
                            <div className="w-full flex items-center space-x-2">
                              <button
                                onClick={() => handleAcceptDelivery(ord._id)}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                                <span>Accept Delivery (+₹50)</span>
                              </button>
                              <button
                                onClick={() => setDeclineModalOrder(ord)}
                                disabled={actionLoading}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 text-xs font-bold transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 2. Unassigned / Available pool orders */}
                        {activeTab === 'available' && deliveryStatus !== 'assigned' && (
                          <div className="w-full flex items-center space-x-2">
                            <button
                              onClick={() => handleAcceptDelivery(ord._id)}
                              disabled={actionLoading}
                              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept (+₹50)</span>
                            </button>
                            <button
                              onClick={() => setDeclineModalOrder(ord)}
                              disabled={actionLoading}
                              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 text-xs font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {/* 3. Active Workflow Progression */}
                        {activeTab === 'active' && deliveryStatus !== 'assigned' && (
                          <>
                            {deliveryStatus === 'accepted' && (
                              <button
                                onClick={() => handleReachedPickup(ord._id)}
                                className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Reached Seller Hub</span>
                              </button>
                            )}

                            {deliveryStatus === 'reached_pickup' && (
                              <button
                                onClick={() => openModal(ord, 'pickup')}
                                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Enter Pickup OTP / Scan Barcode</span>
                              </button>
                            )}

                            {deliveryStatus === 'picked_up' && (
                              <button
                                onClick={() => handleOutForDelivery(ord._id)}
                                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 shadow-md shadow-blue-600/30"
                              >
                                <Truck className="w-4 h-4" />
                                <span>Start Delivery Run (Out for Delivery)</span>
                              </button>
                            )}

                            {deliveryStatus === 'out_for_delivery' && (
                              <button
                                onClick={() => handleReachedCustomer(ord._id)}
                                className="flex-1 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Reached Doorstep</span>
                              </button>
                            )}

                            {(deliveryStatus === 'reached_customer' || deliveryStatus === 'out_for_delivery') && (
                              <button
                                onClick={() => openModal(ord, 'deliver')}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verify Delivery OTP / Barcode (+₹50)</span>
                              </button>
                            )}

                            {/* Exceptions (Reschedule / Fail / Decline) */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => openModal(ord, 'reschedule')}
                                title="Reschedule Delivery"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openModal(ord, 'fail')}
                                title="Mark Delivery Failed"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                              {deliveryStatus === 'accepted' && (
                                <button
                                  onClick={() => setDeclineModalOrder(ord)}
                                  title="Decline / Unassign Job"
                                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </>
                        )}

                        {/* Customer Returns Pickup Workflow */}
                        {activeTab === 'returns' && (
                          <button
                            onClick={() => openModal(ord, 'return_pickup')}
                            className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Pickup Return with Customer Return OTP (+₹40 Payout)</span>
                          </button>
                        )}

                        {/* Completed Deliveries */}
                        {activeTab === 'completed' && (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered & Verified (+₹50 Credited)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Action / OTP / Barcode Modal Window */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono">
                    {modalType === 'pickup'
                      ? 'Seller Pickup Verification'
                      : modalType === 'deliver'
                      ? 'Customer Delivery Handover'
                      : modalType === 'fail'
                      ? 'Record Failed Delivery Attempt'
                      : modalType === 'reschedule'
                      ? 'Reschedule Delivery'
                      : 'Customer Return Pickup'}
                  </h3>
                  <p className="text-[10px] text-slate-400">Order: {activeModalOrder.orderNumber}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {modalError}
              </div>
            )}

            {/* Modal: Seller Pickup (OTP or Barcode Mode) */}
            {modalType === 'pickup' && (
              <form onSubmit={handleConfirmPickupSubmit} className="space-y-4">
                {/* Mode Selector */}
                <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setVerificationMode('otp')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      verificationMode === 'otp' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                  >
                    4-Digit Seller OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMode('barcode')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center space-x-1 ${
                      verificationMode === 'barcode' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan / Barcode</span>
                  </button>
                </div>

                {verificationMode === 'otp' ? (
                  <>
                    <div className="p-3 rounded-2xl bg-slate-950 text-xs text-slate-300 space-y-1">
                      <p>Ask the seller warehouse manager for the 4-digit Pickup Verification OTP.</p>
                      <p className="text-[11px] text-slate-500">
                        💡 For testing/demo: OTP is <strong className="text-emerald-400 font-mono">{activeModalOrder.deliveryDetails?.pickupOtp || '4921'}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Enter 4-Digit Pickup OTP *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        autoFocus
                        required
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="e.g. 4921"
                        className="w-full text-center text-2xl font-mono font-black tracking-[0.4em] py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-2xl bg-slate-950 text-xs text-slate-300 space-y-1">
                      <p>Scan package barcode or type package tracking number.</p>
                      <p className="text-[11px] text-slate-500">
                        💡 Package Tracking Number: <strong className="text-cyan-400 font-mono">{activeModalOrder.trackingNumber}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Scan / Type Barcode or Tracking ID *
                      </label>
                      <input
                        type="text"
                        autoFocus
                        required
                        value={inputBarcode}
                        onChange={(e) => setInputBarcode(e.target.value)}
                        placeholder="e.g. EKART-9842"
                        className="w-full text-center text-lg font-mono font-bold py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-cyan-500 focus:outline-none uppercase"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={actionLoading || (verificationMode === 'otp' ? inputOtp.length !== 4 : !inputBarcode.trim())}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Verifying Pickup...' : 'Confirm Package Pickup'}
                </button>
              </form>
            )}

            {/* Modal: Customer Delivery (OTP or Barcode Mode) */}
            {modalType === 'deliver' && (
              <form onSubmit={handleCompleteDeliverySubmit} className="space-y-4">
                {activeModalOrder.paymentMethod?.toLowerCase().includes('cash') && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold space-y-1">
                    <p>⚠️ CASH ON DELIVERY ORDER</p>
                    <p className="text-sm font-black font-mono text-white">
                      Please collect ₹{activeModalOrder.total?.toFixed(2)} in cash before handing over package.
                    </p>
                  </div>
                )}

                {/* Mode Selector */}
                <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setVerificationMode('otp')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      verificationMode === 'otp' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                  >
                    4-Digit Customer OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMode('barcode')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center space-x-1 ${
                      verificationMode === 'barcode' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Barcode Scan</span>
                  </button>
                </div>

                {verificationMode === 'otp' ? (
                  <>
                    <div className="p-3 rounded-2xl bg-slate-950 text-xs text-slate-300 space-y-1">
                      <p>Ask the recipient customer for the 4-digit Delivery OTP from their mobile app.</p>
                      <p className="text-[11px] text-slate-500">
                        💡 For testing/demo: Customer Delivery OTP is{' '}
                        <strong className="text-emerald-400 font-mono">{activeModalOrder.deliveryDetails?.deliveryOtp || '8842'}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Enter 4-Digit Customer OTP *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        autoFocus
                        required
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="e.g. 8842"
                        className="w-full text-center text-2xl font-mono font-black tracking-[0.4em] py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-2xl bg-slate-950 text-xs text-slate-300 space-y-1">
                      <p>Scan the parcel barcode at customer doorstep to verify physical delivery.</p>
                      <p className="text-[11px] text-slate-500">
                        💡 Package Barcode: <strong className="text-emerald-400 font-mono">{activeModalOrder.trackingNumber}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Scan / Enter Package Barcode *
                      </label>
                      <input
                        type="text"
                        autoFocus
                        required
                        value={inputBarcode}
                        onChange={(e) => setInputBarcode(e.target.value)}
                        placeholder="e.g. EKART-9842"
                        className="w-full text-center text-lg font-mono font-bold py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-emerald-500 focus:outline-none uppercase"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={actionLoading || (verificationMode === 'otp' ? inputOtp.length !== 4 : !inputBarcode.trim())}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Verifying & Handing Over...' : 'Complete Delivery (+₹50 Payout)'}
                </button>
              </form>
            )}

            {/* Modal: Fail Delivery */}
            {modalType === 'fail' && (
              <form onSubmit={handleFailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Reason for Non-Delivery *
                  </label>
                  <select
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Customer unreachable / phone busy">Customer unreachable / phone busy</option>
                    <option value="Door locked / nobody at address">Door locked / nobody at address</option>
                    <option value="Customer refused to accept order">Customer refused to accept order</option>
                    <option value="Customer requested cancellation at doorstep">Customer requested cancellation at doorstep</option>
                    <option value="Incorrect or incomplete address">Incorrect or incomplete address</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition-colors"
                >
                  {actionLoading ? 'Saving...' : 'Confirm Delivery Failure'}
                </button>
              </form>
            )}

            {/* Modal: Reschedule Delivery */}
            {modalType === 'reschedule' && (
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Select New Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Customer Reschedule Reason
                  </label>
                  <input
                    type="text"
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    placeholder="e.g. Customer out of station, requested delivery tomorrow"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading || !rescheduleDate}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </form>
            )}

            {/* Modal: Return Item Pickup */}
            {modalType === 'return_pickup' && (
              <form onSubmit={handleReturnPickupSubmit} className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-950 text-xs text-slate-300 space-y-1">
                  <p>Verify the return product and enter the 4-digit Return Pickup OTP from the customer.</p>
                  <p className="text-[11px] text-slate-500">
                    💡 For testing/demo: Return OTP is{' '}
                    <strong className="text-purple-400 font-mono">
                      {activeModalOrder.returnDetails?.returnPickupOtp || '3914'}
                    </strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Enter 4-Digit Return OTP *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    required
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 3914"
                    className="w-full text-center text-2xl font-mono font-black tracking-[0.4em] py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading || inputOtp.length !== 4}
                  className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Verifying...' : 'Collect Return Package (+₹40 Payout)'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Decline Order Modal */}
      {declineModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono">Decline Delivery Order</h3>
                  <p className="text-[10px] text-slate-400">Order: {declineModalOrder.orderNumber}</p>
                </div>
              </div>
              <button onClick={() => setDeclineModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDecline} className="space-y-4">
              <p className="text-xs text-slate-300">
                Please specify why you are declining this job. The order will be immediately returned to the unassigned dispatch pool.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Reason *
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Address too far / out of assigned zone">Address too far / out of assigned zone</option>
                  <option value="Vehicle breakdown / tyre puncture">Vehicle breakdown / tyre puncture</option>
                  <option value="Heavy rain / waterlogging in area">Heavy rain / waterlogging in area</option>
                  <option value="Reached daily capacity limit">Reached daily capacity limit</option>
                  <option value="Bulky parcel / not suitable for bike">Bulky parcel / not suitable for bike</option>
                  <option value="Personal emergency">Personal emergency</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeclineModalOrder(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={declineLoading}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {declineLoading ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-mono text-rose-400">RIDER EMERGENCY SOS</h3>
                  <p className="text-[10px] text-slate-400">Priority Hub Dispatch Incident Center</p>
                </div>
              </div>
              <button onClick={() => setShowSosModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSos} className="space-y-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                🚨 This triggers a priority alert to the VEXIVO Logistics Dispatch Center and alerts the fleet supervisor.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Emergency Category *
                </label>
                <select
                  value={sosType}
                  onChange={(e) => setSosType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Accident / Medical Emergency">Accident / Medical Emergency</option>
                  <option value="Customer Dispute / Hostility">Customer Dispute / Hostility</option>
                  <option value="Vehicle Breakdown / Stranded">Vehicle Breakdown / Stranded</option>
                  <option value="Cash / Package Theft Attempt">Cash / Package Theft Attempt</option>
                  <option value="Severe Weather Hazard">Severe Weather Hazard</option>
                  <option value="App / Navigation Breakdown">App / Navigation Breakdown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Situation Details / Current Location
                </label>
                <textarea
                  rows={3}
                  value={sosMessage}
                  onChange={(e) => setSosMessage(e.target.value)}
                  placeholder="Describe your current situation, exact landmark, and if medical or police assistance is needed..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSosModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={sosLoading}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {sosLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>Broadcast SOS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & Vehicle Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono">Rider Profile & Vehicle</h3>
                  <p className="text-[10px] text-slate-400">Fleet Operations Jaipur</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Type *
                </label>
                <select
                  value={profileForm.vehicleType}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Bike">Motorcycle / Bike (Petrol)</option>
                  <option value="EV Scooter">Electric Two-Wheeler (EV Scooter)</option>
                  <option value="Scooter">Scooter (Activa / Jupiter)</option>
                  <option value="Van">Small Delivery Van / Three Wheeler</option>
                  <option value="Bicycle">Bicycle / Green Eco Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  value={profileForm.vehicleNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleNumber: e.target.value })}
                  placeholder="e.g. RJ14 AB 1234"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono font-medium text-white focus:border-emerald-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Operating City / Hub Zone
                </label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  placeholder="e.g. Jaipur Central"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono font-medium text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
