import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  HelpCircle,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Mail,
  Search,
} from 'lucide-react';

const faqCategories = [
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: Truck,
    questions: [
      {
        q: 'How fast is UK delivery, and what are the shipping costs?',
        a: 'We offer complimentary Next-Day Tracked Delivery on all UK orders over £50 via DPD Priority and Royal Mail Tracked 24. For orders under £50, standard delivery is £3.99. Orders placed before 2:00 PM GMT Monday to Friday are dispatched the same day from our London distribution center.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 85 countries worldwide via DHL Express. International shipping typically takes 2-4 business days for Europe and North America, and 3-6 business days for the rest of the world. All import taxes and duties are calculated at checkout with no hidden fees.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive a confirmation email containing your live tracking number. You can also track your order directly from your VEXIVO Account under "Order History".',
      },
    ],
  },
  {
    id: 'returns',
    name: 'Returns & Exchanges',
    icon: RotateCcw,
    questions: [
      {
        q: 'What is VEXIVO’s return and exchange policy?',
        a: 'We operate a 30-day hassle-free return window. Any item returned in its original, unworn condition with tags and packaging intact is eligible for a full refund or free size/color exchange. Every parcel includes a prepaid Royal Mail return label.',
      },
      {
        q: 'How long do refunds take to process?',
        a: 'Once our warehouse receives and inspects your return (typically within 48 hours of receipt), your refund is immediately processed back to your original payment method. Depending on your bank, funds appear in 3-5 business days.',
      },
      {
        q: 'Can I exchange an item for a different size?',
        a: 'Yes! Size and color exchanges are 100% free with priority processing. Simply initiate an exchange in your Account dashboard or contact our customer concierge team.',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Orders & Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and interest-free installment options via Klarna and Clearpay/Afterpay.',
      },
      {
        q: 'How do I apply a promo code or gift voucher?',
        a: 'You can enter your promo code or gift voucher in the order summary sidebar on either the Cart page or during Step 1 of Checkout. The discount will be immediately reflected in your total.',
      },
      {
        q: 'Is checkout secure on VEXIVO?',
        a: 'All transactions are encrypted with 256-bit SSL encryption and processed through PCI-DSS Level 1 compliant payment gateways. We never store your full card details.',
      },
    ],
  },
  {
    id: 'products',
    name: 'Products & Warranty',
    icon: Sparkles,
    questions: [
      {
        q: 'How does the Lifetime Craft Warranty work for hardware & audio?',
        a: 'All VEXIVO acoustic hardware (including Aethel headphones and Helix earbuds) and leathergoods are backed by our comprehensive warranty covering manufacturer defects, acoustic driver imbalance, and hardware failure for the lifetime of the product.',
      },
      {
        q: 'Where are VEXIVO garments and leathergoods manufactured?',
        a: 'Our apparel is designed in London and produced in certified artisanal facilities in Civitanova Marche (Italy), Porto (Portugal), and Ulaanbaatar (Mongolia) using traceable, ethically certified organic raw materials.',
      },
      {
        q: 'How do I find my size?',
        a: 'Every product page features a detailed interactive Size Guide with exact centimeter/inch measurements for chest, waist, hips, and inseam, as well as model dimensions and fit recommendations.',
      },
    ],
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: User,
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'No, guest checkout is supported. However, creating an account unlocks order tracking, wishlist saving, saved addresses, and exclusive member-only early access to new releases.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click on the "Forgot password?" link on the login page and enter your registered email address. We will send you a secure password reset link within seconds.',
      },
    ],
  },
];

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredCategories = faqCategories
    .filter((cat) => (activeTab === 'all' ? true : cat.id === activeTab))
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          !searchQuery.trim() ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-neutral-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-neutral-200">
            <HelpCircle className="w-4 h-4 text-[#C4301C]" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Find immediate answers regarding orders, shipping, returns, sizing, and product guarantees.
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none mt-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, policies..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4301C] mt-4 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Questions
          </button>
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="py-8 space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">No questions matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="btn-pill-dark text-xs py-2 px-4 mt-2"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2">
                  <cat.icon className="w-4 h-4 text-[#C4301C]" />
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">{cat.name}</h2>
                </div>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-subtle">
                  {cat.questions.map((faq, qIdx) => {
                    const key = `${catIdx}-${qIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={qIdx} className="p-4 sm:p-5 hover:bg-neutral-50/50 transition-colors">
                        <button
                          onClick={() => toggleItem(catIdx, qIdx)}
                          className="w-full flex items-center justify-between text-left focus:outline-none group"
                        >
                          <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black transition-colors pr-4">
                            {faq.q}
                          </span>
                          <div
                            className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? 'rotate-180 bg-neutral-900 text-white' : 'group-hover:bg-neutral-200'
                            }`}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-3 pr-8 animate-fade-in text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Support Footer Card */}
        <div className="mt-8 p-8 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold text-neutral-900">Still have questions?</h3>
            <p className="text-xs text-neutral-500">
              Our 24/7 London concierge team is on standby to assist you with order inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/contact"
              className="btn-pill-dark text-xs py-2.5 px-6 flex items-center space-x-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
