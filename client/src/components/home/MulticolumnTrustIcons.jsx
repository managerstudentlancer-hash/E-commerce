import React from 'react';
import { Truck, Headphones, RotateCcw, ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    icon: Truck,
    title: 'Free UK Delivery',
    description: 'Complimentary tracked delivery on all domestic UK orders over £50.',
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Concierge',
    description: 'Expert customer assistance available 7 days a week via arpit123@gmail.com.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Easy Returns',
    description: 'Unhappy with your purchase? Return within 30 days for an instant exchange or refund.',
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Checkout',
    description: 'Encrypted 256-bit SSL transaction gateway supporting Apple Pay, Visa & PayPal.',
  },
];

const MulticolumnTrustIcons = () => {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF9FD] border border-neutral-100 transition-all duration-300 hover:shadow-md hover:border-neutral-200"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MulticolumnTrustIcons;
