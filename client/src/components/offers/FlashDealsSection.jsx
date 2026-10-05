import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const FlashDealsSection = ({ data = [], onFlashDealClaimed }) => {
  const { addToCart } = useCart();
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (!data || data.length === 0) return;
    const initial = {};
    data.forEach((deal) => {
      initial[deal._id || deal.id] = (deal.endsInMinutes || 60) * 60;
    });
    setTimers(initial);

    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] > 0) {
            next[k] -= 1;
          } else {
            next[k] = 3600;
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const formatTime = (totalSeconds = 0) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleGrabDeal = (deal) => {
    addToCart({
      id: deal._id || deal.id,
      _id: deal._id || deal.id,
      name: deal.title || deal.name,
      price: deal.discountedPrice || deal.dealPrice,
      image: deal.image,
      variant: deal.category,
      slug: 'flash-deal',
    });
    if (onFlashDealClaimed) {
      onFlashDealClaimed(`Claimed Flash Deal for "${deal.title || deal.name}"!`);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <section id="flash-deals" className="mb-10 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mb-1">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            <span>Rush Hour Discounts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            Limited-Time Deals
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Flash pricing expiring at the strike of the clock. Grab before current batch runs out.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center space-x-1.5 text-[11px] font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
          <Clock className="w-3 h-3" />
          <span>FLASH ACTIVE</span>
        </div>
      </div>

      {/* Compact Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {data.map((deal) => {
          const dealId = deal._id || deal.id;
          const unitsSold = deal.unitsSold || 15;
          const unitsTotal = deal.unitsTotal || 20;
          const percentClaimed = Math.round((unitsSold / unitsTotal) * 100);
          const secondsRemaining = timers[dealId] || (deal.endsInMinutes || 60) * 60;
          const dealPrice = deal.discountedPrice || deal.dealPrice || 999;
          const origPrice = deal.originalPrice || 1999;
          const discountLabel = deal.discountText || deal.discount || `${deal.discountPercent || 40}% OFF`;

          return (
            <div
              key={dealId}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Thumbnail & Badges */}
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title || deal.name}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />

                {/* Top Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider shadow-xs">
                    {discountLabel}
                  </span>
                </div>

                {/* Timer Overlay */}
                <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between px-2 py-1 rounded-lg bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-mono border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-neutral-400">ENDS</span>
                  <span className="font-black text-rose-400">{formatTime(secondsRemaining)}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate block">
                    {deal.category}
                  </span>
                  <h3 className="text-xs font-bold text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-rose-600 transition-colors">
                    {deal.title || deal.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline space-x-1.5 mt-1.5">
                    <span className="text-sm font-black text-neutral-900">
                      ₹{dealPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-400 line-through">
                      ₹{origPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] font-semibold text-neutral-500 mb-0.5">
                      <span>{unitsSold}/{unitsTotal} Sold</span>
                      <span className="text-rose-600 font-bold">{percentClaimed}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grab Deal Button */}
                <button
                  type="button"
                  onClick={() => handleGrabDeal(deal)}
                  className="w-full mt-3 flex items-center justify-center space-x-1 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-bold text-[11px] transition-colors shadow-2xs active:scale-95"
                >
                  <ShoppingBag className="w-3 h-3 text-amber-300" />
                  <span>Grab Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FlashDealsSection;
