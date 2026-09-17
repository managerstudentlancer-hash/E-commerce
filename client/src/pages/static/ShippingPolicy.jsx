import React from 'react';
import { Truck, Clock, Globe } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
            FULFILMENT & DISPATCH
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Last revised: March 2026</p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-black" />
            <span>United Kingdom Shipping Rates</span>
          </h3>
          <ul className="space-y-2">
            <li>
              <strong>Orders Over £50:</strong> Complimentary Tracked Next-Day Delivery (DPD Priority / Royal Mail Tracked 24).
            </li>
            <li>
              <strong>Orders Under £50:</strong> £3.99 Standard Tracked Delivery (2–3 business days).
            </li>
            <li>
              <strong>Guaranteed Saturday / Sunday:</strong> £6.99 flat-rate courier dispatch.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900">Order Cut-Off & Dispatch Schedules</h3>
          <p>
            Orders completed Monday through Friday before 2:00 PM GMT are packed and handed over to our couriers
            the same day from our London fulfillment hub. You will receive an automated dispatch notification with
            your live tracking number as soon as your parcel is scanned.
          </p>
          <h3 className="text-base font-bold text-neutral-900">International Courier Delivery</h3>
          <p>
            We ship to over 50 destinations worldwide via DHL Express. International transit times typically range
            between 2 to 4 working days for Europe and North America. Local customs tariffs and import duties are
            calculated and included at checkout for total transparency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
