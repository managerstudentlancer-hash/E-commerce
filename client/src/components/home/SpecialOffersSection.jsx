import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const SpecialOffersSection = ({ products = [] }) => {
  const offerProducts = products.length > 0 ? products.slice(0, 8) : [];

  if (offerProducts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shaporoo 1:1 Special Offers Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-widest text-[#C4301C] mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>LIMITED PROMOTION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Special <strong className="font-extrabold text-[#C4301C]">Offers</strong>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-md font-medium">
              Curated luxury pieces with limited-time reductions of up to 40% off.
            </p>
          </div>

          <Link
            to="/collection/special-offers"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#C4301C] transition-colors py-2 px-4 rounded-full border border-neutral-200 hover:border-[#C4301C] self-start sm:self-auto"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {offerProducts.map((product, idx) => (
            <ProductCard key={product._id || product.id || idx} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;