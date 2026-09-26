import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Scale, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCompareDrawer = ({ compareList = [], onRemove, onClear, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-[#FAF9FD]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-neutral-900">
                Compare Products ({compareList.length}/4)
              </h3>
              <p className="text-xs text-neutral-600">
                Side-by-side specifications and features
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClear}
              className="text-xs text-neutral-600 hover:text-red-600 font-semibold transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              aria-label="Close compare drawer"
              className="w-9 h-9 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="p-6 overflow-x-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-w-[500px]">
            {compareList.map((item) => (
              <div
                key={item._id || item.id}
                className="flex flex-col justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(item._id || item.id)}
                  aria-label="Remove item"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white text-neutral-600 hover:text-red-600 shadow-sm flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Product Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-white">
                  <img
                    src={item.thumbnail || item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Category */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                    {item.category}
                  </span>
                  <Link
                    to={`/product/${item.slug}`}
                    className="text-xs font-bold text-neutral-900 hover:text-black line-clamp-2 mt-0.5"
                  >
                    {item.name}
                  </Link>
                </div>

                {/* Pricing */}
                <div>
                  <span className="text-sm font-extrabold text-[#C4301C]">
                    ₹{item.price?.toFixed(2)}
                  </span>
                  {item.compareAtPrice > item.price && (
                    <span className="text-xs text-neutral-600 line-through ml-1.5">
                      ₹{item.compareAtPrice?.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(item, 1)}
                  className="w-full py-2 px-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCompareDrawer;
