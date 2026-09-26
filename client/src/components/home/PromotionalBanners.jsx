import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const defaultPromoCards = [
  {
    id: 1,
    title: "Women's Collection",
    subtitle: 'Silk Blouses, Trench Coats & Tailored Trousers',
    tag: 'TRENDING NOW',
    tagBg: 'bg-[#C4301C]',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    btnText: 'Shop Women',
  },
  {
    id: 2,
    title: "Men's Fashion",
    subtitle: 'Oxford Cotton Shirts, Tailored Suits & Overcoats',
    tag: 'NEW IN',
    tagBg: 'bg-blue-600',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    link: '/category/men-wear',
    btnText: 'Shop Men',
  },
  {
    id: 3,
    title: 'Shoes & Footwear',
    subtitle: 'Italian Calfskin Sneakers, Boots & Loafers',
    tag: 'FOOTWEAR EDIT',
    tagBg: 'bg-[#0D8756]',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    link: '/category/shoes',
    btnText: 'Shop Shoes',
  },
  {
    id: 4,
    title: 'Luxury Bags & Leather',
    subtitle: 'Tuscan Full-Grain Totes & Saddle Bags',
    tag: 'BESTSELLERS',
    tagBg: 'bg-black',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    link: '/category/bags',
    btnText: 'Explore Bags',
  },
  {
    id: 5,
    title: 'Beauty & Skincare',
    subtitle: 'Resurfacing Serums, Botanical Skincare & Makeup',
    tag: 'PURE GLOW',
    tagBg: 'bg-rose-500',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    link: '/category/beauty',
    btnText: 'Shop Beauty',
  },
  {
    id: 6,
    title: 'Fine Jewellery & Watches',
    subtitle: '18K Vermeil Gold, Freshwater Pearls & Timepieces',
    tag: 'PRECIOUS EDIT',
    tagBg: 'bg-amber-600',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    link: '/category/jewellery',
    btnText: 'Shop Jewellery',
  },
];

const PromotionalBanners = ({ banners: customBanners }) => {
  const cards = customBanners && customBanners.length > 0 ? customBanners : defaultPromoCards;

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
            Our Curated Departments
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Shop By <strong className="font-extrabold text-[#C4301C]">Category</strong>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Explore authentic luxury across our premier marketplace departments.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card, idx) => (
            <div
              key={card._id || card.id || idx}
              className="group relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-6 shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.title}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                }}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[850ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

              {/* Top Tag */}
              <div className="relative z-10">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md ${
                    card.tagBg || 'bg-[#C4301C]'
                  }`}
                >
                  {card.tag || card.highlight || 'TRENDING'}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 text-white space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight text-white group-hover:text-amber-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed font-normal">
                  {card.subtitle || card.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={card.buttonLink || card.link || '/shop'}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/95 text-black hover:bg-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>{card.buttonText || card.btnText || 'Shop Now'}</span>
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
