import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const favoriteSlides = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-[#F9F6F0]',
    accentColor: '#C4301C',
    product: {
      id: 'fav-1',
      name: 'French Floral Lantern Sleeve Midi Dress',
      slug: 'french-floral-lantern-sleeve-midi-dress',
      category: 'Lady Dresses',
      price: 95.00,
      compareAtPrice: 135.00,
      discount: 30,
      rating: 5,
      reviewsCount: 48,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    },
    quote: '“Each piece is authentic and carefully sourced from its place of origin.”',
    author: 'Julie Mathers',
    location: 'London, UK',
    verified: true,
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-[#F2F5F8]',
    accentColor: '#1A365D',
    product: {
      id: 'fav-2',
      name: 'The Kensington Super 120s Double-Pleat Trouser',
      slug: 'the-kensington-super-120s-double-pleat-trouser',
      category: "Men's Tailoring",
      price: 145.00,
      compareAtPrice: 190.00,
      discount: 24,
      rating: 5,
      reviewsCount: 64,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    },
    quote: '“All products are authentic and imported directly with bespoke Savile Row craft.”',
    author: 'Jenny Wilson',
    location: 'Manchester, UK',
    verified: true,
  },
  {
    id: 3,
    bgImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-[#F7F2EB]',
    accentColor: '#78350F',
    product: {
      id: 'fav-3',
      name: 'Top-Grain Genuine Leather Crossbody Bag',
      slug: 'the-mayfair-top-grain-leather-tote',
      category: 'Luxury Bags',
      price: 140.00,
      compareAtPrice: 195.00,
      discount: 28,
      rating: 5,
      reviewsCount: 52,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    },
    quote: '“Crafted with care using Tuscan full-grain leather, each piece reflects true luxury.”',
    author: 'John Doe',
    location: 'Edinburgh, UK',
    verified: true,
  },
];

const FavoriteProductsSection = () => {
  const [current, setCurrent] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const slide = favoriteSlides[current];

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % favoriteSlides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + favoriteSlides.length) % favoriteSlides.length);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        _id: slide.product.id,
        name: slide.product.name,
        price: slide.product.price,
        image: slide.product.image,
        images: [slide.product.image],
        category: slide.product.category,
        slug: slide.product.slug,
        stock: 12,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-neutral-100 bg-white">
      {/* 1:1 Shaporoo favorite-products container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
        
        {/* LEFT SIDE: Lifestyle Backdrop with Centered Floating Product Card (7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-7 relative min-h-[460px] sm:min-h-[520px] lg:min-h-full overflow-hidden bg-neutral-900 group">
          {/* Background Lifestyle Image with smooth crossfade */}
          <img
            key={`bg-${slide.id}`}
            src={slide.bgImage}
            alt={slide.product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out animate-in fade-in zoom-in-95"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Centered Floating Product Card (1:1 Shaporoo floating card style) */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
            <div className="w-full max-w-[310px] sm:max-w-[340px] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-white/60 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              
              {/* Product Card Image Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] mb-3.5 group/card">
                <img
                  key={`card-img-${slide.product.id}`}
                  src={slide.product.image}
                  alt={slide.product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover/card:scale-105"
                />

                {/* Badge */}
                {slide.product.discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 badge-sale shadow-sm">
                    -{slide.product.discount}%
                  </span>
                )}

                {/* Quick View Pill */}
                <Link
                  to={`/product/${slide.product.slug}`}
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 py-1.5 px-3.5 rounded-full bg-white/95 text-neutral-900 text-[11px] font-bold shadow-md hover:bg-white flex items-center space-x-1 whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
              </div>

              {/* Product Info */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 block">
                  {slide.product.category}
                </span>

                <Link
                  to={`/product/${slide.product.slug}`}
                  className="block text-sm sm:text-[15px] font-extrabold text-neutral-900 hover:text-black line-clamp-1 transition-colors"
                >
                  {slide.product.name}
                </Link>

                {/* Star Rating */}
                <div className="flex items-center space-x-1.5 pt-0.5">
                  <div className="flex text-amber-400">
                    {[...Array(slide.product.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-600">
                    ({slide.product.reviewsCount})
                  </span>
                </div>

                {/* Pricing & Add to Cart Row */}
                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 mt-2">
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-extrabold text-[#C4301C]">
                        ₹{slide.product.price.toFixed(2)}
                      </span>
                      {slide.product.compareAtPrice > slide.product.price && (
                        <span className="text-xs text-neutral-600 line-through">
                          ₹{slide.product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-600 block">Inc. GST / Pan-India delivery</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black text-white hover:bg-neutral-800'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Synchronized Testimonial & Review Content (5 Cols) */}
        <div
          className={`lg:col-span-5 xl:col-span-5 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 transition-colors duration-700 ${slide.colorScheme}`}
        >
          {/* Section Heading with 1:1 Shaporoo typography */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C4301C]" />
              <span>Verified Customer Stories</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Our Favorite <strong className="font-extrabold text-[#C4301C]">Products</strong>
            </h2>
          </div>

          {/* Review Quote Block */}
          <div key={`quote-${slide.id}`} className="my-8 sm:my-10 space-y-5 animate-in fade-in duration-500">
            {/* Stars */}
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ))}
            </div>

            {/* Quote text */}
            <blockquote className="text-xl sm:text-2xl lg:text-[26px] font-bold text-neutral-900 leading-snug tracking-tight">
              {slide.quote}
            </blockquote>

            {/* Author */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {slide.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-neutral-900">
                  {slide.author}
                </h4>
                <div className="flex items-center space-x-1 text-xs text-neutral-600 font-medium">
                  <span>{slide.location}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Grouped Fraction + Prev/Next Buttons (1:1 Shaporoo) */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-300/60">
            {/* Fraction Indicator (e.g. 01 / 03) */}
            <div className="text-xs font-mono font-bold tracking-widest text-neutral-600">
              <span className="text-neutral-950 text-sm font-extrabold">0{current + 1}</span>
              <span className="mx-1.5 text-neutral-600">/</span>
              <span>0{favoriteSlides.length}</span>
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                aria-label="Previous favorite product"
                className="w-10 h-10 rounded-full bg-white border border-neutral-300 hover:border-black text-neutral-800 hover:text-black flex items-center justify-center shadow-sm transition-all active:scale-95 hover:bg-neutral-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next favorite product"
                className="w-10 h-10 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FavoriteProductsSection;
