import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    tag: 'NEW SEASON ARRIVAL',
    title: 'Wide Leg Pants',
    subtitle: 'Timeless tailored silhouettes cut from breathable organic cotton and linen.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    buttonText: 'Explore',
    buttonLink: '/category/women-wear',
  },
  {
    id: 2,
    tag: 'AUTUMN CAPSULE',
    title: 'Off Shoulder Velvet Suit',
    subtitle: 'Sculpted evening wear with deep velvet luster and precision Italian seams.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    buttonText: 'Discover',
    buttonLink: '/category/women-wear',
  },
  {
    id: 3,
    tag: 'FLAGSHIP WELLNESS',
    title: 'Health & Fitness Gear',
    subtitle: 'Precision resistance training and athletic studio equipment.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85',
    buttonText: 'Shop Fitness',
    buttonLink: '/category/health-fitness',
  },
];

const sideCards = [
  {
    id: 'side-1',
    tag: 'CO-ORD SETS',
    title: 'Casual Suit Sets',
    subtitle: 'Contemporary double-breasted blazer and pleat-front trousers.',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    buttonText: 'Shop Suits',
  },
  {
    id: 'side-2',
    tag: 'FLORAL ATELIER',
    title: 'French-Style Linen Dresses',
    subtitle: 'Romantic lantern sleeves with delicate floral heritage embroidery.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    buttonText: 'Explore Dresses',
  },
];

const HeroBanner = ({ banners, sideCards: customSideCards }) => {
  const slides = banners && banners.length > 0 ? banners : heroSlides;
  const activeSideCards = customSideCards && customSideCards.length > 0 ? customSideCards : sideCards;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="w-full bg-[#FAF9FD] py-3 sm:py-5 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shaporoo 1:1 multicolumn-slider (Left Carousel + Right Stacked Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* Left Column: 7-8 Cols on Desktop — Hero Carousel */}
          <div
            className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden bg-neutral-900 group min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] shadow-sm flex flex-col justify-end"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slides.map((slide, index) => {
              const isActive = index === current;
              return (
                <div
                  key={slide._id || slide.id || index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Image with zoom-out-sm */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';
                    }}
                    className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] [transition-timing-function:cubic-bezier(0,0,0.3,1)] ${
                      isActive ? 'scale-100' : 'scale-105'
                    }`}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                  {/* Slide Content with staggered fade-up */}
                  <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-end">
                    <div className="max-w-xl text-white">
                      {/* Tag */}
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white mb-3">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{slide.tag || 'SEASONAL HIGHLIGHT'}</span>
                      </span>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2.5 font-sans leading-tight">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-neutral-200 mb-6 font-medium line-clamp-2 max-w-md leading-relaxed">
                        {slide.subtitle || slide.description}
                      </p>

                      {/* Pill Button */}
                      <Link
                        to={slide.buttonLink || '/shop'}
                        className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-neutral-100 hover:scale-105 active:scale-95 shadow-md"
                      >
                        <span>{slide.buttonText || 'Explore'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Floating Hover Navigation Arrows (FoxTheme: appears on group hover) */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Expanding Pill Pagination (FoxTheme Hyper Style) */}
            <div className="absolute bottom-4 right-6 z-20 flex items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: 4-5 Cols on Desktop — 2 Stacked Multicolumn Cards */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:gap-5">
            {activeSideCards.map((card) => (
              <div
                key={card._id || card.id}
                className="group relative flex-1 min-h-[200px] sm:min-h-[240px] rounded-3xl overflow-hidden bg-neutral-900 shadow-sm flex flex-col justify-end p-6"
              >
                {/* Image with smooth 0.85s material scale */}
                <img
                  src={card.image}
                  alt={card.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                    {card.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mb-3.5 line-clamp-1">
                    {card.subtitle}
                  </p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/95 text-black font-bold text-[11px] uppercase tracking-wider transition-all duration-200 hover:bg-white active:scale-95"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
