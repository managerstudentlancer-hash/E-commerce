import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
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
      await register({ name, email, password, phone });
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
            alt="VEXIVO Membership"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-extrabold tracking-widest text-white inline-block">
              VEXIVO
            </Link>
            <p className="text-xs text-neutral-300 mt-1 uppercase tracking-widest font-semibold">
              The Member Collective
            </p>
          </div>

          {/* Perks */}
          <div className="relative z-10 space-y-6">
            <blockquote className="text-sm font-medium leading-relaxed text-neutral-200">
              “Join over 18,500 patrons worldwide enjoying private drop access, bespoke bespoke tailoring, and acoustic masterclasses.”
            </blockquote>

            <div className="space-y-2.5 pt-4 border-t border-white/20 text-xs">
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>10% Welcome Voucher applied automatically</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Tracked Royal Mail Next-Day Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Lifetime craft warranty on all hardware</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-neutral-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-Bit SSL Encrypted Registry</span>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {/* Header Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Create an Account
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Begin your bespoke VEXIVO experience today.
              </p>
            </div>
            <Link
              to="/login"
              className="text-xs font-bold text-neutral-900 hover:text-[#C4301C] underline underline-offset-4 transition-colors"
            >
              Have an account?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-[#C4301C] text-xs font-semibold border border-red-200 flex items-center space-x-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Charlotte Vance"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arpit123@gmail.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="register-phone"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Mobile Phone (Optional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="register-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900142"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Password (min 6 characters) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-neutral-500 text-center mt-4 leading-relaxed">
            By registering, you agree to VEXIVO's{' '}
            <Link to="/legal/terms" className="underline hover:text-black">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/legal/privacy" className="underline hover:text-black">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
