import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin');
    }
  }, [user, redirectTarget, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role !== 'admin') {
        // Non-admin account tried to log in through admin portal
        setError('Access Denied: This account does not possess administrator privileges. Regular customer and seller accounts must sign in through the customer login portal.');
        return;
      }
      navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (adminEmail, adminPassword) => {
    setEmail(adminEmail);
    setPassword(adminPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Ambient Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return to Store Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800 backdrop-blur-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 border border-neutral-700/80 shadow-2xl mb-4 text-[#C4301C] ring-4 ring-red-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-red-950/70 border border-red-800/40 text-[10px] font-extrabold uppercase tracking-widest text-red-400 mb-2">
            <span>RESTRICTED ACCESS PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            VEXIVO <span className="text-[#C4301C]">Admin</span> Control
          </h1>
          <p className="mt-1.5 text-xs text-neutral-400 max-w-sm mx-auto">
            Authorized administrative personnel only. Credentials are authenticated with cryptographic role verification.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-start space-x-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold leading-relaxed">{error}</p>
                {error.includes('Regular customer') && (
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-1 font-bold text-white underline hover:text-red-300 mt-2 text-xs"
                  >
                    <span>Go to Customer / Seller Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
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
                  autoFocus
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vexivo.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Admin Master Password
                </label>
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
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-neutral-500 hover:text-white p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span>Maintain administrative session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C4301C] hover:from-red-500 hover:to-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-600/30 active:scale-98 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate to Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Dedicated 1-Click Admin Demo Fill */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                1-Click Administrator Fill:
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@vexivo.com', 'AdminPass123!')}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-red-400" />
              <span>admin@vexivo.com (AdminPass123!)</span>
            </button>
          </div>
        </div>

        {/* Security Notice Footer */}
        <div className="mt-6 text-center text-[11px] text-neutral-500 space-y-2">
          <p>
            Are you a customer or marketplace seller?{' '}
            <Link to="/login" className="text-neutral-300 font-bold hover:text-white underline">
              Sign in at User Login
            </Link>
          </p>
          <p className="text-[10px] text-neutral-600">
            VEXIVO Security System • IP Logging &amp; Session Protection Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
