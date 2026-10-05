import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const defaultLeftBanners = [
  {
    id: 'left-1',
    tag: 'AUTUMN ATELIER',
    tagDotColor: 'bg-stone-700',
    titleLine1: 'Bespoke Italian',
    titleLine2: 'Outerwear',
    description: 'Pure cashmere coats and masterfully tailored silhouettes.',
    ctaText: 'Explore Suiting',
    ctaLink: '/category/men-wear',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    productBadge: 'Pure Cashmere Blend',
    badgeDotColor: 'bg-stone-700',
    bgGradient: 'from-[#F0EAE1] via-[#EAE1D6] to-[#DFD4C5]',
  },
  {
    id: 'left-2',
    tag: 'SUMMER SALE',
    tagDotColor: 'bg-amber-500',
    titleLine1: 'Up to 50%',
    titleLine2: 'Off Selected',
    description: 'Curated luxury styles at exceptional prices.',
    ctaText: 'Shop Now',
    ctaLink: '/collection/special-offers',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    productBadge: 'Handcrafted Leather',
    badgeDotColor: 'bg-amber-500',
    bgGradient: 'from-[#EFE8DF] via-[#ECE4DA] to-[#E3D7CB]',
  },
  {
    id: 'left-3',
    tag: 'LIMITED EDITION',
    tagDotColor: 'bg-amber-600',
    titleLine1: 'Timeless Prestige',
    titleLine2: 'Chronographs',
    description: 'Masterpiece automatic movements engineered for elegance.',
    ctaText: 'Discover Watches',
    ctaLink: '/category/jewellery',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    productBadge: 'Swiss Automatic 50M',
    badgeDotColor: 'bg-amber-600',
    bgGradient: 'from-[#EDE6DC] via-[#E8DFD3] to-[#DFD3C4]',
  },
];

const defaultRightBanners = [
  {
    id: 'right-1',
    tag: 'RESORT COLLECTION',
    tagDotColor: 'bg-amber-700',
    titleLine1: 'Effortless Silk',
    titleLine2: 'Eveningwear',
    description: 'Lightweight mulberry silks designed for sunset soirees.',
    ctaText: 'View Lookbook',
    ctaLink: '/category/women-wear',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    productBadge: '100% Mulberry Silk',
    badgeDotColor: 'bg-amber-700',
    bgGradient: 'from-[#EEE5DB] via-[#E9DFD4] to-[#DFD2C4]',
  },
  {
    id: 'right-2',
    tag: 'NEW ARRIVALS 2026',
    tagDotColor: 'bg-emerald-500',
    titleLine1: 'Discover The',
    titleLine2: 'Latest Trends',
    description: 'Fresh seasonal drops from top European designers.',
    ctaText: 'Explore Now',
    ctaLink: '/collection/new-arrivals',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    productBadge: 'Polarized UV400',
    badgeDotColor: 'bg-emerald-500',
    bgGradient: 'from-[#EAE2D7] via-[#E6DDD1] to-[#DED3C4]',
  },
  {
    id: 'right-3',
    tag: 'CLEAN BEAUTY',
    tagDotColor: 'bg-rose-500',
    titleLine1: 'Enchanting Elixirs',
    titleLine2: '& Fragrance',
    description: 'Rare botanical notes bottled by master French perfumers.',
    ctaText: 'Shop Fragrance',
    ctaLink: '/category/beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    productBadge: 'French Botanical Distillate',
    badgeDotColor: 'bg-rose-500',
    bgGradient: 'from-[#EFE5DC] via-[#EAE0D6] to-[#DFCFC3]',
  },
];

const ROTATION_INTERVAL = 10000; // 10 seconds

// Split title into two lines for luxury editorial typography
const formatDualTitle = (title) => {
  if (!title) return { line1: '', line2: '' };
  if (title.includes('\n')) {
    const parts = title.split('\n');
    return { line1: parts[0], line2: parts.slice(1).join(' ') };
  }
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return { line1: words[0], line2: '' };
  if (words.length === 2) return { line1: words[0], line2: words[1] };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
};

