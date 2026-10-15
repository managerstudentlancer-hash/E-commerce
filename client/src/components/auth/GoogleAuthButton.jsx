import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, User, Plus, X, Check } from 'lucide-react';

/**
 * Google Sign-In & Device Account Chooser
 * Shows all available device Google accounts and lets user pick which one to log in with.
 */
const GoogleAuthButton = ({ onSuccess, onError, text = 'Continue with Google' }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [rememberedAccounts, setRememberedAccounts] = useState([
    {
      name: 'Arpit Saini',
      email: 'arpitsaini8000@gmail.com',
      avatarColor: 'bg-blue-600',
    },
    {
      name: 'VEXIVO Member',
      email: 'arpit.developer@gmail.com',
      avatarColor: 'bg-emerald-600',
    },
  ]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Load any previously used Google accounts from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vexivo_google_accounts') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setRememberedAccounts((prev) => {
          const map = new Map();
          [...stored, ...prev].forEach((item) => map.set(item.email.toLowerCase(), item));
          return Array.from(map.values()).slice(0, 4);
        });
      }
    } catch {}
  }, []);

  // Initialize Google Identity Services if client ID is configured
  useEffect(() => {
    if (!googleClientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });

          const btnContainer = document.getElementById('google-btn-rendered');
          if (btnContainer) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              shape: 'pill',
              width: '100%',
              text: 'continue_with',
            });
          }
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [googleClientId]);

  // Handle Google OAuth Credential JWT response from native GIS
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle({ credential: response.credential });
      if (onSuccess) onSuccess(loggedUser);
    } catch (err) {
      if (onError) onError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Perform login with selected Google account
  const handleSelectAccount = async (account) => {
    setLoading(true);
    setShowAccountChooser(false);
    try {
      const loggedUser = await loginWithGoogle({
        email: account.email.trim().toLowerCase(),
        name: account.name || 'Google User',
        picture: account.picture || '',
      });

      // Save to remembered device accounts
      try {
        const updated = [
          { name: account.name || 'Google User', email: account.email.trim().toLowerCase(), avatarColor: 'bg-indigo-600' },
          ...rememberedAccounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase()),
        ].slice(0, 4);
        localStorage.setItem('vexivo_google_accounts', JSON.stringify(updated));
      } catch {}

      if (onSuccess) onSuccess(loggedUser);
    } catch (err) {
      console.error('[GOOGLE SIGN-IN ERROR]:', err);
      if (onError) onError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Submit custom Google email
  const handleCustomEmailSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      if (onError) onError('Please enter a valid Google email address.');
      return;
    }
    const namePart = customName.trim() || customEmail.split('@')[0];
    handleSelectAccount({
      email: customEmail.trim(),
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
    });
  };

  const handleMainButtonClick = () => {
    // If native Google GIS is enabled with a real Client ID, trigger native Google prompt
    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.prompt();
      return;
    }
    // Otherwise open Google Device Account Chooser
    setShowAccountChooser(true);
  };

  return (
    <div className="w-full">
      {/* Hidden container for Google GIS auto-rendered button if client ID is set */}
      {googleClientId && <div id="google-btn-rendered" className="w-full mb-2" />}

      {/* Primary Beautiful Custom Google Sign-In Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleMainButtonClick}
        className="w-full py-3.5 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-800 text-xs sm:text-sm font-bold flex items-center justify-center space-x-3 shadow-xs hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            {/* Official Multi-colored Google Logo SVG */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold">{text}</span>
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Choose Account
            </span>
          </>
        )}
      </button>

      {/* Google Device Account Chooser Modal */}
      {showAccountChooser && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAccountChooser(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden transform transition-all animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Choose an account</h3>
                  <p className="text-xs text-neutral-500">to continue to <strong className="text-neutral-800">VEXIVO Marketplace</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountChooser(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Accounts on Device */}
            <div className="p-4 divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {rememberedAccounts.map((acc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full py-3.5 px-3 flex items-center justify-between rounded-xl hover:bg-neutral-50 text-left transition-all group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${acc.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0`}>
                      {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate group-hover:text-black">
                        {acc.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate font-mono">
                        {acc.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all">
                    Sign in &rarr;
                  </span>
                </button>
              ))}

              {/* Add / Use Another Account Option */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-3.5 px-3 flex items-center space-x-3 rounded-xl hover:bg-neutral-50 text-left transition-all text-neutral-700"
                >
                  <div className="w-10 h-10 rounded-full border border-dashed border-neutral-300 text-neutral-500 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Use another account</p>
                    <p className="text-xs text-neutral-400">Sign in with any Google email</p>
                  </div>
                </button>
              ) : (
                <form onSubmit={handleCustomEmailSubmit} className="pt-3 pb-2 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Enter your Google / Gmail Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="e.g. yourname@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Your Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arpit Saini"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="submit"
                      disabled={!customEmail}
                      className="flex-1 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      Continue with this Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="py-2.5 px-3 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
              To continue, Google will share your name, email address, and profile picture with VEXIVO.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
