import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categoriesList = [
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
  const scrollRef = useRef(null);

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const scrollOffset = dir === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll categories left"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 -mt-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-neutral-200 hover:border-black shadow-md flex items-center justify-center text-neutral-700 hover:text-black z-20 transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Categories Track */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-6 sm:space-x-8 md:space-x-10 overflow-x-auto no-scrollbar scroll-smooth px-8 sm:px-10"
        >
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none select-none text-center"
            >
              {/* Circular Bubble */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white border border-neutral-200/80 group-hover:border-neutral-900 transition-all duration-300 shadow-sm group-hover:shadow-md mb-2.5 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80';
                  }}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110 bg-neutral-100"
                />
              </div>

              {/* Title Text Underneath */}
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs sm:text-[13px] font-semibold text-neutral-800 group-hover:text-black transition-colors capitalize">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll categories right"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 -mt-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-neutral-200 hover:border-black shadow-md flex items-center justify-center text-neutral-700 hover:text-black z-20 transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default CategoryBubbles;