const DualPromoBanners = () => {
  const [leftItems, setLeftItems] = useState(defaultLeftBanners);
  const [rightItems, setRightItems] = useState(defaultRightBanners);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const fetchLiveDualBanners = async () => {
    try {
      const res = await api.banners.getActive();
      if (res.success && Array.isArray(res.banners)) {
        const liveLeft = res.banners.filter((b) => b.position === 'dual-left');
        const liveRight = res.banners.filter((b) => b.position === 'dual-right');

        if (liveLeft.length > 0) {
          setLeftItems(
            liveLeft.map((item, idx) => {
              const { line1, line2 } = formatDualTitle(item.title);
              return {
                id: item._id || `left-${idx}`,
                tag: item.tag || item.highlight || 'EXCLUSIVE',
                tagDotColor: 'bg-amber-600',
                titleLine1: line1,
                titleLine2: line2,
                description: item.subtitle || '',
                ctaText: item.buttonText || 'Shop Now',
                ctaLink: item.buttonLink || '/shop',
                image: item.image,
                fallbackImage:
                  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
                productBadge: item.productBadge || '',
                badgeDotColor: 'bg-stone-700',
                bgGradient: 'from-[#F0EAE1] via-[#EAE1D6] to-[#DFD4C5]',
              };
            })
          );
        }

        if (liveRight.length > 0) {
          setRightItems(
            liveRight.map((item, idx) => {
              const { line1, line2 } = formatDualTitle(item.title);
              return {
                id: item._id || `right-${idx}`,
                tag: item.tag || item.highlight || 'FEATURED',
                tagDotColor: 'bg-rose-500',
                titleLine1: line1,
                titleLine2: line2,
                description: item.subtitle || '',
                ctaText: item.buttonText || 'Explore Now',
                ctaLink: item.buttonLink || '/shop',
                image: item.image,
                fallbackImage:
                  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85',
                productBadge: item.productBadge || '',
                badgeDotColor: 'bg-rose-500',
                bgGradient: 'from-[#EEE5DB] via-[#E9DFD4] to-[#DFD2C4]',
              };
            })
          );
        }
      }
    } catch (err) {
      console.warn('Could not fetch live dual banners, using fallback:', err);
    }
  };

  useEffect(() => {
    fetchLiveDualBanners();

    // Auto-refresh when admin modifies banners and focuses storefront
    const handleFocus = () => fetchLiveDualBanners();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Safe Index constraints
  const safeLeftIndex = leftItems.length > 0 ? leftIndex % leftItems.length : 0;
  const safeRightIndex = rightItems.length > 0 ? rightIndex % rightItems.length : 0;

  // 10-Second Automatic Rotation for Left Banner
  useEffect(() => {
    if (isLeftHovered || leftItems.length <= 1) return;
    const timer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % leftItems.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [isLeftHovered, leftItems.length]);

  // 10-Second Automatic Rotation for Right Banner
  useEffect(() => {
    if (isRightHovered || rightItems.length <= 1) return;
    const timer = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rightItems.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [isRightHovered, rightItems.length]);

  const currentLeft = leftItems[safeLeftIndex] || defaultLeftBanners[0];
  const currentRight = rightItems[safeRightIndex] || defaultRightBanners[0];

  const handlePrevLeft = (e) => {
    e.stopPropagation();
    setLeftIndex((prev) => (prev - 1 + leftItems.length) % leftItems.length);
  };

  const handleNextLeft = (e) => {
    e.stopPropagation();
    setLeftIndex((prev) => (prev + 1) % leftItems.length);
  };

  const handlePrevRight = (e) => {
    e.stopPropagation();
    setRightIndex((prev) => (prev - 1 + rightItems.length) % rightItems.length);
  };

  const handleNextRight = (e) => {
    e.stopPropagation();
    setRightIndex((prev) => (prev + 1) % rightItems.length);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Banner 1 (Left Card) with Auto-Rotating Branding Items */}
        <div
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentLeft.bgGradient || 'from-[#EFE8DF] via-[#ECE4DA] to-[#E3D7CB]'} p-5 sm:p-9 lg:p-10 min-h-[220px] sm:min-h-[290px] lg:min-h-[310px] flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-[#E4DACF] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#DACCC0] transition-all duration-700 group`}
        >
          {/* Subtle Ambient Light Spot */}
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />

          {/* Background & Podium Photo with smooth transition */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] pointer-events-none overflow-hidden">
            <img
              key={`left-img-${currentLeft.id}`}
              src={currentLeft.image}
              alt={`${currentLeft.titleLine1} ${currentLeft.titleLine2}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 animate-banner-slide"
              onError={(e) => {
                e.currentTarget.src = currentLeft.fallbackImage;
              }}
            />
            {/* Soft gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EFE8DF] via-[#EFE8DF]/40 to-transparent" />

            {/* Floating Tag on Product */}
            {currentLeft.productBadge && (
              <div
                key={`left-badge-${currentLeft.id}`}
                className="hidden sm:inline-flex items-center space-x-1.5 absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-[9px] font-semibold text-neutral-800 shadow-xs animate-banner-slide"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentLeft.badgeDotColor || 'bg-stone-700'}`} />
                <span>{currentLeft.productBadge}</span>
              </div>
            )}
          </div>

          {/* Left Text Block */}
          <div
            key={`left-text-${currentLeft.id}`}
            className="relative z-10 max-w-[220px] sm:max-w-[260px] space-y-2 sm:space-y-3 animate-banner-slide"
          >
            {/* Badge */}
            {currentLeft.tag && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs shadow-2xs border border-white/80 transition-all duration-500">
                <span className={`w-1.5 h-1.5 rounded-full ${currentLeft.tagDotColor || 'bg-stone-700'}`} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-900">
                  {currentLeft.tag}
                </span>
              </div>
            )}

            {/* Dynamic Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              {currentLeft.titleLine1} <br />
              {currentLeft.titleLine2 && (
                <span className="font-serif italic font-normal text-amber-950">
                  {currentLeft.titleLine2}
                </span>
              )}
            </h3>

            {/* Description */}
            {currentLeft.description && (
              <p className="text-xs text-neutral-600 font-medium pb-1 line-clamp-2">
                {currentLeft.description}
              </p>
            )}

            {/* Action Button & Slide Progress Controls */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                to={currentLeft.ctaLink}
                className="group/btn inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wide hover:bg-neutral-800 active:scale-95 transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>{currentLeft.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Manual Arrow Controls (Desktop Hover) */}
          {leftItems.length > 1 && (
            <>
              <button
                onClick={handlePrevLeft}
                aria-label="Previous brand item"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-neutral-200/60 z-20 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextLeft}
                aria-label="Next brand item"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-neutral-200/60 z-20 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* 10-Second Animated Progress Bar Indicators at Bottom */}
          {leftItems.length > 1 && (
            <div className="absolute bottom-3 left-7 sm:left-9 flex items-center space-x-1.5 z-20">
              {leftItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLeftIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`relative h-1.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                    idx === safeLeftIndex
                      ? 'w-8 bg-neutral-900/25'
                      : 'w-1.5 bg-neutral-400/50 hover:bg-neutral-600'
                  }`}
                >
                  {idx === safeLeftIndex && (
                    <span
                      key={`left-progress-${safeLeftIndex}-${isLeftHovered}`}
                      className={`absolute inset-0 bg-neutral-900 rounded-full ${
                        isLeftHovered ? 'w-full' : 'animate-banner-progress'
                      }`}
                      style={{
                        animationPlayState: isLeftHovered ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Banner 2 (Right Card) with Auto-Rotating Branding Items */}
        <div
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => setIsRightHovered(false)}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentRight.bgGradient || 'from-[#EAE2D7] via-[#E6DDD1] to-[#DED3C4]'} p-5 sm:p-9 lg:p-10 min-h-[220px] sm:min-h-[290px] lg:min-h-[310px] flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-[#E4DACF] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#DACCC0] transition-all duration-700 group`}
        >
          {/* Subtle Ambient Light Spot */}
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />

          {/* Background & Podium Photo with smooth transition */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] pointer-events-none overflow-hidden">
            <img
              key={`right-img-${currentRight.id}`}
              src={currentRight.image}
              alt={`${currentRight.titleLine1} ${currentRight.titleLine2}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 animate-banner-slide"
              onError={(e) => {
                e.currentTarget.src = currentRight.fallbackImage;
              }}
            />
            {/* Soft gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EAE2D7] via-[#EAE2D7]/40 to-transparent" />

            {/* Floating Tag on Product */}
            {currentRight.productBadge && (
              <div
                key={`right-badge-${currentRight.id}`}
                className="hidden sm:inline-flex items-center space-x-1.5 absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-[9px] font-semibold text-neutral-800 shadow-xs animate-banner-slide"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentRight.badgeDotColor || 'bg-rose-500'}`} />
                <span>{currentRight.productBadge}</span>
              </div>
            )}
          </div>

          {/* Left Text Block */}
          <div
            key={`right-text-${currentRight.id}`}
            className="relative z-10 max-w-[220px] sm:max-w-[260px] space-y-2 sm:space-y-3 animate-banner-slide"
          >
            {/* Badge */}
            {currentRight.tag && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs shadow-2xs border border-white/80 transition-all duration-500">
                <span className={`w-1.5 h-1.5 rounded-full ${currentRight.tagDotColor || 'bg-rose-500'}`} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-900">
                  {currentRight.tag}
                </span>
              </div>
            )}

            {/* Dynamic Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
              {currentRight.titleLine1} <br />
              {currentRight.titleLine2 && (
                <span className="font-serif italic font-normal text-amber-950">
                  {currentRight.titleLine2}
                </span>
              )}
            </h3>

            {/* Description */}
            {currentRight.description && (
              <p className="text-xs text-neutral-600 font-medium pb-1 line-clamp-2">
                {currentRight.description}
              </p>
            )}

            {/* Action Button & Slide Progress Controls */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                to={currentRight.ctaLink}
                className="group/btn inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wide hover:bg-neutral-800 active:scale-95 transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>{currentRight.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Manual Arrow Controls (Desktop Hover) */}
          {rightItems.length > 1 && (
            <>
              <button
                onClick={handlePrevRight}
                aria-label="Previous brand item"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-neutral-200/60 z-20 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextRight}
                aria-label="Next brand item"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-neutral-200/60 z-20 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* 10-Second Animated Progress Bar Indicators at Bottom */}
          {rightItems.length > 1 && (
            <div className="absolute bottom-3 left-7 sm:left-9 flex items-center space-x-1.5 z-20">
              {rightItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRightIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`relative h-1.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                    idx === safeRightIndex
                      ? 'w-8 bg-neutral-900/25'
                      : 'w-1.5 bg-neutral-400/50 hover:bg-neutral-600'
                  }`}
                >
                  {idx === safeRightIndex && (
                    <span
                      key={`right-progress-${safeRightIndex}-${isRightHovered}`}
                      className={`absolute inset-0 bg-neutral-900 rounded-full ${
                        isRightHovered ? 'w-full' : 'animate-banner-progress'
                      }`}
                      style={{
                        animationPlayState: isRightHovered ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default DualPromoBanners;
