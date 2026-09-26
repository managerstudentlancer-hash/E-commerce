import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
            OUR GUARANTEE
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
            30-Day Return & Exchange Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Hassle-free domestic and international returns</p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-3">
          <div className="flex items-center space-x-2 text-[#0D8756] font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>30 Days to Try at Home</span>
          </div>
          <p>
            We want you to be completely captivated by your VEXIVO acquisition. If for any reason an item
            fails to delight, you may return it within 30 days of receiving your delivery for a full refund or
            instant size/color exchange.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900">Return Eligibility Criteria</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li>Item must be in its original unworn and unwashed state with all protective hardware seals intact.</li>
            <li>Original packaging, branded dust bags, acoustic charging cases, and authentication cards must be returned.</li>
            <li>Earbuds and intimate jewelry must remain in sealed hygienic packaging to be eligible for refund.</li>
          </ul>

          <h3 className="text-base font-bold text-neutral-900">Prepaid Royal Mail Return Labels</h3>
          <p>
            All UK orders include a peel-and-stick prepaid Royal Mail tracked return label enclosed inside your parcel box.
            Simply re-seal the box, apply the label, and hand it to your local Post Office branch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
