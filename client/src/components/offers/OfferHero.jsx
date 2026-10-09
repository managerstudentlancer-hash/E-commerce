import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Flame, ShieldCheck, Tag, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfferHero = ({ onScrollToSection, featuredOffer }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  const heroImage =
    featuredOffer?.image ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const heroTitle = featuredOffer?.title || 'Pure Banarasi Silk Saree';
  const heroBadge = featuredOffer?.badge || 'Top Pick';
  const heroDiscount =
    featuredOffer?.discountText ||
    (featuredOffer?.discountPercent ? `${featuredOffer.discountPercent}% OFF` : '40% OFF');
  const heroDealPrice = featuredOffer?.discountedPrice || 2999;
  const heroOrigPrice = featuredOffer?.originalPrice || 4999;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-[#1C1618] to-neutral-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 mb-8 shadow-2xl border border-white/10">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Info */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-bold">Festive &amp; Royal Wardrobe Specials</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Curated Offers &amp; <br />
            <span className="bg-gradient-to-r from-rose-300 via-amber-200 to-rose-200 bg-clip-text text-transparent">
              Luxury Gift Cards
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
            Discover today's handpicked deals on Banarasi &amp; Kanjivaram silk sarees, festive ethnic lehengas, runaway western fits, and instant digital gift vouchers.
          </p>

          {/* Quick Stat Pill Highlights */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <Tag className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-neutral-200">Up to 50% OFF Sarees</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <Gift className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-neutral-200">Instant Gift Card Delivery</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-neutral-200">100% Authentic Handlooms</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onScrollToSection('saree-deals')}
              className="btn-pill-yellow text-xs sm:text-sm font-bold shadow-lg hover:shadow-amber-400/20 px-6 py-3"
            >
              <span>Explore Saree Deals</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </button>
            <button
              onClick={() => onScrollToSection('gift-cards')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <Gift className="w-4 h-4 mr-2 inline-block text-rose-300" />
              Buy Gift Card
            </button>
          </div>
        </div>

        {/* Right Live Flash Deal Box */}
        <div className="lg:col-span-5">
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Flame className="w-4 h-4 fill-rose-400 text-rose-400 animate-bounce" />
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-rose-300">
                  Lightning Flash Deals
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 mr-0.5" />
                <span>ENDS IN</span>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {formatDigit(timeLeft.hours)}
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Hours</div>
              </div>
              <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {formatDigit(timeLeft.minutes)}
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Mins</div>
              </div>
              <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-300">
                  {formatDigit(timeLeft.seconds)}
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Secs</div>
              </div>
            </div>

            {/* Featured Flash Saree Teaser */}
            <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-2xl border border-white/5">
              <img
                src={heroImage}
                alt={heroTitle}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-300 uppercase">{heroBadge}</span>
                  <span className="text-xs font-black text-emerald-400">{heroDiscount}</span>
                </div>
                <h2 className="text-xs font-bold text-white truncate">{heroTitle}</h2>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-extrabold text-white">
                    ₹{heroDealPrice.toLocaleString('en-IN')}
                  </span>
                  {heroOrigPrice > 0 && (
                    <span className="text-[11px] text-neutral-400 line-through">
                      ₹{heroOrigPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onScrollToSection('flash-deals')}
              className="w-full mt-4 py-2.5 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs tracking-wide transition-all shadow-md active:scale-98"
            >
              View All Flash Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferHero;
