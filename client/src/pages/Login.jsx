import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  X,
  History,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = useState(
    location.pathname === '/forgot-password' ? 'forgot-password' : 'email'
  ); // 'email' | 'phone' | 'forgot-password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Forgot Password Real-Time Email OTP State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [forgotDevOtp, setForgotDevOtp] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // Suggestions & Saved Accounts State
  const [savedEmails, setSavedEmails] = useState([]);
  const [savedPhones, setSavedPhones] = useState([]);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, sendOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  // Sync route changes if navigated to /forgot-password
  useEffect(() => {
    if (location.pathname === '/forgot-password') {
      setAuthMode('forgot-password');
      setError('');
    }
  }, [location.pathname]);

  // Load saved suggestions and remembered email on mount
  useEffect(() => {
    try {
      const storedEmails = JSON.parse(localStorage.getItem('vexivo_saved_emails') || '[]');
      if (Array.isArray(storedEmails)) setSavedEmails(storedEmails);

      const storedPhones = JSON.parse(localStorage.getItem('vexivo_saved_phones') || '[]');
      if (Array.isArray(storedPhones)) setSavedPhones(storedPhones);

      const rememberedEmail = localStorage.getItem('vexivo_remembered_email');
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setForgotEmail(rememberedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    let timer;
    if (lockoutSeconds > 0) {
      timer = setTimeout(() => setLockoutSeconds((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutSeconds]);

  // Forgot password OTP countdown timer
  useEffect(() => {
    let timer;
    if (forgotCountdown > 0) {
      timer = setTimeout(() => setForgotCountdown(forgotCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCountdown]);

  // Navigate if already logged in
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

  // OTP resend countdown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Save successful email to history for browser/custom suggestions
  const persistEmailSuggestion = (emailToSave) => {
    const trimmed = emailToSave.trim().toLowerCase();
    if (!trimmed) return;
    try {
      if (rememberMe) {
        localStorage.setItem('vexivo_remembered_email', trimmed);
      } else {
        localStorage.removeItem('vexivo_remembered_email');
      }
      const updated = Array.from(new Set([trimmed, ...savedEmails])).slice(0, 5);
      setSavedEmails(updated);
      localStorage.setItem('vexivo_saved_emails', JSON.stringify(updated));
    } catch {
      // Storage quota or private mode safe
    }
  };

  // Save successful phone to history
  const persistPhoneSuggestion = (phoneToSave) => {
    const trimmed = phoneToSave.trim();
    if (!trimmed) return;
    try {
      const updated = Array.from(new Set([trimmed, ...savedPhones])).slice(0, 5);
      setSavedPhones(updated);
      localStorage.setItem('vexivo_saved_phones', JSON.stringify(updated));
    } catch {
      // Storage safe
    }
  };

  // Remove saved account suggestion
  const handleRemoveSavedEmail = (emailToRemove) => {
    const updated = savedEmails.filter((item) => item !== emailToRemove);
    setSavedEmails(updated);
    try {
      localStorage.setItem('vexivo_saved_emails', JSON.stringify(updated));
      if (localStorage.getItem('vexivo_remembered_email') === emailToRemove) {
        localStorage.removeItem('vexivo_remembered_email');
        if (email === emailToRemove) setEmail('');
      }
    } catch {
      // Storage safe
    }
  };

  // 1. Email Login Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email.trim(), password);
      // Persist login suggestion so future sessions suggest it automatically
      persistEmailSuggestion(email);

      if (loggedInUser.role === 'admin') {
        navigate(redirectTarget?.startsWith('/admin') ? redirectTarget : '/admin');
      } else if (loggedInUser.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
    } catch (err) {
      if (err.status === 429 || (err.message && err.message.toLowerCase().includes('lockout'))) {
        setLockoutSeconds(15 * 60); // 15 mins lock
      }
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
      // Persist phone suggestion
      persistPhoneSuggestion(phone);

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

  // 4. Request Real-Time Password Reset OTP via Email
  const handleSendForgotOtp = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = (forgotEmail || email).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      const res = await api.auth.forgotPassword(targetEmail);
      if (res.success) {
        setForgotEmail(targetEmail);
        setForgotOtpSent(true);
        setForgotCountdown(45);
        if (res.devOtp) {
          setForgotDevOtp(res.devOtp);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch password reset OTP. Please check your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 5. Verify Real-Time OTP & Update New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match. Please verify both passwords match.');
      return;
    }

    setError('');
    setForgotLoading(true);

    try {
      const res = await api.auth.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });

      if (res.success) {
        setForgotSuccess(res.message || 'Password reset successfully! You can now log in.');
        setEmail(forgotEmail);
        setPassword('');
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotDevOtp('');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check the OTP code.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Native Browser Suggestions Datalists */}
      <datalist id="saved-emails-list">
        {savedEmails.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
      <datalist id="saved-phones-list">
        {savedPhones.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

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

          <div className="relative z-10 space-y-2">
            <div className="text-[11px] text-neutral-300 flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>256-Bit TLS Bank-Grade Encryption</span>
            </div>
            <p className="text-[10px] text-neutral-400">
              Protected against automated brute-force intrusion.
            </p>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
          {/* Header */}
          {authMode === 'forgot-password' ? (
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
              <div>
                <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your email to receive a 6-digit real-time verification OTP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email');
                  setError('');
                  setForgotSuccess('');
                }}
                className="text-xs font-bold text-neutral-900 hover:text-[#C4301C] inline-flex items-center space-x-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Security Lockout Banner */}
          {lockoutSeconds > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 text-amber-900 text-xs border border-amber-200 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Security Lockout Active</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Too many failed attempts detected. Please wait{' '}
                  <span className="font-mono font-bold text-amber-950">
                    {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                  </span>{' '}
                  before attempting to sign in again.
                </p>
              </div>
            </div>
          )}

          {/* Standard Error Message */}
          {error && lockoutSeconds === 0 && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-[#C4301C] text-xs font-semibold border border-red-200 flex items-start space-x-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* MODE 1: Email + Password Form (Customer & Seller) */}
          {authMode === 'email' && (
            <form
              method="POST"
              action="#"
              autoComplete="on"
              onSubmit={handleEmailSubmit}
              className="space-y-4"
            >
              {/* Recently Used Login Suggestion Pill */}
              {savedEmails.length > 0 && (
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <History className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span className="text-neutral-500 font-medium">Suggestion:</span>
                    <button
                      type="button"
                      onClick={() => setEmail(savedEmails[0])}
                      className="font-bold text-neutral-900 hover:text-black underline truncate max-w-[180px] sm:max-w-[220px]"
                      title="Click to fill saved email"
                    >
                      {savedEmails[0]}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSavedEmail(savedEmails[0])}
                    className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors ml-1"
                    title="Remove this suggestion"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Email Field with Browser Autocomplete & Datalist */}
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
                    name="email"
                    type="email"
                    required
                    autoComplete="username email"
                    list="saved-emails-list"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
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
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot-password');
                      setError('');
                      setForgotSuccess('');
                      setForgotOtpSent(false);
                      if (email) setForgotEmail(email);
                    }}
                    className="text-xs font-semibold text-neutral-500 hover:text-black hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
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
                  <span>Remember me &amp; suggest on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
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

              {/* Suggested Mobile Phone */}
              {savedPhones.length > 0 && !phone && (
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <History className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span className="text-neutral-500 font-medium">Saved Phone:</span>
                    <button
                      type="button"
                      onClick={() => setPhone(savedPhones[0])}
                      className="font-bold text-neutral-900 hover:text-black underline truncate font-mono"
                    >
                      {savedPhones[0]}
                    </button>
                  </div>
                </div>
              )}

              {!otpSent ? (
                // Step 1: Enter Mobile Number
                <form
                  method="POST"
                  action="#"
                  autoComplete="on"
                  onSubmit={handleRequestOtp}
                  className="space-y-4"
                >
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
                        name="tel"
                        type="tel"
                        required
                        autoComplete="tel"
                        list="saved-phones-list"
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
                    <input
                      id="login-otp"
                      name="one-time-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full py-3.5 px-4 text-center tracking-[0.5em] font-mono text-lg font-bold rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  {/* Dev OTP hint (if active in dev environment) */}
                  {devOtpHint && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                      <span>Development SMS Code: <strong className="font-mono text-amber-950 font-bold">{devOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtpHint)}
                        className="text-xs font-bold text-amber-900 underline"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span>Didn't receive code?</span>
                    {countdown > 0 ? (
                      <span className="font-semibold text-neutral-400">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="font-bold text-neutral-900 hover:underline"
                      >
                        Resend OTP
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

          {/* MODE 3: Real-Time Email OTP Forgot Password & Reset */}
          {authMode === 'forgot-password' && (
            <div className="space-y-4">
              {forgotSuccess ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">Password Reset Complete!</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      {forgotSuccess}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('email');
                      setError('');
                      setForgotSuccess('');
                    }}
                    className="btn-pill-dark w-full py-3.5 text-xs uppercase tracking-wider mt-2"
                  >
                    Sign In With New Password
                  </button>
                </div>
              ) : !forgotOtpSent ? (
                // STEP 1: Enter Registered Email to request Real-Time OTP
                <form onSubmit={handleSendForgotOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-start space-x-2">
                    <span className="text-base">🔑</span>
                    <div>
                      <span className="font-semibold text-neutral-900">Email Recovery:</span>
                      <p className="mt-0.5 text-neutral-500">
                        Enter your registered account email. A 6-digit real-time verification code will be sent immediately.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      Registered Email Address
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP to Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Email Reset OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // STEP 2: Verify 6-Digit Email OTP & Enter New Password
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <div>
                      <span className="text-neutral-500">OTP dispatched to:</span>
                      <p className="font-bold text-neutral-900 truncate max-w-[200px]">{forgotEmail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotOtpSent(false);
                        setForgotOtp('');
                        setForgotDevOtp('');
                        setError('');
                      }}
                      className="text-xs font-bold text-[#C4301C] hover:underline"
                    >
                      Change Email
                    </button>
                  </div>

                  {/* Real-time Dev OTP Banner */}
                  {forgotDevOtp && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between animate-in fade-in">
                      <span>Real-Time Reset OTP: <strong className="font-mono text-amber-950 font-bold">{forgotDevOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setForgotOtp(forgotDevOtp)}
                        className="text-xs font-bold text-amber-900 underline"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  {/* 6-Digit OTP */}
                  <div>
                    <label
                      htmlFor="forgot-otp"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      Enter 6-Digit Email OTP
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-neutral-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="1 2 3 4 5 6"
                        className="w-full pl-11 pr-4 py-3.5 font-mono text-base font-bold tracking-[0.3em] rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mt-1.5">
                      <span>Didn't receive code?</span>
                      {forgotCountdown > 0 ? (
                        <span className="font-semibold text-neutral-400">
                          Resend in {forgotCountdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendForgotOtp}
                          className="font-bold text-neutral-900 hover:underline"
                        >
                          Resend Email OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="forgot-new-password"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      New Password (min 6 characters)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-neutral-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-new-password"
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-4 text-neutral-400 hover:text-neutral-800 p-1 transition-colors"
                        aria-label={showForgotNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label
                      htmlFor="forgot-confirm-password"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 pointer-events-none text-neutral-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-confirm-password"
                        type={showForgotConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        className="absolute right-4 text-neutral-400 hover:text-neutral-800 p-1 transition-colors"
                        aria-label={showForgotConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtp.length !== 6 || !forgotNewPassword}
                    className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify OTP &amp; Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Security & Authentication Assurance Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Max 5 login attempts before safety lockout</span>
            </span>
            <span className="text-neutral-400">
              Never share your credentials
            </span>
          </div>

          {/* Dedicated Administrator Portal Separation */}
          <div className="mt-3 pt-3 border-t border-neutral-100 text-center">
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
