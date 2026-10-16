import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, Store, Gift, Truck, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const isSellerParam =
    searchParams.get('seller') === 'true' ||
    searchParams.get('role') === 'seller' ||
    redirectTarget?.includes('seller');
  const [isSeller, setIsSeller] = useState(isSellerParam);

  React.useEffect(() => {
    if (isSellerParam) {
      setIsSeller(true);
    }
  }, [isSellerParam]);

  const getSuccessRedirect = (targetUser) => {
    const fromPath = location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ''}`
      : null;
    if (targetUser?.role === 'admin') {
      return '/admin';
    }
    if (targetUser?.role === 'seller') {
      return redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account/seller';
    }
    return fromPath || (redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/account');
  };

  React.useEffect(() => {
    if (user) {
      navigate(getSuccessRedirect(user));
    }
  }, [user, redirectTarget, navigate, location.state]);

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
      navigate(getSuccessRedirect(createdUser));
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-neutral-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Customer Benefits & Trust Column (5 Cols) - Clean, Modern & Attractive */}
        <div className="hidden md:flex md:col-span-5 relative bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE1] to-[#ECE1D0] border-r border-[#E8DEC8] flex-col justify-between p-7 sm:p-8 overflow-hidden select-none">
          {/* Subtle ambient luxury glow circles */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />

          {/* Top Brand Header & Badge */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-extrabold tracking-widest text-neutral-900 flex items-center">
                <span>VEXIVO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4301C] ml-1 mb-1" />
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
                Verified Store
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-medium">
              Curated Fashion, Footwear &amp; Lifestyle Essentials
            </p>
          </div>

          {/* Customer Benefits Cards Showcase */}
          <div className="relative z-10 space-y-3 my-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 block">
              Member Privileges
            </span>

            {/* Benefit 1: 10% Welcome Gift */}
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-xs flex items-start space-x-3 transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-neutral-900">Flat 10% Welcome Gift</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">CODE: VEX10</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Instant discount automatically applied on your first order.
                </p>
              </div>
            </div>

            {/* Benefit 2: Pan-India Express Delivery */}
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-xs flex items-start space-x-3 transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-neutral-900 block">Free Pan-India Express</span>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Fast doorstep delivery across 28,000+ PIN codes with live tracking.
                </p>
              </div>
            </div>

            {/* Benefit 3: 7-Day Easy Returns */}
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-xs flex items-start space-x-3 transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-neutral-900 block">Hassle-Free Doorstep Pickup</span>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  7-day easy replacements or full refunds to original payment method.
                </p>
              </div>
            </div>

            {/* Benefit 4: 100% Genuine Certified */}
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-xs flex items-start space-x-3 transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-neutral-900 block">100% Verified Quality</span>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Direct artisan &amp; flagship atelier sourcing with strict quality checks.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof & Trust Rating */}
          <div className="relative z-10 pt-3 border-t border-[#E8DEC8]/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-neutral-800">4.9 / 5.0</span>
            </div>
            <span className="text-[10px] text-neutral-600 font-medium">
              18,500+ Verified Customers
            </span>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {isSellerParam && (
            <div className="mb-5 p-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-blue-950 text-white rounded-2xl flex items-center space-x-3 shadow-md border border-neutral-800 animate-in fade-in">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">VEXIVO Seller Partner Registration</h3>
                <p className="text-xs text-neutral-300 mt-0.5">Apna seller store create karein aur products sell karein.</p>
              </div>
            </div>
          )}

          {location.state?.from?.pathname === '/checkout' && !isSellerParam && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-2 text-xs font-bold text-amber-950 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Order place karne ke liye pehle account banayein ya login karein. Account bante hi aapka checkout khul jayega.</span>
            </div>
          )}

          {/* Primary Top Action Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 bg-neutral-100 p-1.5 rounded-2xl mb-4 shadow-inner">
            <Link
              to={isSellerParam ? '/login?redirect=/become-a-seller&role=seller' : '/login'}
              state={location.state}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-neutral-500 hover:text-neutral-950 flex items-center justify-center space-x-1.5 hover:bg-white/60 transition-all"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Sign In / Login</span>
            </Link>
            <button
              type="button"
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-neutral-950 shadow-sm flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Header Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {isSellerParam ? 'Register as Seller' : 'Create Account'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isSellerParam
                  ? 'Sell your handcrafted fashion & lifestyle products across India.'
                  : 'Get instant access to tracked orders, wishlist & exclusive drops.'}
              </p>
            </div>
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

            {/* Seller Account Indicator (Only visible when arriving via Seller Portal) */}
            {isSellerParam && (
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Creating a Marketplace Seller Account
                    </span>
                    <span className="text-[11px] text-blue-700 block leading-relaxed mt-0.5">
                      Account banne ke baad aap seedha Seller Onboarding &amp; Store setup par pahunchenge.
                    </span>
                  </div>
                </div>
              </div>
            )}

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

          {/* Fast Google 1-Click Sign-Up (At the Bottom) */}
          {!isSellerParam && (
            <div className="mt-4 pt-3 border-t border-neutral-100">
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  <span className="bg-white px-2">Or continue with</span>
                </div>
              </div>
              <GoogleAuthButton
                text="Sign up with Google"
                onSuccess={(loggedUser) => navigate(getSuccessRedirect(loggedUser))}
                onError={(err) => setError(err)}
              />
            </div>
          )}

          <p className="text-[11px] text-neutral-500 text-center mt-4 leading-relaxed">
            By registering, you agree to VEXIVO's{' '}
            <Link to="/terms" className="underline hover:text-black">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline hover:text-black">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
