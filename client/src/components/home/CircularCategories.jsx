import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
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

  // Ensure adequate items per track so there are never visible empty gaps on ultra-wide screens
  const trackItems = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    let items = [...categories];
    while (items.length < 10) {
      items = [...items, ...categories];
    }
    return items;
  }, [categories]);

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
      {/* Subtle edge fade overlays for premium luxury finish */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      {/* Continuous Reels-Style Infinite Moving Track (Right to Left) */}
      <div className="category-reel-wrapper relative w-full overflow-hidden py-2 select-none">
        <div className="flex w-max items-center">
          {/* Primary Track */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0 pr-3 sm:pr-6 animate-category-reel">
            {trackItems.map((cat, idx) => renderCategoryItem(cat, `track1-${cat.slug}-${idx}`))}
          </div>
          {/* Duplicate Seamless Loop Track */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0 pr-3 sm:pr-6 animate-category-reel" aria-hidden="true">
            {trackItems.map((cat, idx) => renderCategoryItem(cat, `track2-${cat.slug}-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularCategories;
