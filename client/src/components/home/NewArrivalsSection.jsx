import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const newArrivalItems = [
  {
    _id: 'na-1',
    name: 'Cotton T-Shirt Classic Crewneck Casual',
    slug: 'the-savile-row-oxford-cotton-button-down',
    price: 34.00,
    compareAtPrice: 48.00,
    discount: 29,
    rating: 4.8,
    numReviews: 42,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    category: "Men Wear",
    categorySlug: 'men-wear',
  },
  {
    _id: 'na-2',
    name: 'French Floral Lantern Sleeve Midi Dress',
    slug: 'french-floral-lantern-sleeve-midi-dress',
    price: 95.00,
    compareAtPrice: 135.00,
    discount: 30,
    rating: 5.0,
    numReviews: 38,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    category: "Women Wear",
    categorySlug: 'women-wear',
  },
  {
    _id: 'na-3',
    name: 'Pleated Georgette Tiered Maxi Dress',
    slug: 'pleated-georgette-tiered-maxi-dress',
    price: 88.00,
    compareAtPrice: 120.00,
    discount: 26,
    rating: 4.9,
    numReviews: 29,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    category: 'Women Wear',
    categorySlug: 'women-wear',
  },
  {
    _id: 'na-4',
    name: 'Double-Breasted Wool Atelier Blazer',
    slug: 'double-breasted-wool-atelier-blazer',
    price: 185.00,
    compareAtPrice: 245.00,
    discount: 24,
    rating: 4.9,
    numReviews: 53,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80',
    category: "Women Wear",
    categorySlug: 'women-wear',
  },
  {
    _id: 'na-5',
    name: 'Structured Boiled Shetland Wool Coat',
    slug: 'structured-boiled-shetland-wool-coat',
    price: 195.00,
    compareAtPrice: 260.00,
    discount: 25,
    rating: 5.0,
    numReviews: 21,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    category: 'Women Wear',
    categorySlug: 'women-wear',
  },
  {
    _id: 'na-6',
    name: 'Italian Nappa Leather Low-Top Minimalist Sneaker',
    slug: 'italian-nappa-leather-low-top-minimalist-sneaker',
    price: 130.00,
    compareAtPrice: 175.00,
    discount: 25,
    rating: 4.8,
    numReviews: 34,
    newArrival: true,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    category: 'Shoes',
    categorySlug: 'shoes',
  },
];

const NewArrivalsSection = ({ products = [] }) => {
  const scrollRef = useRef(null);
  const items = products && products.length > 0 ? products.slice(0, 8) : newArrivalItems;

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const scrollOffset = dir === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shaporoo 1:1 New Arrivals Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-widest text-[#C4301C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUST LANDED AT VEXIVO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
              New <strong className="font-extrabold text-[#C4301C]">Arrivals</strong>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md font-medium">
              Fresh silhouettes and seasonal drops freshly tailored and imported to our UK warehouse.
            </p>
          </div>

          {/* Right Controls & Link */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <Link
              to="/collection/new-arrivals"
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#C4301C] transition-colors py-2 px-4 rounded-full border border-neutral-200 hover:border-[#C4301C]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={() => handleScroll('left')}
                aria-label="Previous new arrivals"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-700 hover:text-black flex items-center justify-center transition-all active:scale-95 shadow-sm hover:bg-neutral-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                aria-label="Next new arrivals"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-700 hover:text-black flex items-center justify-center transition-all active:scale-95 shadow-sm hover:bg-neutral-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Row / Grid */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6"
        >
          {items.slice(0, 4).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
