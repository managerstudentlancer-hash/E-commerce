import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(name, email, password, phone);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-neutral-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-400 selection:text-black font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" style={{ animationDelay: '1.5s' }} />

      {/* Main Container */}
      <div className="max-w-4xl w-full bg-neutral-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-neutral-800 overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Editorial Visual Column (5 Cols) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 sm:p-10 overflow-hidden bg-black/60 border-r border-neutral-800/80">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
            alt="VEXIVO Membership"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40 pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-widest text-white group-hover:text-amber-300 transition-colors">
                VEXIVO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </Link>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold mt-1">
              The Member Collective
            </p>
          </div>

          {/* Perks */}
          <div className="relative z-10 space-y-6 my-auto py-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 backdrop-blur-md border border-neutral-700/60 text-xs text-amber-300 font-semibold shadow-inner">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Privileged Patron Privileges</span>
            </div>

            <blockquote className="text-sm font-medium leading-relaxed text-neutral-200">
              “Join over 18,500 patrons worldwide enjoying private drop access, bespoke tailoring, and acoustic masterclasses.”
            </blockquote>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>10% Welcome Voucher applied automatically</span>
              </div>
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Tracked Royal Mail Express Delivery</span>
              </div>
              <div className="flex items-center space-x-2.5 text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Lifetime craft warranty on luxury leather & sound</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-neutral-400 flex items-center space-x-2 pt-4 border-t border-neutral-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Secure 256-Bit SSL Encrypted Registry</span>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-neutral-950/60 relative">
          
          {/* Header Switcher */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-5 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Begin your bespoke VEXIVO luxury journey today.
              </p>
            </div>
            <Link
              to="/login"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition-colors whitespace-nowrap ml-3"
            >
              Have an account?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 text-red-300 text-xs font-semibold border border-red-800/80 flex items-center space-x-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Charlotte Vance"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
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

            {/* Phone Field */}
            <div>
              <label
                htmlFor="register-phone"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Mobile Phone <span className="text-neutral-500 font-normal lowercase">(for SMS delivery alerts)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="register-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-700 bg-neutral-900 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Password (min 6 characters) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a confidential password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-neutral-500 text-center mt-5 leading-relaxed">
            By registering, you agree to VEXIVO's{' '}
            <Link to="/terms" className="underline hover:text-amber-300 transition-colors">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline hover:text-amber-300 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
