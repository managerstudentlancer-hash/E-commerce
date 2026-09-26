import React, { useRef } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Julie Mathers',
    location: 'London, UK',
    product: 'French-Style Flower Lantern Sleeve Linen Dress',
    rating: 5,
    title: 'Exceeds expectations in every conceivable dimension',
    comment:
      'The fit and fabric quality are magnificent. Breathable linen with impeccable stitching. Delivery was tracked and arrived next morning in London.',
    date: '2 days ago',
  },
  {
    name: 'Jenny Wilson',
    location: 'Manchester, UK',
    product: 'The Kensington Tailored Wool Pleated Trouser',
    rating: 5,
    title: 'Authentic Savile Row tailoring with bespoke craft',
    comment:
      'The drape on these trousers is extraordinary. Premium Italian wool blend that holds its reverse pleat sharp all day. My new wardrobe essential.',
    date: '4 days ago',
  },
  {
    name: 'John Doe',
    location: 'Edinburgh, UK',
    product: 'Star Loop Wireless ANC Studio Earbuds',
    rating: 5,
    title: 'Supreme acoustic fidelity and luxury finish',
    comment:
      'Crystal-clear spatial audio, seamless Bluetooth 5.4 pairing, and the battery retention is phenomenal. Worth every pound.',
    date: '1 week ago',
  },
  {
    name: 'Sienna Brooks',
    location: 'Bristol, UK',
    product: 'Top-Grain Genuine Leather Crossbody Bag',
    rating: 5,
    title: 'Flawless pebble leather & timeless brass accents',
    comment:
      'Having full leather craftsmanship with magnetic lock and structured silhouette is everything I wanted. 10/10.',
    date: '1 week ago',
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800">
                4.9 / 5.0 Rated by 18,500+ UK Patrons
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
              Our Favorite Products & Reviews
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous testimonials"
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next testimonials"
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Track */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex-none w-[320px] sm:w-[380px] bg-white p-7 rounded-2xl border border-neutral-100 shadow-subtle flex flex-col justify-between"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div>
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-[#0D8756] text-[11px] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 mb-2 leading-snug">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900">{rev.name}</p>
                  <p className="text-[11px] text-neutral-600 font-medium truncate max-w-[200px]">
                    {rev.product}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-600">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
