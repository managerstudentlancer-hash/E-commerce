import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Twitter, Check } from 'lucide-react';
import api from '../../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await api.newsletter.subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true); // Graceful demo fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand & Newsletter Column (2 spans on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                VEXIVO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4301C] mb-1" />
            </Link>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Precision acoustic hardware, contemporary luxury apparel, and minimalist accessories
              crafted for the modern lifestyle.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Join the VEXIVO Circle & Receive 10% Off
              </p>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-[#0D8756] text-xs font-semibold py-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome! Use code VEX10 at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-neutral-900 text-white placeholder-neutral-500 text-xs border border-neutral-800 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/vexivo"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-white hover:text-black transition-all flex items-center justify-center text-neutral-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/vexivo"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-white hover:text-black transition-all flex items-center justify-center text-neutral-400"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/vexivo"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-white hover:text-black transition-all flex items-center justify-center text-neutral-400"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/category/women-wear" className="hover:text-white transition-colors">Women's Edit</Link>
              </li>
              <li>
                <Link to="/category/men-wear" className="hover:text-white transition-colors">Men's Tailoring</Link>
              </li>
              <li>
                <Link to="/category/shoes" className="hover:text-white transition-colors">Footwear & Shoes</Link>
              </li>
              <li>
                <Link to="/category/bags" className="hover:text-white transition-colors">Tuscan Leather</Link>
              </li>
              <li>
                <Link to="/category/jewellery" className="hover:text-white transition-colors">18K Vermeil Jewels</Link>
              </li>
              <li>
                <Link to="/collection/new-arrivals" className="text-[#0D8756] font-semibold hover:underline">New Arrivals 2026</Link>
              </li>
              <li>
                <Link to="/collection/special-offers" className="text-[#C4301C] font-semibold hover:underline">Seasonal Sale</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Customer Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">UK & Worldwide Delivery</Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-white transition-colors">30-Day Hassle-Free Returns</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-white transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">The VEXIVO Story</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Contact & Studio
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                <span>71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <span>+44 20 7946 0991</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <span>arpit123@gmail.com</span>
              </li>
              <li className="text-[11px] text-neutral-500 pt-1">
                Mon – Sat: 9:00 AM – 6:00 PM GMT
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 VEXIVO International Ltd. All rights reserved.</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-neutral-300 text-neutral-600 transition-colors">Admin Portal</Link>
          </div>

          {/* Payment Badges (Pills) */}
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">VISA</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">MASTERCARD</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">AMEX</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">APPLE PAY</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">PAYPAL</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">KLARNA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
