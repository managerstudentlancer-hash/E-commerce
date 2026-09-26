import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const topCategoriesList = [
  {
    name: 'Women Wear',
    slug: 'women-wear',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    description: 'Dresses, tops, luxury silks & couture tailoring',
  },
  {
    name: 'Men Wear',
    slug: 'men-wear',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    description: 'Bespoke suits, shirts, knitwear & outerwear',
  },
  {
    name: 'Kids Wear',
    slug: 'kids-wear',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80',
    description: 'Organic playwear, rompers & cozy outfits',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    description: 'Athletic runners, leather loafers & heels',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    description: 'Lipsticks, skin elixirs & luxury cosmetics',
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    description: '18k gold pendants, pearls & fine jewels',
  },
  {
    name: 'Bags',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    description: 'Tuscan leather totes, clutches & crossbodies',
  },
  {
    name: 'Hats',
    slug: 'hats',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
    description: 'Embroidered caps, felt fedoras & beanies',
  },
  {
    name: 'Vision Care',
    slug: 'vision-care',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
    description: 'Polarized designer sunglasses & opticals',
  },
  {
    name: 'Pets Care',
    slug: 'pets-care',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    description: 'Organic pet grooming, beds & accessories',
  },
  {
    name: 'Toys',
    slug: 'toys',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
    description: 'Educational wooden toys & plush keepsakes',
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
    description: 'Studio yoga mats, dumbbells & training kit',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    description: 'Studio ANC headphones & acoustic gadgets',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    description: 'Velvet furniture, ceramics & lighting',
  },
];

const CategoryBubbles = () => {
  const { categories } = useCategories?.() || { categories: [] };
  const scrollRef = useRef(null);
  const [activeSlug, setActiveSlug] = useState('women-wear');

  // Merge with any dynamic backend items while preserving the user's exact curated order & photos
  const mergedList = topCategoriesList.map((topCat) => {
    const fromApi = categories.find((c) => c.slug === topCat.slug);
    return {
      ...topCat,
      name: fromApi?.name || topCat.name,
      image: topCat.image, // Strictly use the user-requested high-res image
    };
  });

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const offset = dir === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white pt-8 pb-10 border-b border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching User Mockup 1:1 */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow with gradient accent lines */}
          <div className="flex items-center justify-center space-x-3 mb-2.5">
            <div className="h-[1.5px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#6366F1]" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-[#6366F1]">
              SHOP BY CATEGORY
            </span>
            <div className="h-[1.5px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#6366F1]" />
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
            Explore <span className="text-[#6366F1]">Our Top</span> Categories
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-medium max-w-lg mx-auto leading-relaxed">
            Discover the best products in every category, handpicked just for you.
          </p>
        </div>

        {/* Carousel Container with Floating Left / Right Buttons */}
        <div className="relative group/nav">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Category Bubbles Row */}
          <div
            ref={scrollRef}
            className="flex items-center space-x-6 sm:space-x-8 md:space-x-10 overflow-x-auto no-scrollbar scroll-smooth px-6 sm:px-10 py-3"
          >
            {mergedList.map((cat) => {
              const isActive = activeSlug === cat.slug;

              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  className="flex flex-col items-center flex-shrink-0 group focus:outline-none select-none text-center"
                >
                  {/* Bubble Circle with exact Active Purple Ring & Glow */}
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'ring-4 ring-[#6366F1] ring-offset-4 ring-offset-white shadow-[0_6px_24px_rgba(99,102,241,0.35)] scale-105'
                        : 'border-2 border-transparent group-hover:ring-4 group-hover:ring-[#6366F1]/70 group-hover:ring-offset-2 group-hover:ring-offset-white group-hover:shadow-[0_4px_16px_rgba(99,102,241,0.25)] group-hover:scale-105'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Category Name Label (Never truncated!) */}
                  <span
                    className={`text-xs sm:text-[13px] font-bold mt-3 transition-colors text-center whitespace-nowrap block ${
                      isActive
                        ? 'text-[#6366F1]'
                        : 'text-neutral-800 group-hover:text-[#6366F1]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBubbles;
