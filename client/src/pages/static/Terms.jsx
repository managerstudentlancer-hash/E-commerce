import React from 'react';

const Terms = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-500">Effective Date: March 1, 2026</p>
        <p>
          These Terms of Service govern your access to and utilization of the website and services provided by VEXIVO
          International Ltd, a registered company in England & Wales.
        </p>
        <h3 className="text-base font-bold text-neutral-900 pt-4">1. Order Placement & Contract Formation</h3>
        <p>
          By submitting an order on our platform, you propose an offer to purchase the specified merchandise. An order
          confirmation email acknowledges receipt; final acceptance occurs when products are physically dispatched.
        </p>
        <h3 className="text-base font-bold text-neutral-900 pt-4">2. Pricing & Currency</h3>
        <p>
          All prices on the storefront are quoted in Indian Rupees (INR ₹) and are inclusive of applicable Goods and
          Services Tax (GST).
        </p>
      </div>
    </div>
  );
};

export default Terms;
