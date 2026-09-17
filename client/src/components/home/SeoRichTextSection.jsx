import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

const accordions = [
  {
    id: 'intro',
    title: 'Why Shop Online with VEXIVO UK?',
    content:
      'VEXIVO is the premier destination for modern lifestyle essentials across the United Kingdom. From bespoke Italian wool tailoring and handcrafted full-grain leather goods to studio-calibrated acoustic engineering, our product catalog represents an uncompromising synthesis of architectural elegance, premium durability, and accessible luxury.',
  },
  {
    id: 'quality',
    title: 'Uncompromising Fabric & Hardware Standards',
    content:
      'Every collection item undergoes rigorous quality inspections in Covent Garden, London before dispatch. We exclusively partner with certified sustainable mills utilizing long-staple organic cotton, Italian virgin wool, and hypoallergenic textiles. Our acoustic lineup features custom 40mm neodymium dynamic drivers engineered for ultra-low distortion listening.',
  },
  {
    id: 'delivery',
    title: 'Fast Tracked UK Next-Day Delivery & Easy 30-Day Returns',
    content:
      'We understand that timing matters. Orders completed before 2:00 PM GMT qualify for rapid UK courier dispatch with full end-to-end Royal Mail / DPD tracking. If any piece does not fit your aesthetic or requirement, return it within 30 days in its original presentation box for an immediate 100% refund.',
  },
  {
    id: 'support',
    title: 'Dedicated Concierge & Customer Care (arpit123@gmail.com)',
    content:
      'Have inquiries regarding sizing, custom gifting, or corporate orders? Our London concierge team operates 7 days a week from 9:00 AM to 6:00 PM GMT. Reach us directly via email at arpit123@gmail.com or telephone at +44 20 7946 0991 for bespoke assistance.',
  },
];

const SeoRichTextSection = () => {
  const [openId, setOpenId] = useState('intro');

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF9FD] border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Shaporoo 1:1 SEO / Brand Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C] block mb-2">
            The VEXIVO Standard
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Buy Trending Lifestyle Essentials Online UK | Best Deals at <strong className="text-[#C4301C] font-extrabold">VEXIVO</strong>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
            Everything you need to know about our sourcing, Savile Row precision, customer guarantees, and next-day UK delivery.
          </p>
        </div>

        {/* Collapsible Accordion Blocks */}
        <div className="space-y-3 bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-neutral-100">
          {accordions.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border border-neutral-100 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900 pr-4">
                    {item.title}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-700">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white animate-in fade-in duration-300">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SeoRichTextSection;
