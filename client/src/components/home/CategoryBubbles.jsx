import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowIcon } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const CategoryBubbles = () => {
  const { categories } = useCategories();
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
          {categories.map((cat) => (
            <Link
              key={cat.slug || cat.name}
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
                {cat.hasArrow && (
                  <span className="text-neutral-500 text-xs font-bold font-mono">
                    &gt;
                  </span>
                )}
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

