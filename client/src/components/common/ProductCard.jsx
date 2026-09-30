import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import QuickViewModal from './QuickViewModal';
import { getCategoryFallback, resolveImageUrl } from '../../utils/imageHelper';

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

const ProductCard = ({ product, index = 0, dealBadge = 'Big Billion Days Price', showSizes = true }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const categoryAnimClass = getCategoryAnimationClass(product.category, product.categorySlug);

  const fallbackImg = getCategoryFallback(product.category, product.categorySlug);

  const primaryImage =
    resolveImageUrl(product.thumbnail || (product.images && product.images[0]) || product.image, product.category, product.categorySlug) ||
    fallbackImg;

  const rawSecondary =
    product.hoverImage ||
    (product.images && product.images.length > 1 && product.images[1]) ||
    product.secondaryImage ||
    null;

  const secondaryImage = rawSecondary
    ? resolveImageUrl(rawSecondary, product.category, product.categorySlug)
    : null;

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

  // Pricing calculations matching Flipkart style
  const rawPrice = Number(product.price) || 0;
  let rawMrp = Number(product.compareAtPrice) || 0;
  let discountPercent = Number(product.discount) || 0;

  if (rawMrp <= rawPrice) {
    discountPercent = discountPercent > 0 ? discountPercent : (45 + ((index * 7) % 35));
    rawMrp = Math.round(rawPrice / (1 - discountPercent / 100));
  } else if (!discountPercent) {
    discountPercent = Math.round(((rawMrp - rawPrice) / rawMrp) * 100);
  }

  const displayPrice = Math.round(rawPrice);
  const displayMrp = Math.round(rawMrp);

  // Sizes generator according to category / product variants
  const getSizes = () => {
    if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes.join(', ');
    }
    const cat = `${product.category || ''} ${product.categorySlug || ''} ${product.subcategory || ''} ${product.name || ''}`.toLowerCase();
    if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('sneaker') || cat.includes('boot')) {
      return '6, 7, 8, 9, 10';
    }
    if (cat.includes('pant') || cat.includes('jean') || cat.includes('trouser') || cat.includes('denim') || cat.includes('bottom')) {
      return '28, 30, 32, 34';
    }
    if (cat.includes('shirt') || cat.includes('t-shirt') || cat.includes('dress') || cat.includes('wear') || cat.includes('hoodie') || cat.includes('jacket') || cat.includes('top')) {
      return 'S, M, L, XL, XXL';
    }
    if (cat.includes('bag') || cat.includes('pack') || cat.includes('luggage') || cat.includes('tote')) {
      return 'Free Size';
    }
    if (cat.includes('watch') || cat.includes('jewel')) {
      return 'Free Size';
    }
    return '28, 30, 32, 34';
  };

  const sizesText = getSizes();
  const isSponsored = product.featured || (index % 3 === 0);
  const brandName = (product.brand || product.category || 'VEXIVO').toUpperCase();

  return (
    <div className={`group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-200/70 hover:shadow-md transition-shadow duration-200 ${categoryAnimClass}`}>
      {/* Product Image Stage */}
      <div className="relative block w-full pt-[125%] overflow-hidden bg-[#F6F6F7]">
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 block w-full h-full"
        >
          {/* Primary Image */}
          <img
            src={imgSrc}
            alt={product.name || 'Product Image'}
            loading="lazy"
            onError={() => setImgSrc(fallbackImg)}
            className={`product-primary-img absolute inset-0 w-full h-full object-cover object-top transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
              hasSecondImage
                ? 'group-hover:opacity-0'
                : 'group-hover:scale-[1.04]'
            }`}
          />

          {/* Secondary Image */}
          {hasSecondImage && (
            <img
              src={secondSrc}
              alt={`${product.name} alternate`}
              loading="lazy"
              onError={() => setHasSecondError(true)}
              className="product-secondary-img absolute inset-0 w-full h-full object-cover object-top opacity-0 scale-[1.04] group-hover:opacity-100 group-hover:scale-100 transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
            />
          )}
        </Link>

        {/* Wishlist Heart Icon (Flipkart style solid grey heart in top right with touch-friendly hit area) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-white/80 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-90 shadow-xs sm:shadow-none"
        >
          <Heart
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-colors drop-shadow-xs ${
              inWishlist
                ? 'fill-red-500 text-red-500'
                : 'fill-[#c2c2c2] text-[#c2c2c2] hover:fill-[#9e9e9e]'
            }`}
          />
        </button>

        {/* Quick View Button (hover action, desktop only) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowQuickView(true);
          }}
          aria-label="Quick View"
          className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hidden sm:flex items-center justify-center text-neutral-600 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Quick Add Bar (slides up on hover, desktop only) */}
        <div className="absolute inset-x-2 bottom-2 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-1.5 px-3 rounded-md font-bold text-[11px] tracking-wide uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md ${
              added
                ? 'bg-[#0D8756] text-white'
                : 'bg-neutral-900 text-white hover:bg-black active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-white" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Flipkart Style Product Details Section */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 bg-white justify-between">
        <div>
          {/* Sponsored Label */}
          {isSponsored && (
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium leading-none mb-1 block">
              Sponsored
            </span>
          )}

          {/* Brand Name */}
          <div className="text-[11px] sm:text-[12px] font-bold text-neutral-500 sm:text-neutral-600 uppercase tracking-wide truncate mb-0.5">
            {brandName}
          </div>

          {/* Product Title (2-line clamp on mobile for readability, line-clamp-1 on desktop) */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-[13px] text-neutral-900 font-medium sm:font-normal leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating Badge (if rating exists) */}
          {product.rating > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              <span className="inline-flex items-center space-x-0.5 bg-[#388e3c] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded leading-tight">
                <span>{Number(product.rating).toFixed(1)}</span>
                <Star className="w-2.5 h-2.5 fill-current" />
              </span>
              {(product.numReviews > 0 || product.reviewsCount > 0) && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  ({product.numReviews || product.reviewsCount})
                </span>
              )}
            </div>
          )}

          {/* Price & Discount Row (flex-wrap with no clipping) */}
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-neutral-950 whitespace-nowrap">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayMrp > displayPrice && (
              <span className="text-[11px] sm:text-xs text-neutral-400 line-through font-normal whitespace-nowrap">
                ₹{displayMrp.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[11px] sm:text-xs font-bold text-[#388e3c] whitespace-nowrap">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* Deal Badge (Flipkart Lavender Badge) */}
          {dealBadge && (
            <div className="mt-1">
              <span className="inline-block bg-[#F4E8FF] text-[#6B21A8] font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-xs leading-tight truncate max-w-full">
                {dealBadge}
              </span>
            </div>
          )}

          {/* Available Sizes Row */}
          {showSizes && (
            <div className="text-[11px] sm:text-[12px] font-medium text-neutral-500 mt-1 truncate">
              Size {sizesText}
            </div>
          )}
        </div>

        {/* Mobile Quick Add / Free Delivery Row (Mobile-only action strip, hidden on desktop md:hidden) */}
        <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-between md:hidden">
          <span className="text-[10px] font-semibold text-neutral-500">
            Free Delivery
          </span>
          <button
            onClick={handleQuickAdd}
            disabled={added}
            aria-label="Quick Add to Bag"
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-all active:scale-95 ${
              added
                ? 'bg-[#0D8756] text-white'
                : 'bg-neutral-900 text-white hover:bg-black'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-white" />
                <span>Add</span>
              </>
            )}
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
