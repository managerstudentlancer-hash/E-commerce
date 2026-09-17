import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

const WelcomeDiscountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('vexivo_welcome_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('vexivo_welcome_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('VEX30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-300">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close welcome discount"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-neutral-600 hover:text-black flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Promotional Header Banner */}
        <div className="relative h-44 bg-neutral-900 overflow-hidden flex items-center justify-center text-center p-6">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
            alt="Welcome to VEXIVO"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

          <div className="relative z-10 text-white space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C4301C] text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md">
              <Gift className="w-3.5 h-3.5" />
              <span>LIMITED WELCOME GIFT</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              FLAT 30% OFF YOUR ORDER
            </h3>
            <p className="text-xs text-neutral-300">
              Valid on your entire first purchase across all collections
            </p>
          </div>
        </div>

        {/* Modal Content & Action */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Coupon Code Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 border-dashed">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                Use Discount Code
              </span>
              <span className="text-lg font-mono font-extrabold text-neutral-900 tracking-wider">
                VEX30
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Email Subscription Form */}
          {subscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <p className="text-sm font-bold text-emerald-800">
                🎉 Welcome to the VEXIVO Club!
              </p>
              <p className="text-xs text-emerald-600">
                Your 30% voucher has been activated and sent to your email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <p className="text-xs text-neutral-600 text-center font-medium">
                Subscribe for private capsule previews, priority restocks, and exclusive promo drops.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-full text-xs bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-[#C4301C] text-white hover:bg-[#b02917] text-xs font-bold uppercase tracking-wider flex items-center space-x-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Claim 30%</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Dismiss button */}
          <div className="text-center pt-1">
            <button
              onClick={handleClose}
              className="text-xs text-neutral-600 hover:text-black underline underline-offset-4"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeDiscountModal;
