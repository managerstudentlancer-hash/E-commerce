import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

const CountdownTimerBanner = () => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 3, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('AUTUMN30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#C4301C] text-white py-4 px-4 sm:px-6 relative overflow-hidden shadow-inner">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-black/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Title & Badge */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 animate-pulse">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white text-[#C4301C] px-2 py-0.5 rounded-full shadow-sm">
                Limited Event
              </span>
              <span className="text-xs font-medium text-amber-200 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ends Soon</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
              🔥 FLAT 30% OFF ON EVERYTHING! 🎃
            </h3>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Clock className="w-4 h-4 text-amber-300 hidden sm:inline" />
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-2.5 py-1.5 min-w-[48px] sm:min-w-[54px] border border-white/10">
              <span className="block text-base sm:text-lg font-mono font-extrabold leading-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-300">Days</span>
            </div>
            <span className="text-amber-300 font-bold text-lg">:</span>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-2.5 py-1.5 min-w-[48px] sm:min-w-[54px] border border-white/10">
              <span className="block text-base sm:text-lg font-mono font-extrabold leading-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-300">Hours</span>
            </div>
            <span className="text-amber-300 font-bold text-lg">:</span>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-2.5 py-1.5 min-w-[48px] sm:min-w-[54px] border border-white/10">
              <span className="block text-base sm:text-lg font-mono font-extrabold leading-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-300">Mins</span>
            </div>
            <span className="text-amber-300 font-bold text-lg">:</span>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-2.5 py-1.5 min-w-[48px] sm:min-w-[54px] border border-white/10">
              <span className="block text-base sm:text-lg font-mono font-extrabold leading-tight text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-300">Secs</span>
            </div>
          </div>
        </div>

        {/* Coupon Code & Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-dashed border-white/40 px-3.5 py-2 rounded-full text-xs font-mono font-bold transition-all"
            title="Click to copy code"
          >
            <span>Code: <strong>AUTUMN30</strong></span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>

          <Link
            to="/shop?discount=30"
            className="bg-white text-black hover:bg-neutral-100 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerBanner;
