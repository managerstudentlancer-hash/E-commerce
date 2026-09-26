import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const defaultCategoriesList = [
  {
    name: 'Women Wear',
    slug: 'women-wear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Men Wear',
    slug: 'men-wear',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Kids Wear',
    slug: 'kids-wear',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Bags',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Hats',
    slug: 'hats',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Vision Care',
    slug: 'vision-care',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Pets Care',
    slug: 'pets-care',
    image: 'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Toys',
    slug: 'toys',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80',
  },
];

const CategoryBubbles = () => {
  const { categories } = useCategories?.() || { categories: [] };
  const scrollRef = useRef(null);

  const displayList =
    categories && categories.length > 0 && categories.some((c) => c.image)
      ? categories
      : defaultCategoriesList;

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const offset = dir === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-6 border-b border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/nav">
        {/* Navigation Arrows */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-50 transition-all opacity-0 group-hover/nav:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-50 transition-all opacity-0 group-hover/nav:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bubbles Row */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-6 sm:space-x-8 md:space-x-10 overflow-x-auto no-scrollbar scroll-smooth px-8 sm:px-10"
        >
          {displayList.map((cat) => (
            <Link
              key={cat.slug || cat.name}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none select-none text-center"
            >
              {/* Bubble Circle with Hover Zoom */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-100 border-2 border-transparent group-hover:border-black transition-all duration-300 shadow-sm group-hover:shadow-md mb-2 flex items-center justify-center">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>

              {/* Title */}
              <div className="flex items-center space-x-0.5">
                <span className="text-xs sm:text-[13px] font-semibold text-neutral-800 group-hover:text-black transition-colors capitalize">
                  {cat.name}
                </span>
                {cat.hasArrow && (
                  <span className="text-neutral-500 text-xs font-bold font-mono">
                    &gt;
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBubbles;
