import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, ShoppingBag, Eye, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const favoriteSlides = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE1] to-[#EBE0D2]',
    accentColor: '#171717',
    product: {
      id: 'fav-1',
      name: 'Artisanal Italian Cashmere Wrap Coat',
      slug: 'artisanal-italian-cashmere-wrap-coat',
      category: 'Luxury Outerwear',
      price: 2899.00,
      compareAtPrice: 3999.00,
      discount: 28,
      rating: 5,
      reviewsCount: 78,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85',
    },
    quote: '“The tailoring and cashmere drape are exquisite. Sourced from authentic artisans with an immaculate bespoke finish.”',
    author: 'Pooja Sharma',
    location: 'Mumbai, MH',
    verified: true,
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-gradient-to-br from-[#F5F8FA] via-[#EEF2F6] to-[#E3E9F0]',
    accentColor: '#0f172a',
    product: {
      id: 'fav-2',
      name: 'The Kensington Super 120s Double-Pleat Trouser',
      slug: 'the-kensington-super-120s-double-pleat-trouser',
      category: "Men's Tailoring",
      price: 1899.00,
      compareAtPrice: 2499.00,
      discount: 24,
      rating: 5,
      reviewsCount: 64,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85',
    },
    quote: '“All fabrics feel substantial and imported directly with bespoke Savile Row architectural craft.”',
    author: 'Kavita Patel',
    location: 'Ahmedabad, GJ',
    verified: true,
  },
  {
    id: 3,
    bgImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-gradient-to-br from-[#FAF6F0] via-[#F4ECE0] to-[#EAE0D0]',
    accentColor: '#78350F',
    product: {
      id: 'fav-3',
      name: 'Top-Grain Genuine Leather Crossbody Bag',
      slug: 'the-mayfair-top-grain-leather-tote',
      category: 'Luxury Leather',
      price: 1599.00,
      compareAtPrice: 2199.00,
      discount: 27,
      rating: 5,
      reviewsCount: 52,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    },
    quote: '“Crafted with care using Tuscan full-grain leather, each stitch reflects genuine European luxury.”',
    author: 'Sunita Rao',
    location: 'Bengaluru, KA',
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="rounded-[2.2rem] sm:rounded-[2.5rem] overflow-hidden border border-[#E9DFCE] shadow-[0_15px_50px_rgba(0,0,0,0.04)] bg-white">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[620px]">
          
          {/* LEFT SIDE: Lifestyle Backdrop with Floating Glass Product Card (7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-7 relative min-h-[460px] sm:min-h-[520px] lg:min-h-full overflow-hidden bg-neutral-900 group">
            {/* Background Lifestyle Image with smooth crossfade */}
            <img
              key={`bg-${slide.id}`}
              src={slide.bgImage}
              alt={slide.product.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/* Centered Floating Product Card with Glassmorphism */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
              <div className="w-full max-w-[310px] sm:max-w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/80 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.32)] hover:-translate-y-1">
                
                {/* Product Card Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F6F3EE] mb-3.5 group/card">
                  <img
                    key={`card-img-${slide.product.id}`}
                    src={slide.product.image}
                    alt={slide.product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-105"
                  />

                  {/* Discount Badge */}
                  {slide.product.discount > 0 && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#D9381E] text-white text-[10px] font-extrabold shadow-sm tracking-wider">
                      -{slide.product.discount}%
                    </span>
                  )}

                  {/* Quick View Pill */}
                  <Link
                    to={`/product/${slide.product.slug}`}
                    className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 py-1.5 px-4 rounded-full bg-white/95 text-neutral-900 text-[11px] font-bold shadow-md hover:bg-white flex items-center space-x-1 whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </div>

                {/* Product Info */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900/80 block">
                    {slide.product.category}
                  </span>

                  <Link
                    to={`/product/${slide.product.slug}`}
                    className="block text-sm sm:text-[15px] font-extrabold text-neutral-900 hover:text-amber-900 line-clamp-1 transition-colors"
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
                    <span className="text-[11px] font-medium text-neutral-500">
                      ({slide.product.reviewsCount} reviews)
                    </span>
                  </div>

                  {/* Pricing & Add to Cart Row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 mt-2">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-extrabold text-neutral-950">
                          ₹{Math.round(slide.product.price).toLocaleString('en-IN')}
                        </span>
                        {slide.product.compareAtPrice > slide.product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{Math.round(slide.product.compareAtPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-500 block">Free Shipping Included</span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={added}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                        added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-950 text-white hover:bg-neutral-800'
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
                          <span>Add to Bag</span>
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
            className={`lg:col-span-5 xl:col-span-5 relative flex flex-col justify-between p-8 sm:p-12 lg:p-14 transition-colors duration-700 ${slide.colorScheme}`}
          >
            {/* Section Heading */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs border border-white/60 text-[10px] font-extrabold uppercase tracking-widest text-neutral-800 mb-3 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>VERIFIED CUSTOMER STORIES</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                Our Favorite <span className="font-serif italic font-normal text-amber-950">Curations</span>
              </h2>
            </div>

            {/* Review Quote Block */}
            <div key={`quote-${slide.id}`} className="my-6 sm:my-8 space-y-4 animate-fade-in">
              {/* Stars with Verified Badge */}
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-700">5.0 / 5.0</span>
              </div>

              {/* Quote text */}
              <blockquote className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug tracking-tight">
                {slide.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-neutral-950 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-white/60">
                  {slide.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-neutral-900">
                    {slide.author}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
                    <span>{slide.location}</span>
                    <span>•</span>
                    <span className="inline-flex items-center text-emerald-700 font-bold text-[11px]">
                      <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified Customer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls: Grouped Fraction + Prev/Next Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-300/60">
              {/* Fraction Indicator */}
              <div className="text-xs font-mono font-bold tracking-widest text-neutral-600 flex items-center space-x-2">
                <span className="text-neutral-950 text-sm font-extrabold">0{current + 1}</span>
                <span className="text-neutral-400">/</span>
                <span>0{favoriteSlides.length}</span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous favorite product"
                  className="w-10 h-10 rounded-full bg-white/90 border border-neutral-200 hover:border-black text-neutral-800 hover:text-black flex items-center justify-center shadow-xs transition-all active:scale-95 hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next favorite product"
                  className="w-10 h-10 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 flex items-center justify-center shadow-xs transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FavoriteProductsSection;
