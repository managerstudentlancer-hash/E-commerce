import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500">Effective Date: March 1, 2026</p>
        <p>
          At VEXIVO International Ltd, we take the confidentiality and privacy of our clientele with the highest
          seriousness. This statement details how your information is gathered, encrypted, and utilized in strict
          adherence to UK GDPR and the Data Protection Act 2018.
        </p>
        <h3 className="text-base font-bold text-neutral-900 pt-4">Data Collection & Usage</h3>
        <p>
          We only gather data necessary to fulfill your purchases, manage communications, and improve navigation.
          Payment records are routed through tokenized, Tier 1 PCI-DSS compliant providers. We never store raw card
          data on our local servers.
        </p>
        <h3 className="text-base font-bold text-neutral-900 pt-4">No Third-Party Data Selling</h3>
        <p>
          Under zero circumstances does VEXIVO license, monetize, or sell client data to third-party data brokers.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
