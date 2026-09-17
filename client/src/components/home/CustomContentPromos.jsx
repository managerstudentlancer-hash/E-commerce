import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

/**
 * 1:1 Shaporoo custom_content_HPgFTK
 * Feature Image Card with Embedded Product Callout
 */
export const CustomProductSpotlight = () => {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 min-h-[380px] sm:min-h-[440px] flex items-end p-6 sm:p-10 group shadow-md">
          {/* Background Image with zoom-out-sm */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
            alt="VEXIVO Atelier Capsule"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
            <div className="max-w-xl text-white space-y-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>LIMITED EDITORIAL DROP</span>
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
                Savile Row Woolens & French Linen Silhouettes
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2">
                Designed in Mayfair and tailored from certified European organic fibres with heirloom reverse pleating.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link
                to="/collection/bestsellers"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Shop The Edit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * 1:1 Shaporoo custom_content_JxRy7x
 * Two-Column Split Media Promotion Cards (e.g. Bags & Footwear)
 */
export const CustomDualBanners = () => {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1: Tuscan Leather Goods */}
          <Link
            to="/category/bags"
            className="group relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/9] lg:aspect-[21/9] min-h-[220px] bg-neutral-900 flex items-end p-6 shadow-sm border border-neutral-100"
          >
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"
              alt="Purses & Handbags"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80';
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between w-full text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 block mb-1">
                  NEW SEASON
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Purses & Leather Totes
                </h4>
              </div>

              <span className="inline-flex items-center space-x-1 px-4 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider shadow-md group-hover:bg-[#C4301C] group-hover:text-white transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Italian Minimalist Footwear */}
          <Link
            to="/category/shoes"
            className="group relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/9] lg:aspect-[21/9] min-h-[220px] bg-neutral-900 flex items-end p-6 shadow-sm border border-neutral-100"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Footwear"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80';
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between w-full text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 block mb-1">
                  LIMITED DROP
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Minimalist Italian Runners
                </h4>
              </div>

              <span className="inline-flex items-center space-x-1 px-4 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider shadow-md group-hover:bg-[#C4301C] group-hover:text-white transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};
