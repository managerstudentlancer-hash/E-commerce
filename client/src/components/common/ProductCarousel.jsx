import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products = [], title, subtitle, viewAllLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full my-12">
      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between mb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div>
          {subtitle && (
            <span className="text-xs font-bold tracking-widest text-[#C4301C] uppercase block mb-1">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {title}
            </h2>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black mr-3 underline-offset-4 hover:underline"
            >
              View All
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            aria-label="Previous products"
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:border-black hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next products"
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:border-black hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex space-x-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 pt-1 no-scrollbar scroll-smooth max-w-7xl mx-auto"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="flex-none w-[260px] sm:w-[280px] md:w-[300px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
