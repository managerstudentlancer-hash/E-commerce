import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
    }
  }, [user, redirectTarget, navigate]);

  const passCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passScore = Object.values(passCriteria).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passCriteria.length) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!passCriteria.uppercase || !passCriteria.number || !passCriteria.special) {
      setError('Password must include at least one uppercase letter (A-Z), one number (0-9), and one special symbol.');
      return;
    }

    if (phone && phone.trim()) {
      const cleaned = phone.replace(/[\s\-\(\)]/g, '');
      const isIndian = /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
      if (!isIndian) {
        setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const createdUser = await register({ name, email, password, phone, isSeller });
      if (createdUser.role === 'seller') {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller');
      } else {
        navigate(redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
      }
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
                  name="email"
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

            {/* Indian Mobile Phone Field */}
            <div>
              <label
                htmlFor="register-phone"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Indian Mobile Number (Optional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center space-x-1 pointer-events-none text-neutral-500 font-bold text-xs border-r border-neutral-300 pr-2">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  id="register-phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Enables instant OTP login via your Indian phone.
              </p>
            </div>

            {/* Seller Account Option */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Register as Marketplace Seller
                  </span>
                  <span className="text-[11px] text-neutral-500 block leading-relaxed mt-0.5">
                    Grants access to your personal Seller Dashboard where you can list, price, and sell products on VEXIVO.
                  </span>
                </div>
              </label>
            </div>

            {/* Password Field with Security Strength Meter */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5"
              >
                Security Password (Min 8 Characters) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  name="password"
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

              {/* Password Strength Visual Meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2 animate-in fade-in">
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passScore >= step
                            ? passScore === 1
                              ? 'bg-rose-500'
                              : passScore === 2
                              ? 'bg-amber-500'
                              : passScore === 3
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                            : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <span className={`flex items-center space-x-1 ${passCriteria.length ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}`}>
                      <span>{passCriteria.length ? '✓' : '○'}</span>
                      <span>8+ Characters</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passCriteria.uppercase ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}`}>
                      <span>{passCriteria.uppercase ? '✓' : '○'}</span>
                      <span>Uppercase (A-Z)</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passCriteria.number ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}`}>
                      <span>{passCriteria.number ? '✓' : '○'}</span>
                      <span>Number (0-9)</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passCriteria.special ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}`}>
                      <span>{passCriteria.special ? '✓' : '○'}</span>
                      <span>Symbol (!@#$)</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (password.length > 0 && passScore < 4)}
              className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all mt-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account Securely</span>
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
