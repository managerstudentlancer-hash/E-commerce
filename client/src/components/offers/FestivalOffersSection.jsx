import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, ArrowRight, Gift } from 'lucide-react';

const FestivalOffersSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="festival-offers" className="mb-10 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
            <Flame className="w-3 h-3 text-amber-600" />
            <span>Grand Festive Celebrations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            Festival &amp; Wedding Specials
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Handcrafted bridal wear, festive saree hampers, and limited-edition celebratory savings.
          </p>
        </div>

        <Link
          to="/shop"
          className="mt-2 sm:mt-0 inline-flex items-center text-xs font-bold text-neutral-900 hover:text-amber-700 transition-colors group"
        >
          <span>Explore Festive</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid of Compact Festival Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((fest) => (
          <div
            key={fest._id || fest.id}
            className="group relative overflow-hidden rounded-2xl bg-neutral-950 text-white border border-neutral-800 shadow-lg flex flex-col justify-between"
          >
            {/* Background Image Banner */}
            <div className="relative aspect-[16/7] overflow-hidden">
              <img
                src={fest.image}
                alt={fest.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

              {/* Top Accent Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 shadow-2xs">
                  {fest.badge || 'GOLD EDITION'}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {fest.season || 'Festive Gala'}
                </span>
              </div>
            </div>

            {/* Content & Offers Details */}
            <div className="p-4 sm:p-5 relative z-10 -mt-6 space-y-2 bg-gradient-to-b from-transparent via-neutral-950 to-neutral-950">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-white font-sans tracking-tight line-clamp-1">
                  {fest.title}
                </h3>
                <span className="text-sm font-black text-amber-300 whitespace-nowrap ml-2">
                  {fest.discountText || 'UP TO 50% OFF'}
                </span>
              </div>

              <p className="text-[11px] text-neutral-300 leading-snug line-clamp-1">
                {fest.subtitle || fest.description}
              </p>

              {/* CTA & Validity */}
              <div className="pt-1.5 flex items-center justify-between">
                <Link
                  to={fest.link || fest.ctaLink || '/shop'}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[11px] tracking-wide transition-all shadow-sm active:scale-95"
                >
                  <span>Explore Edit</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <span className="text-[10px] text-neutral-400 font-medium">
                  {fest.validity || 'Limited Period'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FestivalOffersSection;
