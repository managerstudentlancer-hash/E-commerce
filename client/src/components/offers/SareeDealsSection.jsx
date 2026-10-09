import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SareeDealsSection = ({ data = [], onOfferClaimed }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (saree, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: saree._id || saree.id,
      _id: saree._id || saree.id,
      name: saree.title,
      price: saree.discountedPrice,
      image: saree.image,
      variant: saree.fabric || 'Pure Silk',
      slug: saree.link ? saree.link.replace('/product/', '') : 'saree',
    });
    if (onOfferClaimed) {
      onOfferClaimed(`Added "${saree.title}" to your shopping bag!`);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <section id="saree-deals" className="mb-10 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Today's Saree Deals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            Today's Saree Deals
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Banarasi, Kanjivaram, Chanderi &amp; Organza silk drapes with exclusive direct discounts.
          </p>
        </div>

        <Link
          to="/category/women-wear"
          className="mt-2 sm:mt-0 inline-flex items-center text-xs font-bold text-neutral-900 hover:text-rose-600 transition-colors group"
        >
          <span>View All Sarees</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Compact Responsive Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {data.map((saree) => {
          const discountPercent =
            saree.discountPercent ||
            (saree.originalPrice && saree.discountedPrice
              ? Math.round(((saree.originalPrice - saree.discountedPrice) / saree.originalPrice) * 100)
              : 40);

          return (
            <div
              key={saree._id || saree.id}
              className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Compact Image Box */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={saree.image}
                  alt={saree.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Top Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  <span className="inline-block bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {discountPercent}% OFF
                  </span>
                  {saree.badge && (
                    <span className="hidden sm:inline-block bg-neutral-900/90 backdrop-blur-md text-amber-300 text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      {saree.badge}
                    </span>
                  )}
                </div>

                {/* Stock Tag */}
                {saree.inStock && saree.inStock <= 6 && (
                  <div className="absolute top-2 right-2 z-10 bg-amber-500/95 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                    {saree.inStock} left
                  </div>
                )}

                {/* Validity Pill */}
                {saree.validity && (
                  <div className="absolute bottom-2 left-2 right-2 z-10">
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md text-neutral-200 text-[9px] font-medium border border-white/10 truncate max-w-full">
                      <Clock className="w-2.5 h-2.5 text-amber-300 flex-shrink-0" />
                      <span className="truncate">{saree.validity}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span className="font-bold uppercase tracking-wider truncate">
                      {saree.fabric || saree.category || 'Pure Silk'}
                    </span>
                    <div className="flex items-center space-x-0.5 text-amber-500 font-bold flex-shrink-0">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{saree.rating || '4.9'}</span>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {saree.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1 leading-snug">
                    {saree.subtitle}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2.5 mt-2.5 border-t border-neutral-100">
                  <div className="flex items-baseline space-x-1.5 mb-2.5">
                    <span className="text-sm sm:text-base font-black text-neutral-900">
                      ₹{saree.discountedPrice?.toLocaleString('en-IN')}
                    </span>
                    {saree.originalPrice > 0 && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ₹{saree.originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Compact Buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(saree, e)}
                      className="py-1.5 px-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[10px] sm:text-[11px] transition-colors flex items-center justify-center space-x-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Bag</span>
                    </button>

                    <Link
                      to={saree.link || '/category/women-wear'}
                      className="py-1.5 px-2 rounded-xl bg-neutral-950 hover:bg-black text-white font-bold text-[10px] sm:text-[11px] text-center transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Shop</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SareeDealsSection;
