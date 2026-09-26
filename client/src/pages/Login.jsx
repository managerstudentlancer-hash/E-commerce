import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [authMode, setAuthMode] = useState('email'); // 'email' | 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, sendOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate(redirectTarget?.startsWith('/admin') ? redirectTarget : '/admin');
      } else if (user.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
    }
  }, [user, redirectTarget, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleQuickFillEmail = (demoEmail, demoPassword) => {
    setAuthMode('email');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleQuickFillPhone = (demoPhone) => {
    setAuthMode('phone');
    setPhone(demoPhone);
    setOtpSent(false);
    setDevOtpHint('');
    setError('');
  };

  // 1. Email Login Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate(redirectTarget?.startsWith('/admin') ? redirectTarget : '/admin');
      } else if (loggedInUser.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. Request OTP for Indian Phone
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side Indian Phone validation
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const isIndian = /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
    if (!isIndian) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setCountdown(45);
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP & Authenticate Customer/Seller
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your mobile.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const loggedInUser = await loginWithOtp(phone, otp.trim());
      // Security: Mobile login is only for customer / seller
      if (loggedInUser.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-neutral-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Editorial Visual Column (5 Cols) */}
        <div className="hidden md:flex md:col-span-5 relative bg-neutral-900 text-white flex-col justify-between p-8 sm:p-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
            alt="VEXIVO Editorial"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-extrabold tracking-widest text-white inline-block">
              VEXIVO
            </Link>
            <p className="text-xs text-neutral-300 mt-1 uppercase tracking-widest font-semibold">
              London Atelier &amp; Marketplace
            </p>
          </div>

          {/* Editorial Quote & Perks */}
          <div className="relative z-10 space-y-6">
            <blockquote className="text-sm font-medium leading-relaxed text-neutral-200">
              “Precision tailoring, pure acoustic engineering, and everyday British luxury designed for longevity.”
            </blockquote>

            <div className="space-y-2.5 pt-4 border-t border-white/20 text-xs">
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Complimentary Express Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct Seller Marketplace Access</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-neutral-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Authentication</span>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
          {/* Header Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Sign in to manage your orders, products, and profile.
              </p>
            </div>
            <Link
              to="/register"
              className="text-xs font-bold text-neutral-900 hover:text-[#C4301C] underline underline-offset-4 transition-colors"
            >
              Need an account?
            </Link>
          </div>

          {/* Clean Authentication Mode Tabs: Email vs Mobile OTP */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                authMode === 'email'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                authMode === 'phone'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>📱 Mobile OTP</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                India
              </span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-[#C4301C] text-xs font-semibold border border-red-200 flex items-start space-x-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: Email + Password Form (Admin, Customer, Seller) */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-800"
                  >
                    Password
                  </label>
                  <Link
                    to="/contact"
                    className="text-xs font-semibold text-neutral-500 hover:text-black hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-neutral-800 focus:outline-none p-1 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer accent-black"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 2: Mobile Number + OTP Form (Customer & Seller Only) */}
          {authMode === 'phone' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                💡 <span className="font-semibold text-neutral-900">Normal User Login:</span> Enter your 10-digit Indian mobile number to log in or register instantly. (Admin access requires email credentials).
              </div>

              {!otpSent ? (
                // Step 1: Enter Mobile Number
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      Indian Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center space-x-1.5 pointer-events-none text-neutral-700 font-bold text-xs border-r border-neutral-300 pr-2">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input
                        id="login-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-20 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Accepts 10 digits (e.g. 9876543210) or with +91 prefix.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !phone}
                    className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Step 2: Enter 6-digit OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-500">Code sent to:</span>
                      <p className="text-xs font-bold text-neutral-900 font-mono">
                        {phone.startsWith('+91') ? phone : `+91 ${phone}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setDevOtpHint('');
                      }}
                      className="text-xs font-bold text-[#C4301C] hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="login-otp"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-neutral-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="login-otp"
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-lg tracking-[0.3em] font-mono text-center placeholder-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>
                  </div>

                  {/* Dev / Test Auto-Fill Helper Chip */}
                  {devOtpHint && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <span>Test Code: <strong className="font-mono">{devOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtpHint)}
                        className="font-bold underline text-amber-800 hover:text-black ml-2"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    {countdown > 0 ? (
                      <span>Resend code in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="flex items-center space-x-1 font-bold text-neutral-900 hover:text-black"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify &amp; Enter Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Demo 1-Click Fill Helper for Customers/Sellers */}
          <div className="mt-6 pt-5 border-t border-neutral-100 bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Instant 1-Click Demo Fill:</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFillEmail('arpit123@gmail.com', 'Arpit123!')}
                className="py-2.5 px-3 rounded-xl bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-bold text-center transition-all shadow-sm hover:shadow"
              >
                👤 Arpit (Email)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillPhone('9876543210')}
                className="py-2.5 px-3 rounded-xl bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-bold text-center transition-all shadow-sm hover:shadow"
              >
                📱 Mobile OTP (9876543210)
              </button>
            </div>
          </div>

          {/* Dedicated Administrator Portal Separation */}
          <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
            <p className="text-[11px] text-neutral-500 flex items-center justify-center space-x-1.5">
              <span>Are you a store administrator?</span>
              <Link to="/admin/login" className="font-bold text-[#C4301C] hover:underline inline-flex items-center space-x-0.5">
                <span>Go to Admin Portal</span>
                <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
