import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Truck,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  User,
  MapPin,
  FileText,
  CreditCard,
  Clock,
  Ban,
  LogOut,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DeliveryLogin = () => {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register'
  const [isRegistering, setIsRegistering] = useState(false);

  // Status view if account is pending / rejected / suspended
  const [accountStatusUser, setAccountStatusUser] = useState(
    user && user.role === 'delivery_partner' && user.deliveryProfile?.status !== 'ACTIVE' && user.deliveryProfile?.status !== 'APPROVED'
      ? user
      : null
  );

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(
    location.state?.error === 'unauthorized'
      ? 'Access restricted: Please log in with a Delivery Partner account.'
      : ''
  );

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleType: 'Two-Wheeler / Bike',
    vehicleNumber: '',
    licenseNumber: '',
    city: 'Jaipur',
    address: '',
    emergencyContact: '',
    serviceZone: 'Jaipur Central, Malviya Nagar, Mansarovar',
    aadhaarNumber: '',
    panNumber: '',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      setLoginError('Please enter both Email/Phone and password.');
      return;
    }

    try {
      setLoginLoading(true);
      setLoginError('');
      const loggedUser = await login(loginIdentifier, loginPassword);
      if (loggedUser && (loggedUser.role === 'delivery_partner' || loggedUser.role === 'admin')) {
        const partnerStatus =
          loggedUser.deliveryProfile?.status ||
          (loggedUser.deliveryProfile?.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION');

        if (loggedUser.role === 'admin' || partnerStatus === 'ACTIVE' || partnerStatus === 'APPROVED') {
          navigate('/delivery', { replace: true });
        } else {
          // Partner account exists but is not active (pending, rejected, or suspended)
          setAccountStatusUser(loggedUser);
        }
      } else {
        setLoginError('This account does not have Delivery Fleet privileges. Please contact dispatch support.');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Registration Form Change
  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Registration Submit
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    // Validations
    if (!regForm.name.trim()) {
      setRegError('Please enter your full legal name.');
      return;
    }
    const cleanPhone = regForm.phone.replace(/[\s\-\(\)]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone) && !/^\+91[6-9]\d{9}$/.test(cleanPhone)) {
      setRegError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }
    if (!regForm.email.trim() || !regForm.email.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (!regForm.password || regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }
    if (!regForm.vehicleNumber.trim()) {
      setRegError('Vehicle registration number is required (e.g. RJ14 AB 1234).');
      return;
    }
    if (!regForm.licenseNumber.trim()) {
      setRegError('Driving license number is required.');
      return;
    }
    const cleanAadhaar = regForm.aadhaarNumber.replace(/[\s\-]/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setRegError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    const cleanPan = regForm.panNumber.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setRegError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
      return;
    }

    try {
      setRegLoading(true);
      const payload = {
        name: regForm.name.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: regForm.phone.trim(),
        password: regForm.password,
        address: regForm.address.trim(),
        city: regForm.city.trim(),
        emergencyContact: regForm.emergencyContact.trim(),
        vehicleType: regForm.vehicleType,
        vehicleNumber: regForm.vehicleNumber.trim().toUpperCase(),
        licenseNumber: regForm.licenseNumber.trim().toUpperCase(),
        serviceZone: regForm.serviceZone.trim(),
        aadhaarNumber: cleanAadhaar,
        panNumber: cleanPan,
      };

      const res = await api.delivery.register(payload);
      if (res.success) {
        setRegSuccessMsg('Application submitted successfully! Your account is currently under verification.');
        setAccountStatusUser(res.user);
      } else {
        setRegError(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    setAccountStatusUser(null);
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`sm:mx-auto sm:w-full ${isRegistering ? 'sm:max-w-2xl' : 'sm:max-w-md'} relative z-10 px-4 transition-all duration-300`}>
        {/* Fleet Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-2">
            <Truck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            VEXIVO Fleet Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
            {accountStatusUser
              ? 'Application Status'
              : isRegistering
              ? 'Delivery Partner Registration'
              : 'Delivery Partner Portal'}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {accountStatusUser
              ? 'Live verification and clearance tracker for fleet partner accounts.'
              : isRegistering
              ? 'Join the high-speed VEXIVO courier fleet. Fill in your details below for KYC & vehicle clearance.'
              : 'Authorized on-road riders, delivery agents, and pickup logistics network.'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: ACCOUNT STATUS SCREEN (PENDING / REJECTED / SUSPENDED) */}
        {/* ======================================================== */}
        {accountStatusUser ? (
          <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {regSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{regSuccessMsg}</span>
              </div>
            )}

            {/* Status Banner */}
            {accountStatusUser.deliveryProfile?.status === 'REJECTED' ? (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Application Not Approved</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your Delivery Partner application was not approved during administrative verification.
                </p>
                {accountStatusUser.deliveryProfile?.rejectionReason && (
                  <div className="mt-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-rose-500/20 text-rose-300">
                    <span className="font-semibold text-rose-400">Reason: </span>
                    {accountStatusUser.deliveryProfile.rejectionReason}
                  </div>
                )}
              </div>
            ) : accountStatusUser.deliveryProfile?.status === 'SUSPENDED' ? (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <Ban className="w-5 h-5 flex-shrink-0" />
                  <span>Account Suspended</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your delivery partner account has been temporarily suspended by logistics administration.
                </p>
                {accountStatusUser.deliveryProfile?.rejectionReason && (
                  <div className="mt-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-rose-500/20 text-rose-300">
                    <span className="font-semibold text-rose-400">Notice: </span>
                    {accountStatusUser.deliveryProfile.rejectionReason}
                  </div>
                )}
              </div>
            ) : (
              /* PENDING_VERIFICATION */
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
                  <span>Application Under Verification</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your Delivery Partner account is currently under verification. You will be able to start deliveries after your account is approved by the admin team.
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-amber-400/90 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span>Status: PENDING_VERIFICATION (Typical approval in 2–4 hours)</span>
                </div>
              </div>
            )}

            {/* Partner Details Summary */}
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Partner Application Summary</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  ID: #{String(accountStatusUser._id || '').slice(-6).toUpperCase()}
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-white">{accountStatusUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                  <span className="font-semibold text-white">{accountStatusUser.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-white truncate block">{accountStatusUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle Type</span>
                  <span className="font-semibold text-white">
                    {accountStatusUser.deliveryProfile?.vehicleType || 'Two-Wheeler / Bike'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle Number</span>
                  <span className="font-semibold text-white font-mono">
                    {accountStatusUser.deliveryProfile?.vehicleNumber || 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Service City / Zone</span>
                  <span className="font-semibold text-white">
                    {accountStatusUser.deliveryProfile?.city || 'Jaipur Central'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">Application Date</span>
                  <span className="font-semibold text-white">
                    {new Date(accountStatusUser.deliveryProfile?.appliedAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Dispatch Support Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start space-x-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white block">Logistics Dispatch Support</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  For document verification status or expedited onboarding, contact the VEXIVO dispatch hotline at{' '}
                  <span className="font-mono text-emerald-400">+91 1800-VEXIVO-FLEET</span> or email{' '}
                  <span className="text-emerald-400 font-mono">fleet@vexivo.com</span>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Account</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Clock className="w-4 h-4" />
                <span>Check Status Again</span>
              </button>
            </div>
          </div>
        ) : isRegistering ? (
          /* ======================================================== */
          /* VIEW 2: REGISTRATION FORM (CREATE ACCOUNT FLOW)           */
          /* ======================================================== */
          <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {regError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegSubmit} className="space-y-5">
              {/* Group 1: Personal Credentials */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Personal & Login Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={regForm.name}
                      onChange={handleRegChange}
                      placeholder="e.g. Vikram Singh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        value={regForm.phone}
                        onChange={handleRegChange}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={regForm.email}
                        onChange={handleRegChange}
                        placeholder="partner@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Set Password (Min 6 chars) *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        value={regForm.password}
                        onChange={handleRegChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Vehicle & Driving License */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-1.5">
                  <Truck className="w-4 h-4" />
                  <span>2. Vehicle & Driving License</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={regForm.vehicleType}
                      onChange={handleRegChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Two-Wheeler / Bike">Two-Wheeler / Bike</option>
                      <option value="Scooter / Scooty">Scooter / Scooty</option>
                      <option value="Electric Vehicle (EV 2W)">Electric Vehicle (EV 2W)</option>
                      <option value="Three-Wheeler / Auto Cargo">Three-Wheeler / Auto Cargo</option>
                      <option value="Four-Wheeler / Delivery Van">Four-Wheeler / Delivery Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      required
                      value={regForm.vehicleNumber}
                      onChange={handleRegChange}
                      placeholder="e.g. RJ14 AB 1234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-mono uppercase focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Driving License No. *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      value={regForm.licenseNumber}
                      onChange={handleRegChange}
                      placeholder="e.g. RJ1420220012345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-mono uppercase focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Location & Service Area */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>3. Location & Preferred Delivery Area</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Operating City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={regForm.city}
                      onChange={handleRegChange}
                      placeholder="e.g. Jaipur"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Preferred Service Zones (Comma separated) *
                    </label>
                    <input
                      type="text"
                      name="serviceZone"
                      required
                      value={regForm.serviceZone}
                      onChange={handleRegChange}
                      placeholder="e.g. Mansarovar, Malviya Nagar, Raja Park"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Residential / Permanent Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={regForm.address}
                      onChange={handleRegChange}
                      placeholder="Flat / Street / Area / Landmark"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={regForm.emergencyContact}
                      onChange={handleRegChange}
                      placeholder="e.g. 9829012345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: KYC Verification Details */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>4. Government KYC & Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Aadhaar Number (12 Digits) *
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      required
                      maxLength={14}
                      value={regForm.aadhaarNumber}
                      onChange={handleRegChange}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Used for identity clearance & background verification</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      PAN Card Number (10 Characters) *
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      required
                      maxLength={10}
                      value={regForm.panNumber}
                      onChange={handleRegChange}
                      placeholder="ABCDE1234F"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-mono uppercase focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Required for payout remittances & tax compliances</span>
                  </div>
                </div>
              </div>

              {/* Submit Application Button */}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 mt-6"
              >
                {regLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Partner Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Toggle */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Already registered or have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setRegError('');
                  }}
                  className="font-bold text-emerald-400 hover:text-emerald-300 ml-1 underline decoration-emerald-500/40"
                >
                  Sign In to Dashboard
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 3: LOGIN FORM (PRESERVES EXISTING DESIGN + NO DEMO)  */
          /* ======================================================== */
          <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Quick Demo Credentials Fill Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo Delivery Partner
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('delivery@vexivo.com');
                    setLoginPassword('DeliveryPass123!');
                    setLoginError('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all active:scale-95"
                >
                  Auto Fill
                </button>
              </div>
              <div className="text-slate-300 space-y-0.5 font-mono text-[11px]">
                <p>Email: <span className="text-white">delivery@vexivo.com</span></p>
                <p>Password: <span className="text-white">DeliveryPass123!</span></p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Rider ID / Email or Mobile *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="delivery@vexivo.com or 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Access Delivery Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Clear Create Account Option below the login form */}
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">Don't have a partner account?</p>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setLoginError('');
                }}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Create Account — Join Delivery Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center space-x-4">
          <Link to="/" className="hover:text-white transition-colors">
            ← Return to Storefront
          </Link>
          <span>•</span>
          <Link to="/become-a-seller" className="hover:text-white transition-colors">
            Seller Central
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white transition-colors">
            Dispatch Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLogin;
