import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Check, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// Curated reference fallback items if products are still loading
const fallbackTrending = [
  {
    _id: 'ref-1',
    name: 'Premium Leather Backpack',
    category: 'bags',
    slug: 'premium-leather-travel-backpack',
    price: 49.99,
    compareAtPrice: 69.99,
    discount: 28,
    badge: '-28%',
    badgeColor: 'orange',
    rating: 4.8,
    numReviews: 128,
    colors: ['#292524', '#78350f', '#a8a29e'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'ref-2',
    name: 'White Minimalist Sneakers',
    category: 'shoes',
    slug: 'athletic-cushioned-running-sneakers',
    price: 79.99,
    compareAtPrice: 99.99,
    discount: 20,
    badge: '-20%',
    badgeColor: 'orange',
    rating: 4.9,
    numReviews: 89,
    colors: ['#f8fafc', '#18181b'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'ref-3',
    name: 'Classic Ceramic Watch',
    category: 'watches',
    slug: 'minimalist-ceramic-quartz-wrist-watch',
    price: 129.99,
    compareAtPrice: 159.99,
    discount: 18,
    badge: 'HOT',
    badgeColor: 'blue',
    rating: 5.0,
    numReviews: 38,
    colors: ['#0f172a', '#e2e8f0', '#b45309'],
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'ref-4',
    name: 'Pebbled Leather Handbag',
    category: 'bags',
    slug: 'structured-pebbled-leather-tote-handbag',
    price: 89.99,
    compareAtPrice: 119.99,
    discount: 25,
    badge: 'NEW',
    badgeColor: 'green',
    rating: 4.8,
    numReviews: 74,
    colors: ['#d97706', '#1c1917', '#e5e5e5'],
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'ref-5',
    name: 'Wireless Studio Headphones',
    category: 'electronics',
    slug: 'active-noise-cancelling-wireless-headphones',
    price: 64.99,
    compareAtPrice: 89.99,
    discount: 27,
    badge: '-27%',
    badgeColor: 'orange',
    rating: 4.9,
    numReviews: 112,
    colors: ['#171717', '#f5f5f4'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
];

const filterTabs = [
  { id: 'all', label: 'All Items' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'shoes-bags', label: 'Shoes & Bags' },
  { id: 'watches-acc', label: 'Watches & Acc' },
];

const TrendingProductsSection = ({ products = [] }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedIds, setAddedIds] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  // Use real VEXIVO products when available
  const allItems = useMemo(() => {
    return products && products.length >= 5
      ? products
      : products && products.length > 0
      ? [...products, ...fallbackTrending]
      : fallbackTrending;
  }, [products]);

  // Tab Filtering
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return allItems.slice(0, 5);
    if (activeTab === 'clothing') {
      const match = allItems.filter(p => {
        const cat = (p.category?.name || p.category || '').toLowerCase();
        return cat.includes('men') || cat.includes('women') || cat.includes('wear') || cat.includes('cloth');
      });
      return match.length >= 3 ? match.slice(0, 5) : allItems.slice(0, 5);
    }
    if (activeTab === 'shoes-bags') {
      const match = allItems.filter(p => {
        const cat = (p.category?.name || p.category || '').toLowerCase();
        return cat.includes('shoe') || cat.includes('bag') || cat.includes('footwear');
      });
      return match.length >= 2 ? match.slice(0, 5) : allItems.slice(0, 5);
    }
    if (activeTab === 'watches-acc') {
      const match = allItems.filter(p => {
        const cat = (p.category?.name || p.category || '').toLowerCase();
        return cat.includes('watch') || cat.includes('jewel') || cat.includes('vision') || cat.includes('acc');
      });
      return match.length >= 2 ? match.slice(0, 5) : allItems.slice(0, 5);
    }
    return allItems.slice(0, 5);
  }, [allItems, activeTab]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id || product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id || product.id]: false }));
    }, 1600);
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-4">
      {/* Header Row: Title, Filter Tabs, & View All */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-1 block">
            HANDPICKED FOR YOU
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Trending Products
          </h2>
        </div>

        {/* Filter Pills + View All */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center space-x-1.5 bg-neutral-100/80 p-1 rounded-xl">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors flex items-center space-x-1 group ml-2 flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 5-Column Grid matching Reference Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredItems.map((product) => {
          const id = product._id || product.id;
          const inWishlist = isInWishlist(id);
          const isAdded = addedIds[id];
          const primaryImg =
            product.thumbnail ||
            (product.images && product.images[0]) ||
            product.image ||
            fallbackTrending[0].image;

          const currentPrice = Number(product.price || 0);
          const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
          const hasDiscount = Boolean(originalPrice && Number(originalPrice) > Number(currentPrice));

          return (
            <div key={id} className="group relative flex flex-col">
              {/* Image Podium Stage with Luxury Pedestal */}
              <Link
                to={`/product/${product.slug}`}
                className="relative block w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F7F5F0] to-[#EFECE5] aspect-[4/5] p-3 border border-neutral-200/60 shadow-xs group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] group-hover:border-neutral-300 transition-all duration-300"
              >
                {/* Badge Top-Left */}
                {hasDiscount && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-[#D9381E] shadow-xs tracking-wider">
                    -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
                {!hasDiscount && (product.newArrival || product.badge === 'NEW') && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-emerald-600 shadow-xs tracking-wider">
                    NEW
                  </span>
                )}
                {!hasDiscount && product.badge === 'HOT' && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-amber-600 shadow-xs tracking-wider">
                    HOT
                  </span>
                )}

                {/* Wishlist Heart Top-Right */}
                <button
                  type="button"
                  onClick={(e) => handleWishlist(e, product)}
                  aria-label="Wishlist"
                  className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'bg-red-50 text-red-500 shadow-sm'
                      : 'bg-white/85 hover:bg-white text-neutral-600 hover:text-black opacity-0 group-hover:opacity-100 shadow-xs hover:scale-105'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-red-500' : ''}`} />
                </button>

                {/* Product Photo */}
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={primaryImg}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = fallbackTrending[0].image;
                    }}
                  />
                </div>

                {/* Quick Add To Cart Floating Button on Hover with Glassmorphism */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, product)}
                  disabled={isAdded}
                  className={`absolute bottom-2.5 left-2.5 right-2.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white opacity-100'
                      : 'bg-neutral-950/90 hover:bg-neutral-950 text-white opacity-0 group-hover:opacity-100 backdrop-blur-xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added To Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              </Link>

              {/* Product Info below photo */}
              <div className="pt-2.5 space-y-1">
                {/* Color Swatch Dots if available */}
                {product.colors && (
                  <div className="flex items-center space-x-1 pb-0.5">
                    {product.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-2 h-2 rounded-full border border-neutral-300"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                <Link
                  to={`/product/${product.slug}`}
                  className="block text-xs sm:text-sm font-semibold text-neutral-900 truncate hover:text-amber-900 transition-colors"
                >
                  {product.name}
                </Link>

                {/* Price Row */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <span className={`font-bold ${hasDiscount ? 'text-[#C4301C]' : 'text-neutral-950'}`}>
                    ₹{Math.round(currentPrice).toLocaleString('en-IN')}
                  </span>
                  {originalPrice && (
                    <span className="text-neutral-400 line-through text-[11px] font-normal">
                      ₹{Math.round(originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Star Rating Row */}
                <div className="flex items-center space-x-1 pt-0.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    ({product.numReviews || product.reviewsCount || 88})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingProductsSection;
