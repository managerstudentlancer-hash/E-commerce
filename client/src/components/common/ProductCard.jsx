import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RatingStars from './RatingStars';
import QuickViewModal from './QuickViewModal';

const getCategoryAnimationClass = (category = '', categorySlug = '') => {
  const cat = `${category} ${categorySlug}`.toLowerCase();
  if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('sneaker')) return 'product-card-shoes';
  if (cat.includes('electr') || cat.includes('audio') || cat.includes('gadget') || cat.includes('phone')) return 'product-card-electronics';
  if (cat.includes('jewel') || cat.includes('ring') || cat.includes('earring') || cat.includes('necklace') || cat.includes('bracelet')) return 'product-card-jewellery';
  if (cat.includes('bag') || cat.includes('backpack') || cat.includes('wallet') || cat.includes('tote')) return 'product-card-bags';
  if (cat.includes('hat') || cat.includes('cap') || cat.includes('beanie')) return 'product-card-hats';
  if (cat.includes('vision') || cat.includes('glass') || cat.includes('eyewear') || cat.includes('opt')) return 'product-card-vision';
  if (cat.includes('pet') || cat.includes('dog') || cat.includes('cat')) return 'product-card-pets';
  if (cat.includes('toy') || cat.includes('game') || cat.includes('puzzle')) return 'product-card-toys';
  if (cat.includes('health') || cat.includes('fitness') || cat.includes('yoga') || cat.includes('gym')) return 'product-card-health';
  if (cat.includes('home') || cat.includes('living') || cat.includes('decor') || cat.includes('furniture')) return 'product-card-home';
  if (cat.includes('beauty') || cat.includes('skin') || cat.includes('cosmetic')) return 'product-card-beauty';
  if (cat.includes('kid') || cat.includes('baby') || cat.includes('child')) return 'product-card-kids';
  if (cat.includes('men-') || cat.includes('men wear') || cat.includes("men's")) return 'product-card-men';
  if (cat.includes('women') || cat.includes('dress') || cat.includes("women's")) return 'product-card-women';
  return 'product-card-fashion';
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const categoryAnimClass = getCategoryAnimationClass(product.category, product.categorySlug);

  const fallbackImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';

  const primaryImage =
    product.thumbnail ||
    (product.images && product.images[0]) ||
    product.image ||
    fallbackImg;

  const secondaryImage =
    product.hoverImage ||
    (product.images && product.images.length > 1 && product.images[1]) ||
    product.secondaryImage ||
    null;

  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [secondSrc, setSecondSrc] = useState(secondaryImage);
  const [hasSecondError, setHasSecondError] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setImgSrc(primaryImage);
    setSecondSrc(secondaryImage);
    setHasSecondError(false);
  }, [primaryImage, secondaryImage]);

  const hasSecondImage = Boolean(secondSrc && secondSrc !== imgSrc && !hasSecondError);

  const inWishlist = isInWishlist(product._id || product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-100 ${categoryAnimClass}`}>
      {/* Product Image Stage */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full pt-[115%] sm:pt-[120%] overflow-hidden bg-[#F2F2F4]"
      >
        {/* Primary Image */}
        <img
          src={imgSrc}
          alt={product.name || 'Product Image'}
          loading="lazy"
          onError={() => setImgSrc(fallbackImg)}
          className={`product-primary-img absolute inset-0 w-full h-full object-cover object-center transition-all duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
            hasSecondImage
              ? 'group-hover:opacity-0'
              : 'group-hover:scale-[1.08]'
          }`}
        />

        {/* Secondary Image (1:1 Shaporoo scale3d(1.08) -> scale3d(1) reveal) */}
        {hasSecondImage && (
          <img
            src={secondSrc}
            alt={`${product.name} alternate`}
            loading="lazy"
            onError={() => setHasSecondError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 scale-[1.08] group-hover:opacity-100 group-hover:scale-100 transition-all duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
          />
        )}

        {/* Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="badge-sale shadow-sm">-{product.discount}%</span>
          )}
          {product.newArrival && (
            <span className="badge-new shadow-sm">NEW</span>
          )}
          {product.bestseller && !product.newArrival && (
            <span className="badge-hot shadow-sm">POPULAR</span>
          )}
        </div>

        {/* Action Buttons Column (Top Right) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 flex flex-col gap-1.5 md:opacity-0 md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-700 hover:text-red-600 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
              }`}
            />
          </button>

          {/* Quick View Button (FoxTheme Eye Icon) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(true);
            }}
            aria-label="Quick View"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </button>
        </div>

        {/* Quick Add Bar (FoxTheme: slides up from bottom with cubic-bezier 0.54s) */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[540ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hidden md:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
              added
                ? 'bg-[#0D8756] text-white'
                : 'bg-black text-white hover:bg-neutral-800 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand / Vendor Label */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            {product.brand || product.category || 'VEXIVO'}
          </span>

          <Link to={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm sm:text-base font-extrabold text-neutral-950">
              ₹{Number(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>

          <RatingStars rating={product.rating || 4.9} numReviews={product.numReviews} showText={false} />
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-2.5 md:hidden">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 rounded-full text-xs font-bold bg-neutral-100 text-neutral-900 active:bg-black active:text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{added ? 'Added!' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
};

export default ProductCard;
