import React, { useRef, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryFallback } from '../../utils/imageHelper';
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
  const scrollRef = useRef(null);
  const set1Ref = useRef(null);
  const set2Ref = useRef(null);
  const set3Ref = useRef(null);
  const isAdjusting = useRef(false);
  const { categories: dbCategories } = useCategories();

  const categories = useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories
        .filter((c) => c.status !== 'inactive')
        .map((c, idx) => {
          const refMatch = referenceCategories.find(
            (r) => r.slug === c.slug || r.name.toLowerCase() === c.name.toLowerCase()
          );
          return {
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            count: refMatch?.count || `${60 + ((idx * 13) % 140)}+ Items`,
            tag: refMatch?.tag || (idx === 0 ? 'Popular' : idx === 1 ? 'Trending' : null),
            image: c.image || refMatch?.image || getCategoryFallback(c.name, c.slug),
          };
        });
    }
    return referenceCategories;
  }, [dbCategories]);

  // Center scroll position at Set 2 on mount & resize
  useEffect(() => {
    const centerAtMiddleSet = () => {
      if (scrollRef.current && set1Ref.current && set2Ref.current) {
        const offset = set2Ref.current.offsetLeft - set1Ref.current.offsetLeft;
        if (offset > 0) {
          scrollRef.current.scrollLeft = set2Ref.current.offsetLeft;
        }
      }
    };

    const timer1 = setTimeout(centerAtMiddleSet, 30);
    const timer2 = setTimeout(centerAtMiddleSet, 250);
    window.addEventListener('resize', centerAtMiddleSet);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', centerAtMiddleSet);
    };
  }, [categories]);

  // Infinite Scroll Handler: Silently wraps when entering Set 1 or Set 3
  const handleScroll = () => {
    if (!scrollRef.current || !set1Ref.current || !set2Ref.current || !set3Ref.current) return;
    if (isAdjusting.current) return;

    const el = scrollRef.current;
    const setDistance = set2Ref.current.offsetLeft - set1Ref.current.offsetLeft;
    if (setDistance <= 0) return;

    // Approaching start (Set 1 boundary) -> silently shift forward into middle set (Set 2)
    if (el.scrollLeft <= 15) {
      isAdjusting.current = true;
      el.scrollLeft += setDistance;
      setTimeout(() => {
        isAdjusting.current = false;
      }, 30);
    }
    // Approaching end (Set 3 boundary) -> silently shift backward into middle set (Set 2)
    else if (el.scrollLeft >= set3Ref.current.offsetLeft - 15) {
      isAdjusting.current = true;
      el.scrollLeft -= setDistance;
      setTimeout(() => {
        isAdjusting.current = false;
      }, 30);
    }
  };

  // Button-triggered Smooth Loop Navigation
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth > 640 ? 320 : 190;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? step : -step,
      behavior: 'smooth',
    });
  };

  const renderCategoryItem = (cat, key) => (
    <Link
      key={key}
      to={`/category/${cat.slug}`}
      className="flex flex-col items-center group flex-shrink-0 w-[72px] sm:w-[98px] lg:w-[110px] select-none"
    >
      {/* Circular Avatar Stage with Luxury Glow */}
      <div className="relative w-[62px] h-[62px] sm:w-24 sm:h-24 lg:w-28 lg:h-28 aspect-square rounded-full overflow-hidden p-0.5 sm:p-1 bg-white border border-neutral-200/90 shadow-xs group-hover:shadow-[0_8px_25px_rgba(217,119,6,0.2)] group-hover:ring-4 group-hover:ring-amber-500/20 group-hover:border-amber-600/40 group-hover:scale-105 transition-all duration-300">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#F6F3EE] aspect-square">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover object-center rounded-full aspect-square group-hover:scale-115 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = getCategoryFallback(cat.name, cat.slug);
            }}
          />
        </div>

        {/* Optional Micro Tag */}
        {cat.tag && (
          <span className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wider bg-neutral-900 text-white shadow-xs whitespace-nowrap">
            {cat.tag}
          </span>
        )}
      </div>

      {/* Title & Item Count */}
      <div className="text-center mt-1.5 sm:mt-2.5 w-full px-0.5">
        <span className="block text-[11px] sm:text-sm font-bold text-neutral-900 group-hover:text-amber-800 tracking-tight transition-colors truncate">
          {cat.name}
        </span>
        <span className="block text-[9px] sm:text-xs text-neutral-400 font-medium mt-0.5 truncate">
          {cat.count}
        </span>
      </div>
    </Link>
  );

  return (
    <section className="relative w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-2 sm:pb-4 group/section overflow-hidden">
      {/* Category Scroll Controls: Loop buttons on both desktop and mobile */}
      <div className="absolute top-[38%] left-0 sm:left-2 -translate-y-1/2 z-20 flex">
        <button
          onClick={() => scroll('left')}
          aria-label="Previous Category (Loop)"
          title="Scroll Left (Infinite Loop)"
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md border border-neutral-200/90 active:scale-90 transition-all hover:scale-105 backdrop-blur-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="absolute top-[38%] right-0 sm:right-2 -translate-y-1/2 z-20 flex">
        <button
          onClick={() => scroll('right')}
          aria-label="Next Category (Loop)"
          title="Scroll Right (Infinite Loop)"
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md border border-neutral-200/90 active:scale-90 transition-all hover:scale-105 backdrop-blur-xs"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Infinite Circular Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-2 touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div ref={set1Ref} className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {categories.map((cat, idx) => renderCategoryItem(cat, `set1-${cat.slug}-${idx}`))}
        </div>
        <div ref={set2Ref} className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {categories.map((cat, idx) => renderCategoryItem(cat, `set2-${cat.slug}-${idx}`))}
        </div>
        <div ref={set3Ref} className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {categories.map((cat, idx) => renderCategoryItem(cat, `set3-${cat.slug}-${idx}`))}
        </div>
      </div>
    </section>
  );
};

export default CircularCategories;
