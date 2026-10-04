import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const referenceCategories = [
  {
    name: 'Men',
    slug: 'men-wear',
    count: '120+ Items',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Women',
    slug: 'women-wear',
    count: '150+ Items',
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    count: '200+ Items',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bags',
    slug: 'bags',
    count: '80+ Items',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Watches',
    slug: 'jewellery',
    count: '60+ Items',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Accessories',
    slug: 'vision-care',
    count: '100+ Items',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Kids',
    slug: 'kids-wear',
    count: '95+ Items',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    count: '75+ Items',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    count: '85+ Items',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Living',
    slug: 'home-living',
    count: '110+ Items',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
  },
];

const CircularCategories = () => {
  const { categories: apiCategories } = useCategories();
  const scrollRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);
  const animationFrameIdRef = useRef(null);

  // Use active categories from admin/backend if available, otherwise referenceCategories fallback
  const activeCategories = (apiCategories && apiCategories.length > 0)
    ? apiCategories
        .filter((c) => c.status !== 'inactive')
        .map((c) => ({
          name: c.name,
          slug: c.slug,
          count: `${c.itemCount || c.liveCount || 100}+ Items`,
          image: c.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
          tag: c.sortOrder === 1 ? 'Trending' : c.sortOrder === 2 ? 'Popular' : undefined,
        }))
    : referenceCategories;

  // Tripled list for seamless infinite loop scrolling
  const loopCategories = [
    ...activeCategories,
    ...activeCategories,
    ...activeCategories,
  ];
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Set initial scroll position to the middle set for seamless bidirectional scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const singleSetWidth = container.scrollWidth / 3;
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth;
      }
    }
  }, []);

  // Smooth continuous auto-scroll loop (from Right to Left, i.e. scrollLeft increases)
  useEffect(() => {
    let lastTimestamp = null;
    const speed = 0.65; // pixels per frame - slow, elegant, and continuous

    const step = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const container = scrollRef.current;

      if (container && !isHoveredRef.current && !isDraggingRef.current && !isPointerDownRef.current) {
        container.scrollLeft += speed;

        const singleSetWidth = container.scrollWidth / 3;
        if (singleSetWidth > 0) {
          // Seamless loop check
          if (container.scrollLeft >= singleSetWidth * 2) {
            container.scrollLeft -= singleSetWidth;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft += singleSetWidth;
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(step);
    };

    animationFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Manual Arrow Scroll
  const handleManualScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary left mouse button
    isPointerDownRef.current = true;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = scrollRef.current ? scrollRef.current.scrollLeft : 0;
    hasMovedRef.current = false;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;
    const dx = e.pageX - startXRef.current;
    if (Math.abs(dx) > 4) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsDraggingState(true);
      }
      hasMovedRef.current = true;
    }
    if (isDraggingRef.current) {
      scrollRef.current.scrollLeft = scrollLeftStartRef.current - dx;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPointerDownRef.current = false;
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      // Brief timeout to prevent immediate click navigation upon dragging release
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 80);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle Link Click to ensure dragging does not trigger navigation
  const handleItemClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 group/section select-none">
      {/* Subtle Left Fade Gradient */}
      <div className="absolute left-4 sm:left-6 lg:left-8 top-0 bottom-0 w-8 sm:w-16 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Subtle Right Fade Gradient */}
      <div className="absolute right-4 sm:right-6 lg:right-8 top-0 bottom-0 w-8 sm:w-16 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Left Scroll Navigation Button */}
      <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => handleManualScroll('left')}
          aria-label="Scroll categories left"
          type="button"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 flex items-center justify-center shadow-lg border border-neutral-200/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
        </button>
      </div>

      {/* Right Scroll Navigation Button */}
      <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => handleManualScroll('right')}
          aria-label="Scroll categories right"
          type="button"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 flex items-center justify-center shadow-lg border border-neutral-200/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
        </button>
      </div>

      {/* Reels-style Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onTouchStart={() => {
          isPointerDownRef.current = true;
        }}
        onTouchEnd={() => {
          isPointerDownRef.current = false;
        }}
        className={`flex items-center gap-4 sm:gap-6 md:gap-7 overflow-x-auto no-scrollbar py-2.5 ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        } touch-pan-x`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {loopCategories.map((cat, index) => {
          return (
            <Link
              key={`${cat.slug}-${index}`}
              to={`/category/${cat.slug}`}
              onClick={handleItemClick}
              draggable={false}
              className="flex flex-col items-center group flex-shrink-0 w-[82px] sm:w-[104px] md:w-[115px] select-none"
            >
              {/* Circular Avatar Stage with Luxury Glow */}
              <div className="relative w-20 h-20 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full overflow-hidden p-1 bg-white border border-neutral-200/70 shadow-xs group-hover:shadow-[0_8px_25px_rgba(217,119,6,0.18)] group-hover:ring-4 group-hover:ring-amber-500/20 group-hover:border-amber-600/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F6F3EE]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    draggable={false}
                    className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ease-out pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                {/* Optional Micro Tag */}
                {cat.tag && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-neutral-900 text-white shadow-xs">
                    {cat.tag}
                  </span>
                )}
              </div>

              {/* Title & Item Count */}
              <div className="text-center mt-2.5">
                <span className="block text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-amber-800 tracking-tight transition-colors">
                  {cat.name}
                </span>
                <span className="block text-[10px] sm:text-xs text-neutral-400 font-medium mt-0.5 whitespace-nowrap">
                  {cat.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CircularCategories;
