import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Complimentary UK Delivery',
    description: 'Free next-day shipping on orders over £50 across England, Scotland, Wales & NI.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Hassle-Free Returns',
    description: 'Not quite perfect? Return or exchange with pre-paid royal mail return labels.',
  },
  {
    icon: ShieldCheck,
    title: 'Lifetime Quality Guarantee',
    description: 'Every audio instrument and leather piece is backed by our rigorous craft warranty.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Client Concierge',
    description: 'Our London specialist team is available 6 days a week for styling & technical advice.',
  },
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-center flex-shrink-0 text-black">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 tracking-tight mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {badge.description}
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

export default TrustBadges;
