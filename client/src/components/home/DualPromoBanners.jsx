import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const DualPromoBanners = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Banner 1 (Left): Summer Sale / Handbag */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#EFE8DF] via-[#ECE4DA] to-[#E3D7CB] p-5 sm:p-9 lg:p-10 min-h-[220px] sm:min-h-[290px] lg:min-h-[310px] flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-[#E4DACF] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#DACCC0] transition-all duration-500 group">
          
          {/* Subtle Ambient Light Spot */}
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />

          {/* Background & Podium Photo */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"
              alt="Summer Sale - Up to 50% Off"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Soft gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EFE8DF] via-[#EFE8DF]/40 to-transparent" />

            {/* Floating Tag on Product */}
            <div className="hidden sm:inline-flex items-center space-x-1.5 absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/70 text-[9px] font-semibold text-neutral-800 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Handcrafted Leather</span>
            </div>
          </div>

          {/* Left Text Block */}
          <div className="relative z-10 max-w-[220px] sm:max-w-[260px] space-y-2 sm:space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs shadow-2xs border border-white/80">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-900">
                SUMMER SALE
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Up to 50% <br />
              <span className="font-serif italic font-normal text-amber-950">Off Selected</span>
            </h3>

            <p className="text-xs text-neutral-600 font-medium pb-1">
              Curated luxury styles at exceptional prices.
            </p>

            <Link
              to="/collection/special-offers"
              className="group/btn inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wide hover:bg-neutral-800 active:scale-95 transition-all shadow-xs hover:shadow-md"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Banner 2 (Right): New Arrivals / Sunglasses */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#EAE2D7] via-[#E6DDD1] to-[#DED3C4] p-5 sm:p-9 lg:p-10 min-h-[220px] sm:min-h-[290px] lg:min-h-[310px] flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-[#E4DACF] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#DACCC0] transition-all duration-500 group">
          
          {/* Subtle Ambient Light Spot */}
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />

          {/* Background & Podium Photo */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85"
              alt="Discover The Latest Trends"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Soft gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EAE2D7] via-[#EAE2D7]/40 to-transparent" />

            {/* Floating Tag on Product */}
            <div className="hidden sm:inline-flex items-center space-x-1.5 absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/70 text-[9px] font-semibold text-neutral-800 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Polarized UV400</span>
            </div>
          </div>

          {/* Left Text Block */}
          <div className="relative z-10 max-w-[220px] sm:max-w-[260px] space-y-2 sm:space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs shadow-2xs border border-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-900">
                NEW ARRIVALS 2026
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
              Discover The <br />
              <span className="font-serif italic font-normal text-amber-950">Latest Trends</span>
            </h3>

            <p className="text-xs text-neutral-600 font-medium pb-1">
              Fresh seasonal drops from top European designers.
            </p>

            <div className="pt-1">
              <Link
                to="/collection/new-arrivals"
                className="group/btn inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wide hover:bg-neutral-800 active:scale-95 transition-all shadow-xs hover:shadow-md"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DualPromoBanners;
