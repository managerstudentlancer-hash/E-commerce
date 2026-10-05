import React from 'react';
import { Tag, Sparkles, Ticket, Gift, Flame, Crown, Clock } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'All Offers', icon: Tag, count: '30+' },
  { id: 'saree-deals', label: "Today's Saree Deals", icon: Sparkles, count: '6 Deals', hot: true },
  { id: 'exclusive-offers', label: 'Exclusive Offers', icon: Crown, count: '4 Curations' },
  { id: 'coupons', label: 'Coupons & Vouchers', icon: Ticket, count: '6 Codes' },
  { id: 'gift-cards', label: 'Gift Cards', icon: Gift, count: 'From ₹500' },
  { id: 'festival-offers', label: 'Festival Specials', icon: Flame, count: 'Grand Sale' },
  { id: 'flash-deals', label: 'Limited-Time Deals', icon: Clock, count: 'Ending Soon' },
];

const OfferFilterTabs = ({ activeTab, onSelectTab }) => {
  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-neutral-200/80 py-3 mb-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-900/15 scale-100'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700 hover:text-neutral-950'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-amber-300' : 'text-neutral-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-neutral-100'
                        : 'bg-white text-neutral-600 border border-neutral-200/60'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.hot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OfferFilterTabs;
