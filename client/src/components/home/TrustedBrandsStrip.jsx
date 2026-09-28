import React from 'react';

const brands = [
  { name: 'NIKE', fontClass: 'font-black tracking-tighter' },
  { name: 'ZARA', fontClass: 'font-serif tracking-widest' },
  { name: 'adidas', fontClass: 'font-bold tracking-tight lowercase' },
  { name: 'FOSSIL', fontClass: 'font-mono font-bold tracking-widest' },
  { name: 'PUMA', fontClass: 'font-black tracking-wider uppercase' },
  { name: 'CASIO', fontClass: 'font-sans font-extrabold tracking-widest' },
];

const TrustedBrandsStrip = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 text-center">
      {/* Eyebrow Header with Refined Divider Lines */}
      <div className="flex items-center justify-center space-x-4 mb-8 sm:mb-10">
        <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-r from-transparent to-neutral-200" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
          Trusted by 10,000+ Verified Customers
        </span>
        <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-l from-transparent to-neutral-200" />
      </div>

      {/* Brand Logos / Wordmarks Row */}
      <div className="flex items-center justify-center flex-wrap gap-8 sm:gap-14 lg:gap-20 text-neutral-800">
        {brands.map((brand) => (
          <span
            key={brand.name}
            className={`text-xl sm:text-2xl lg:text-3xl text-neutral-600 hover:text-neutral-950 opacity-70 hover:opacity-100 transition-all duration-300 select-none cursor-default hover:scale-105 ${brand.fontClass}`}
          >
            {brand.name}
          </span>
        ))}
      </div>

      {/* Modern Carousel Indicator Dots */}
      <div className="flex items-center justify-center space-x-1.5 mt-8">
        <span className="w-6 h-1 rounded-full bg-neutral-900 transition-all" />
        <span className="w-2 h-1 rounded-full bg-neutral-300 transition-all" />
        <span className="w-2 h-1 rounded-full bg-neutral-300 transition-all" />
      </div>
    </section>
  );
};

export default TrustedBrandsStrip;
