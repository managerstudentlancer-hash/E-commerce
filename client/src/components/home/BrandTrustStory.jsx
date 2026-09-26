import React from 'react';
import { ShieldCheck, Truck, Sparkles, HeartHandshake, Award, RefreshCw } from 'lucide-react';

const pillars = [
  {
    title: "What You'll Find at VEXIVO",
    description:
      "A thoughtfully curated catalogue spanning contemporary British tailoring, Italian full-grain leather bags, engineered acoustic audio, and minimalist home living essentials. Every piece is selected for longevity, aesthetic clarity, and premium tactile feel.",
    icon: Sparkles,
  },
  {
    title: "Why People Shop with Us",
    description:
      "We eliminate intermediaries to bring atelier-grade materials directly to your doorstep. Over 18,000 customers across India rely on our transparent pricing, genuine customer feedback, and strict quality verification.",
    icon: Award,
  },
  {
    title: "Shopping That Just Works",
    description:
      "Enjoy complimentary Pan-India Express Delivery on orders over ₹499, seamless 1-click Express Checkout with UPI & Cards, and prepaid 30-day hassle-free returns with zero hidden restocking fees.",
    icon: Truck,
  },
  {
    title: "What We're Working Towards",
    description:
      "100% circularity and ethical craftsmanship. From our recycled acoustic aluminum casings to certified GOTS-organic cotton threads and plastic-free compostable mailers, we're building a sustainable luxury future.",
    icon: HeartHandshake,
  },
];

const BrandTrustStory = () => {
  return (
    <section className="py-16 sm:py-24 bg-neutral-50/70 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C] block mb-2">
            The VEXIVO Standard
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
            Thoughtful Living, Crafted for Longevity
          </h2>
          <p className="text-neutral-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Inspired by classic British design traditions and modern everyday utility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/70 shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-100 text-[11px] font-bold text-neutral-600 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D8756]" />
                  <span>Verified Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandTrustStory;
