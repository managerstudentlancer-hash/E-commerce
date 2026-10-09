import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';

const defaultGradients = [
  'from-amber-900/90 via-rose-950/80 to-neutral-900/95',
  'from-neutral-900/95 via-purple-950/80 to-slate-900/90',
  'from-rose-950/90 via-pink-950/70 to-neutral-900/95',
  'from-amber-950/90 via-yellow-950/80 to-neutral-950/95',
];

const ExclusiveOffersSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="exclusive-offers" className="mb-10 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mb-1">
            <Crown className="w-3 h-3" />
            <span>Curated Luxury Edits</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            Exclusive Offers
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Capsule discounts across Ethnic Couture, Western Runway, Makeup, and Handcrafted Jewelry.
          </p>
        </div>

        <Link
          to="/shop"
          className="mt-2 sm:mt-0 inline-flex items-center text-xs font-bold text-neutral-900 hover:text-purple-700 transition-colors group"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Compact Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {data.map((offer, idx) => {
          const bgGrad = defaultGradients[idx % defaultGradients.length];

          return (
            <div
              key={offer._id || offer.id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 text-white min-h-[220px] sm:min-h-[250px] flex flex-col justify-between p-4 sm:p-5 shadow-2xs hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image with Dark Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106 opacity-75"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${bgGrad} transition-opacity duration-300 group-hover:opacity-95`} />
              </div>

              {/* Top Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  {offer.category}
                </span>
                {offer.badge && (
                  <span className="text-[9px] font-bold text-white bg-rose-600 px-2 py-0.2 rounded-full shadow-xs">
                    {offer.badge}
                  </span>
                )}
              </div>

              {/* Bottom Content & CTA */}
              <div className="relative z-10 space-y-1.5 pt-6">
                <div className="inline-block text-[11px] font-black text-rose-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-rose-300/20">
                  {offer.discountText || offer.offerText || 'Special Edit'}
                </div>

                <h3 className="text-sm sm:text-base font-black text-white font-sans tracking-tight line-clamp-1">
                  {offer.title}
                </h3>

                <p className="text-[11px] text-neutral-300 line-clamp-1 leading-snug">
                  {offer.subtitle}
                </p>

                <div className="pt-1.5">
                  <Link
                    to={offer.link || '/shop'}
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-[11px] tracking-wide transition-all shadow-sm active:scale-95"
                  >
                    <span>Shop Edit</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExclusiveOffersSection;
