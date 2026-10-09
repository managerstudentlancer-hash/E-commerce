import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const defaultHeroSlide = {
  tag: 'NEW COLLECTION 2026',
  title: 'Elevate Your Everyday Style',
  subtitle: 'Discover premium quality products crafted for effortless comfort, modern silhouettes and timeless elegance.',
  image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85',
  buttonText: 'Shop Now',
  buttonLink: '/shop',
  secondaryText: 'View Collection',
  secondaryLink: '/collection/new-arrivals',
};

const ReferenceHero = ({ banners = [] }) => {
  const activeSlides = banners && banners.length > 0 ? banners : [defaultHeroSlide];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[current] || defaultHeroSlide;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#F5EFE7] via-[#EDE4D8] to-[#E6DACB] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#E8DEC8] min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] flex flex-col justify-between p-5 sm:p-10 lg:p-14 group">
        
        {/* Ambient Subtle Radial Glow in background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-amber-100/30 blur-2xl pointer-events-none" />

        {/* Background Editorial Fashion Image */}
        <div className="absolute right-0 bottom-0 top-0 w-full lg:w-[60%] pointer-events-none overflow-hidden">
          <img
            key={slide._id || slide.image || current}
            src={slide.image || defaultHeroSlide.image}
            alt={slide.title || 'Elevate Your Everyday Style'}
            className="w-full h-full object-cover object-right sm:object-top opacity-95 sm:opacity-90 lg:opacity-100 transition-all duration-[1200ms]"
            onError={(e) => {
              e.currentTarget.src = defaultHeroSlide.image;
            }}
          />
          {/* Responsive gradients: on mobile keep model image crisp & vivid while keeping text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#EDE4D8] via-[#EDE4D8]/60 to-transparent sm:hidden" />
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#F5EFE7] via-[#F5EFE7]/80 to-transparent lg:via-[#F5EFE7]/40" />
          <div className="hidden sm:block lg:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EDE4D8]/80 to-transparent" />
        </div>

          {/* Floating Luxury Editorial Hotspot Tag on Model */}
          <div className="hidden lg:flex items-center space-x-2 absolute top-[38%] right-[32%] z-20 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/90 animate-fade-in pointer-events-auto cursor-pointer hover:bg-white transition-all hover:scale-105 group/tag">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <span className="text-[11px] font-bold text-neutral-900 tracking-tight">
              Artisanal Linen Set
            </span>
            <span className="text-[10px] font-semibold text-neutral-500">
              • $189
            </span>
          </div>

        {/* Carousel Arrow Controls (if multiple slides exist) */}
        {activeSlides.length > 1 && (
          <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center space-x-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs transition-transform active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs transition-transform active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top/Left Content Block */}
        <div className="relative z-10 max-w-xl space-y-4 sm:space-y-6 animate-fade-in" key={current}>
          {/* Small Collection Pill Tag with Micro Sparkle */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-800">
              {slide.tag || 'NEW COLLECTION 2026'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.65rem] font-extrabold text-neutral-950 tracking-tight leading-[1.1]">
            {slide.title && slide.title !== defaultHeroSlide.title ? (
              slide.title
            ) : (
              <>
                Elevate Your <span className="font-serif italic font-normal text-amber-950/85">Everyday</span> Style
              </>
            )}
          </h1>

          {/* Supporting Text */}
          <p className="text-neutral-600 text-xs sm:text-sm md:text-base font-normal max-w-md leading-relaxed">
            {slide.subtitle || 'Discover premium quality products crafted for effortless comfort, modern silhouettes and timeless elegance.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
            <Link
              to={slide.buttonLink || '/shop'}
              className="group/btn inline-flex items-center justify-center space-x-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-950/20 active:scale-95 text-center"
            >
              <span>{slide.buttonText || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={slide.secondaryLink || '/collection/new-arrivals'}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/80 hover:bg-white text-neutral-900 font-semibold text-xs sm:text-sm tracking-wide border border-neutral-300/80 transition-all duration-300 active:scale-95 shadow-xs hover:shadow-md text-center"
            >
              {slide.secondaryText || 'View Collection'}
            </Link>
          </div>
        </div>

        {/* Bottom Floating Service Trust Card with Glassmorphism */}
        <div className="relative z-10 mt-6 sm:mt-12 grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-6 bg-white/90 backdrop-blur-xl px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/90 w-full sm:w-auto sm:max-w-fit">
          <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left space-y-1 sm:space-y-0 sm:space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 flex-shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-neutral-900 leading-tight">Free Shipping</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5 leading-none hidden xs:block sm:block">Over $50</p>
            </div>
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-neutral-200" />

          <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left space-y-1 sm:space-y-0 sm:space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 flex-shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-neutral-900 leading-tight">Easy Returns</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5 leading-none hidden xs:block sm:block">30 days</p>
            </div>
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-neutral-200" />

          <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left space-y-1 sm:space-y-0 sm:space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-neutral-900 leading-tight">Secure Pay</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5 leading-none hidden xs:block sm:block">100% safe</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReferenceHero;
