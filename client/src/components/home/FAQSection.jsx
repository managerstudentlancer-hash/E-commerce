import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How fast is delivery across India, and what are the shipping costs?',
    a: 'We offer complimentary Express Tracked Delivery on all orders over ₹499 via Delhivery, BlueDart, and Ekart Logistics. For orders under ₹499, standard delivery is ₹49. Orders placed before 2:00 PM IST Monday to Saturday are dispatched the same day from our fulfillment hubs in Mumbai and Delhi.',
  },
  {
    q: 'What is VEXIVO’s return and exchange policy?',
    a: 'We operate a 30-day hassle-free return window. Any item returned in its original, unworn condition with tags intact is eligible for a full refund or free size/color exchange with free doorstep reverse pickup.',
  },
  {
    q: 'How does the Lifetime Craft Warranty work for hardware & audio?',
    a: 'All VEXIVO acoustic hardware (including headphones and earbuds) and leathergoods are backed by our comprehensive warranty covering manufacturer defects, driver imbalance, and hardware failure for the lifetime of the product.',
  },
  {
    q: 'What payment options and UPI methods do you accept?',
    a: 'We support instant UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ Indian banks, and Cash on Delivery (COD).',
  },
  {
    q: 'Where are VEXIVO garments and lifestyle goods manufactured?',
    a: 'Our apparel and lifestyle collections are designed with modern minimalist aesthetics and produced in certified artisanal facilities using traceable, ethically certified organic raw materials.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-bold uppercase tracking-widest text-neutral-800 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HELP & ASSISTANCE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Everything you need to know about our products, delivery, and guarantees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-black transition-colors pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-neutral-900 text-white' : 'group-hover:bg-neutral-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 animate-fade-in">
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {faq.a}
                    </p>
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

export default FAQSection;
