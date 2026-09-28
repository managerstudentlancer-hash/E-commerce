import React from 'react';
import { Truck, Headphones, ShieldCheck, CreditCard } from 'lucide-react';

const ReferenceTrustStrip = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
      <div className="rounded-3xl bg-gradient-to-r from-[#F8F5EE] via-[#F3ECE1] to-[#F8F5EE] p-6 sm:p-8 border border-[#E9DFCE] shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* 1. Free Shipping */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-amber-900 shadow-xs border border-white/80 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                Free Shipping
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-tight">
                On orders over $50
              </p>
            </div>
          </div>

          {/* 2. 24/7 Support */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-amber-900 shadow-xs border border-white/80 flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                24/7 Support
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-tight">
                Dedicated concierge
              </p>
            </div>
          </div>

          {/* 3. Secure Payment */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-amber-900 shadow-xs border border-white/80 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                Secure Checkout
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-tight">
                256-bit SSL encrypted
              </p>
            </div>
          </div>

          {/* 4. Money Back */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-amber-900 shadow-xs border border-white/80 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                Money Back
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-tight">
                30-day effortless return
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReferenceTrustStrip;
