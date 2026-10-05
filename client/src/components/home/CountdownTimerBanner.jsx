import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, ArrowRight, Copy, Check, Tag } from 'lucide-react';

const CountdownTimerBanner = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('AUTUMN30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#991B1B] via-[#C4301C] to-[#991B1B] text-white py-3.5 px-4 sm:px-6 relative overflow-hidden shadow-inner border-y border-red-900/40">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-black/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 relative z-10">
        {/* Left: Badge & Promotional Announcement with Fire Pulse & Text Shimmer */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 animate-fire-pulse shadow-sm">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            {/* Event Badge */}
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest bg-white text-[#C4301C] px-2.5 py-0.5 rounded-full shadow-sm">
                Limited Event
              </span>
              <span className="text-xs font-semibold text-amber-200 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>Ends Soon</span>
              </span>
            </div>

            {/* Main Headline */}
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight mt-1 sm:mt-0 flex items-center justify-center md:justify-start flex-wrap gap-1.5">
              <span>🔥 FLAT</span>
              <span className="animate-discount-pulse bg-amber-300 text-neutral-950 px-2 py-0.5 rounded-lg font-black text-sm sm:text-base tracking-wider uppercase shadow-sm">
                30% OFF
              </span>
              <span className="animate-text-shimmer font-black">
                ON EVERYTHING
              </span>
            </h3>
          </div>
        </div>

        {/* Right: Coupon Code & Direct Collection CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 active:scale-95 border border-dashed border-white/50 px-3.5 py-2 rounded-full text-xs font-mono font-bold transition-all shadow-sm"
            title="Click to copy coupon code"
          >
            <Tag className="w-3.5 h-3.5 text-amber-300" />
            <span>Code: <strong className="text-amber-200 font-extrabold tracking-wider">AUTUMN30</strong></span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-300 animate-in zoom-in" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>

          <Link
            to="/collection/special-offers"
            className="bg-white text-neutral-950 hover:bg-neutral-100 active:scale-95 px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerBanner;
