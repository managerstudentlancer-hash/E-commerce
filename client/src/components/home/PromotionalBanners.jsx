import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Clock } from 'lucide-react';

const promoCards = [
  {
    id: 1,
    title: 'Wide Leg Pants',
    subtitle: 'High-Rise Knife Pleats & Fluid Drape',
    tag: 'TRENDING NOW',
    tagBg: 'bg-[#C4301C]',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    link: '/category/women',
    btnText: 'Shop Pants',
  },
  {
    id: 2,
    title: 'Casual Shoes — Coming Soon!',
    subtitle: 'Italian Nappa Leather & Minimalist Runners',
    tag: 'NEW DROP',
    tagBg: 'bg-[#0D8756]',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    link: '/category/shoes',
    btnText: 'View Footwear',
  },
  {
    id: 3,
    title: 'Luxury Bag Collection',
    subtitle: 'Tuscan Full-Grain Totes & Saddle Bags',
    tag: 'BESTSELLERS',
    tagBg: 'bg-black',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    link: '/category/bags',
    btnText: 'Explore Bags',
  },
  {
    id: 4,
    title: 'Baby Growing Collection',
    subtitle: '100% Hypoallergenic Organic Bamboo Rompers',
    tag: 'GIFT EDIT',
    tagBg: 'bg-purple-600',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    link: '/category/kids',
    btnText: 'Shop Petite',
  },
];

const PromotionalBanners = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shaporoo 1:1 grid_banner Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
            Our Best Winter Products
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Winter <strong className="font-extrabold text-black">Products</strong>
          </h2>
        </div>

        {/* 4-Card Bento Grid (Matches Shaporoo grid-banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {promoCards.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
            >
              {/* Background Image with 1:1 Shaporoo 0.85s material zoom */}
              <img
                src={card.image}
                alt={card.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                }}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

              {/* Top Tag */}
              <div className="relative z-10">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md ${card.tagBg}`}
                >
                  {card.tag}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 text-white space-y-1.5">
                <h3 className="text-xl font-extrabold tracking-tight leading-tight text-white group-hover:text-amber-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed font-normal">
                  {card.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    to={card.link}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/95 text-black hover:bg-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
