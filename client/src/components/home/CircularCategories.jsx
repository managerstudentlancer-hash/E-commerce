import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryFallback } from '../../utils/imageHelper';

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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4 group/section">
      {/* Category Scroll Controls (Desktop Floating Pill Arrows) */}
      <div className="absolute top-1/2 -left-1 sm:left-2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md border border-neutral-200/80 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-1 sm:right-2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md border border-neutral-200/80 active:scale-95 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Circles Row */}
      <div
        ref={scrollRef}
        className="flex items-center justify-start lg:justify-between gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-2 scroll-smooth"
      >
        {referenceCategories.map((cat) => {
          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center group flex-shrink-0 min-w-[85px] sm:min-w-[105px]"
            >
              {/* Circular Avatar Stage with Luxury Glow */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-white border border-neutral-200/70 shadow-xs group-hover:shadow-[0_8px_25px_rgba(217,119,6,0.18)] group-hover:ring-4 group-hover:ring-amber-500/20 group-hover:border-amber-600/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F6F3EE]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryFallback(cat.name, cat.slug);
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
                <span className="block text-[10px] sm:text-xs text-neutral-400 font-medium mt-0.5">
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
