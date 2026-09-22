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
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

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

  const handleQuickFill = (adminEmail, adminPass) => {
    setEmail(adminEmail);
    setPassword(adminPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await adminLogin(email, password);
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
          <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
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
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vexivo.com"
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
                <span className="text-[11px] text-neutral-500">Encrypted Passkey</span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
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
                  <span>Authenticate & Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Admin Demo Access</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-3">
              Click below to autofill verified administrator credentials:
            </p>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@vexivo.com', 'AdminPass123!')}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-bold text-center transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>⚡ Auto-Fill Admin Account (`admin@vexivo.com`)</span>
            </button>
          </div>

          {/* Footer Back to Customer Login */}
          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Not an administrator? <span className="underline underline-offset-4 text-white font-medium">Customer Login →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
