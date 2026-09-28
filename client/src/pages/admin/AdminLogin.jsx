import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2,
  Fingerprint,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = Code & New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotDevCode, setForgotDevCode] = useState('');

  const { user, isAdmin, adminLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in as admin, redirect to admin dashboard immediately
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const target = location.state?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const [savedAdminEmails, setSavedAdminEmails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vexivo_admin_saved_emails') || '[]');
    } catch {
      return [];
    }
  });

  const persistAdminEmail = (emailToSave) => {
    const trimmed = (emailToSave || '').trim().toLowerCase();
    if (!trimmed) return;
    try {
      const updated = Array.from(new Set([trimmed, ...savedAdminEmails])).slice(0, 3);
      setSavedAdminEmails(updated);
      localStorage.setItem('vexivo_admin_saved_emails', JSON.stringify(updated));
    } catch {}
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) {
      setForgotError('Please enter your administrator email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.auth.adminForgotPassword(forgotEmail);
      if (res.success) {
        setForgotStep(2);
        if (res.devCode) {
          setForgotDevCode(res.devCode);
          setForgotCode(res.devCode); // Auto-fill in dev
        }
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to dispatch reset code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotCode || forgotCode.length !== 6) {
      setForgotError('Please enter the 6-digit administrative verification code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setForgotError('New master password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.auth.adminResetPassword({
        email: forgotEmail,
        code: forgotCode,
        newPassword: forgotNewPassword,
      });

      if (res.success) {
        setIsForgotModalOpen(false);
        setEmail(forgotEmail);
        setPassword(forgotNewPassword);
        setSuccessMessage('Master Administrator password has been reset successfully! You can now log in.');
        setError('');
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please check your verification code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await adminLogin(email, password);
      persistAdminEmail(email);
      if (loggedInUser.role === 'admin') {
        const target = location.state?.from?.pathname || '/admin';
        navigate(target, { replace: true });
      } else {
        setError('Access Denied: Only administrators are authorized to access this portal.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-neutral-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#C4301C] selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#C4301C]/20 to-purple-700/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full bg-[#111622]/90 backdrop-blur-2xl rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Side Security Briefing Column (5 Cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0D111A] p-10 flex-col justify-between border-r border-neutral-800/80 relative">
          <div className="space-y-6">
            {/* Top Brand Tag */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xl font-black tracking-tight text-white">VEXIVO</span>
              <span className="px-2 py-0.5 rounded-full bg-[#C4301C] text-white text-[9px] font-black tracking-widest uppercase">
                SECURITY GATEWAY
              </span>
            </div>

            <div className="pt-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C4301C]/15 border border-[#C4301C]/30 text-[#C4301C] flex items-center justify-center mb-4">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                VEXIVO Command Center
              </h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Centralized management portal for product inventory, order pipelines, coupons, customer accounts, and site analytics.
              </p>
            </div>

            {/* Security Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center space-x-3 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center space-x-3 text-xs text-neutral-300">
                <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>256-Bit JWT Signed Token Authentication</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center space-x-3 text-xs text-neutral-300">
                <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Isolated Admin Endpoint Protection</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Gateway Online</span>
            </span>
            <span>v1.0.0</span>
          </div>
        </div>

        {/* Right Side Form Column (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-neutral-800/80 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1 lg:hidden">
                <span className="text-base font-black tracking-tight text-white">VEXIVO</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#C4301C] text-white text-[8px] font-black uppercase">
                  ADMIN
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your administrative credentials to manage store operations.
              </p>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors group"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs font-medium flex items-start space-x-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Caps Lock Alert */}
          {capsLockOn && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Caps Lock is ON</span>
            </div>
          )}

          {/* Form */}
          <datalist id="admin-saved-emails">
            {savedAdminEmails.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <form method="POST" action="#" autoComplete="on" onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
            {/* Saved Email Suggestion Chip */}
            {savedAdminEmails.length > 0 && !email && (
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between text-neutral-300">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="text-neutral-500">Saved:</span>
                  <button
                    type="button"
                    onClick={() => setEmail(savedAdminEmails[0])}
                    className="font-bold text-white hover:underline truncate"
                  >
                    {savedAdminEmails[0]}
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">1-Click</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username email"
                  list="admin-saved-emails"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#C4301C] focus:ring-1 focus:ring-[#C4301C] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300"
                >
                  Admin Master Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setForgotEmail(email || '');
                    setForgotStep(1);
                    setForgotError('');
                    setForgotCode('');
                    setForgotNewPassword('');
                    setForgotConfirmPassword('');
                  }}
                  className="text-[11px] font-bold text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#C4301C] focus:ring-1 focus:ring-[#C4301C] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-neutral-400 hover:text-white focus:outline-none p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#C4301C] hover:bg-[#a82514] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#C4301C]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate &amp; Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security & Authentication Assurance Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-Bit &amp; Brute-Force Rate Protected</span>
            </span>
            <span className="text-neutral-500">Manual Entry Required</span>
          </div>

          {/* Footer Back to Customer Login */}
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Not an administrator? <span className="underline underline-offset-4 text-white font-medium">Customer Login →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0F1420] border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-neutral-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Reset Master Password</h3>
                  <p className="text-[10px] text-neutral-400">Step {forgotStep} of 2 • Secure Verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error in Modal */}
            {forgotError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: Enter Admin Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enter your registered administrator email address to generate a 6-digit cryptographic verification passkey.
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@vexivo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-red-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Get Reset Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter Code & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Code dispatched to:</span>
                  <span className="font-mono font-bold text-white">{forgotEmail}</span>
                </div>

                {/* Dev Code Auto-Fill Chip */}
                {forgotDevCode && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                    <span>Dev Test Code: <strong className="font-mono text-white tracking-widest">{forgotDevCode}</strong></span>
                    <button
                      type="button"
                      onClick={() => setForgotCode(forgotDevCode)}
                      className="underline font-bold text-amber-200 hover:text-white"
                    >
                      Fill
                    </button>
                  </div>
                )}

                {/* 6-Digit Code */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white text-center font-mono text-base tracking-[0.25em] focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    New Master Password (Min. 6 chars)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0E17] border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotError('');
                    }}
                    className="py-2.5 px-4 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-bold transition-all"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotCode.length !== 6 || forgotNewPassword.length < 6}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C4301C] hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 shadow-md"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update Master Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
