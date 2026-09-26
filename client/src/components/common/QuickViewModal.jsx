import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Check, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.thumbnail || product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'];

  const inWishlist = isInWishlist(product._id || product.id);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-neutral-600 hover:text-black flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
              <img
                src={images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block">
                {product.category}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-snug">
                {product.name}
              </h3>

              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-neutral-600 font-semibold">
                  (Verified Collection)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-xl font-extrabold text-[#C4301C]">
                  ₹{product.price?.toFixed(2)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-neutral-600 line-through">
                    ₹{product.compareAtPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {product.description || 'Authentic luxury lifestyle essential crafted with bespoke tailoring and premium finish. In stock and ready for Pan-India express dispatch.'}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1.5 bg-neutral-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-600 hover:text-black text-sm font-bold px-2"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-2 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-neutral-600 hover:text-black text-sm font-bold px-2"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs text-neutral-600 hover:text-black font-semibold flex items-center space-x-1"
                >
                  <span>View full product details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`text-xs font-semibold flex items-center space-x-1 ${inWishlist ? 'text-red-600' : 'text-neutral-600 hover:text-black'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Wishlisted' : 'Save to Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickViewModal;
