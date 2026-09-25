import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Smartphone,
  RefreshCw,
  Edit2,
  Eye,
  EyeOff,
  ChevronDown,
  Globe2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India', digits: 10, placeholder: '98765 43210' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom', digits: 10, placeholder: '7700 900142' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States', digits: 10, placeholder: '202 555 0199' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'United Arab Emirates', digits: 9, placeholder: '50 123 4567' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia', digits: 9, placeholder: '412 345 678' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany', digits: 11, placeholder: '151 23456789' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore', digits: 8, placeholder: '8123 4567' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France', digits: 9, placeholder: '6 12 34 56 78' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan', digits: 10, placeholder: '90 1234 5678' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia', digits: 9, placeholder: '50 123 4567' },
];

const Login = () => {
  // Mode: 'phone' (Real Phone OTP) | 'email'
  const [authMode, setAuthMode] = useState('phone');

  // Phone OTP States
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [smsDeliveryStatus, setSmsDeliveryStatus] = useState(null);

  // Email/Password States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI Feedback States
  const [error, setError] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, sendOtp, verifyOtp, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputRefs = useRef([]);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/account';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const fullPhoneNumber = `${selectedCountry.code} ${phoneNumber.trim()}`;

  const triggerError = (msg) => {
    setError(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 600);
  };

  // Step 1: Send Real SMS OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 7) {
      triggerError('Please enter a valid mobile phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(fullPhoneNumber);
      setOtpSent(true);
      setTimer(60); // 60s cooldown for real SMS
      setSmsDeliveryStatus({
        provider: response.provider || 'SMS Gateway',
        realSmsSent: response.realSmsSent,
        phone: response.phone || fullPhoneNumber,
      });
      setSuccessMsg(`A 6-digit verification code has been dispatched via SMS to ${fullPhoneNumber}`);
      
      // Auto-focus first OTP digit box
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 150);
    } catch (err) {
      triggerError(err.message || 'Failed to dispatch SMS verification code. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Real SMS OTP
  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;
    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const response = await sendOtp(fullPhoneNumber);
      setTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMsg(`Fresh verification code sent via SMS to ${fullPhoneNumber}`);
      setSmsDeliveryStatus({
        provider: response.provider || 'SMS Gateway',
        realSmsSent: response.realSmsSent,
        phone: response.phone || fullPhoneNumber,
      });
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err) {
      triggerError(err.message || 'Unable to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index, value) => {
    // Handle paste of whole 6-digit OTP
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        const nextIdx = Math.min(pasted.length, 5);
        if (otpInputRefs.current[nextIdx]) {
          otpInputRefs.current[nextIdx].focus();
        }
        if (pasted.length === 6) {
          executeVerification(newDigits.join(''));
        }
      }
      return;
    }

    const cleanChar = value.replace(/[^0-9]/g, '');
    const updated = [...otpDigits];
    updated[index] = cleanChar;
    setOtpDigits(updated);

    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If last digit filled, auto submit
    if (cleanChar && index === 5) {
      const fullCode = updated.join('');
      if (fullCode.length === 6) {
        executeVerification(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify Real OTP
  const executeVerification = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      triggerError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyOtp(fullPhoneNumber, code, customerName);
      const destination = location.state?.from?.pathname || '/account';
      navigate(destination, { replace: true });
    } catch (err) {
      triggerError(err.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    executeVerification();
  };

  // Traditional Email/Password Login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/account';
        navigate(from);
      }
    } catch (err) {
      triggerError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-neutral-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-400 selection:text-black font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-800/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Firebase Phone Auth - Invisible reCAPTCHA Container (required, hidden from user) */}
      <div id="recaptcha-container"></div>

      {/* Main Container */}
      <div className="max-w-4xl w-full bg-neutral-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-neutral-800 overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Editorial Visual Column (5 Cols) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 sm:p-10 overflow-hidden bg-black/60 border-r border-neutral-800/80">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
            alt="VEXIVO Luxury Lifestyle"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40 pointer-events-none" />

          {/* Brand Logo & Tag */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-widest text-white group-hover:text-amber-300 transition-colors">
                VEXIVO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </Link>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold mt-1">
              London Atelier • Member Portal
            </p>
          </div>

          {/* Center Luxury Feature Showcase */}
          <div className="relative z-10 space-y-6 my-auto py-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 backdrop-blur-md border border-neutral-700/60 text-xs text-amber-300 font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Mobile SMS Authentication</span>
            </div>

            <blockquote className="text-sm font-medium leading-relaxed text-neutral-200">
              “Instant, passwordless access to your bespoke luxury portal with genuine SMS verification direct to your device.”
            </blockquote>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Direct 6-digit OTP delivery to your phone</span>
              </div>
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Track live orders & exclusive private drops</span>
              </div>
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Sync shopping bag across all devices</span>
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="relative z-10 text-[11px] text-neutral-400 flex items-center space-x-2 pt-4 border-t border-neutral-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>256-Bit Encrypted Secure Sign-In</span>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-neutral-950/60 relative">
          
          {/* Top Switcher Bar */}
          <div className="border-b border-neutral-800/80 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {authMode === 'phone' ? 'Customer Sign In' : 'Email Sign In'}
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  {authMode === 'phone'
                    ? 'Enter your mobile number to receive a secure SMS verification code.'
                    : 'Access your luxury portfolio using registered email credentials.'}
                </p>
              </div>
              <Link
                to="/register"
                className="text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition-colors whitespace-nowrap ml-3"
              >
                New member?
              </Link>
            </div>

            {/* Mode Toggle Pills */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-2xl mt-5 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('phone');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  authMode === 'phone'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile SMS OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('email');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  authMode === 'email'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email & Password</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={`mb-5 p-3.5 rounded-2xl bg-red-950/60 text-red-300 text-xs font-semibold border border-red-800/80 flex items-start space-x-2.5 ${shakeError ? 'animate-bounce' : ''}`}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-300 text-xs font-semibold border border-emerald-800/80 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* -------------------- REAL MOBILE PHONE OTP AUTHENTICATION -------------------- */}
          {authMode === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                /* Stage 1: Phone Number Entry */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="real-phone-input"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2"
                    >
                      Mobile Phone Number *
                    </label>

                    <div className="flex rounded-2xl border border-neutral-700 bg-neutral-900/90 overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                      {/* Interactive Country Selector */}
                      <div className="relative border-r border-neutral-800 bg-neutral-800/60">
                        <select
                          value={selectedCountry.code}
                          onChange={(e) => {
                            const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                            if (found) setSelectedCountry(found);
                          }}
                          className="appearance-none bg-transparent pl-3.5 pr-8 py-3.5 text-xs font-bold text-white focus:outline-none cursor-pointer h-full"
                          aria-label="Select Country Dial Code"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-neutral-900 text-white">
                              {c.flag} {c.code} ({c.name})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Phone Number Input */}
                      <div className="relative flex-1 flex items-center">
                        <input
                          id="real-phone-input"
                          type="tel"
                          required
                          autoFocus
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder={selectedCountry.placeholder}
                          maxLength={15}
                          className="w-full px-4 py-3.5 bg-transparent text-white text-sm font-medium tracking-wide placeholder-neutral-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-neutral-400 mt-2 flex items-center space-x-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>We will send a real 6-digit SMS verification code to this phone number.</span>
                    </p>
                  </div>

                  {/* Optional Name for First Time Shoppers */}
                  <div>
                    <label
                      htmlFor="customer-name-field"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2"
                    >
                      Your Name <span className="text-neutral-500 font-normal lowercase">(optional for new patrons)</span>
                    </label>
                    <input
                      id="customer-name-field"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Charlotte Vance"
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900/90 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length < 5}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Sending SMS OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Verification Code via SMS</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Stage 2: 6-Digit Real OTP Verification */
                <form onSubmit={handleVerifySubmit} className="space-y-5 animate-fade-in">
                  
                  {/* Phone Badge & Edit Action */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Code Dispatched to:</p>
                        <p className="text-xs font-black text-white">{fullPhoneNumber}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpDigits(['', '', '', '', '', '']);
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-300 hover:text-amber-200 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* 6-Digit PIN Boxes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3 text-center">
                      Enter 6-Digit SMS Verification Code
                    </label>

                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 bg-neutral-900 text-white transition-all duration-200 focus:outline-none ${
                            digit
                              ? 'border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                              : 'border-neutral-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend SMS Counter & Button */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <span className="text-neutral-400">Didn't receive SMS?</span>
                    {timer > 0 ? (
                      <span className="text-neutral-400 font-semibold">
                        Resend code in <strong className="text-amber-300 font-mono">{timer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-amber-300 hover:text-amber-200 font-bold hover:underline flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                        <span>Resend SMS OTP</span>
                      </button>
                    )}
                  </div>

                  {/* Verify & Enter Button */}
                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length !== 6}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Authenticating Code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Verify & Enter Store</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* -------------------- EMAIL / PASSWORD FALLBACK FLOW -------------------- */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="user-login-email"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="user-login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@vexivo.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="user-login-pwd"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-300"
                  >
                    Password *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-neutral-400 hover:text-amber-300 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="user-login-pwd"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your confidential password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
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

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 text-xs text-neutral-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 text-amber-400 focus:ring-amber-400 cursor-pointer accent-amber-400"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy Footnote */}
          <p className="text-[11px] text-neutral-500 text-center mt-6">
            By accessing your account, you agree to VEXIVO's{' '}
            <Link to="/terms" className="underline hover:text-amber-300 transition-colors">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline hover:text-amber-300 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
