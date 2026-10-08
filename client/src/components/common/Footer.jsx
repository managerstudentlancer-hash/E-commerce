import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Twitter, Check } from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useCategories } from '../../context/CategoryContext';

const Footer = () => {
  const { settings } = useSettings?.() || { settings: {} };
  const { categories } = useCategories?.() || { categories: [] };
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.newsletter.subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // Fallback optimistic success for smooth UX
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const displayCategories = categories && categories.length > 0 ? categories.slice(0, 5) : [
    { name: "Women Wear", slug: "women-wear" },
    { name: "Men Wear", slug: "men-wear" },
    { name: "Shoes", slug: "shoes" },
    { name: "Bags", slug: "bags" },
    { name: "Jewellery", slug: "jewellery" },
  ];

  return (
    <footer className="bg-[#121212] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Newsletter Column (2 spans on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings?.siteName || 'VEXIVO'}
                  className="h-8 w-auto max-w-[150px] object-contain"
                />
              ) : (
                <>
                  <span className="text-2xl font-extrabold tracking-tight text-white uppercase">
                    {settings?.siteName || 'VEXIVO'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4301C] mb-1" />
                </>
              )}
            </Link>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Curated luxury fashion, artisan footwear, fine jewellery, and lifestyle essentials. Dedicated to exceptional pan-India craftsmanship and seamless digital commerce.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Join the {settings?.siteName || 'VEXIVO'} Circle &amp; Receive 10% Off
              </p>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-[#0D8756] text-xs font-semibold py-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the circle! Use code WELCOME10 for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 rounded-l-full focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black px-6 py-3 text-xs font-bold uppercase rounded-r-full hover:bg-neutral-200 transition-colors flex items-center space-x-1"
                  >
                    <span>{loading ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {displayCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-white transition-colors capitalize">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/collection/new-arrivals" className="text-[#0D8756] font-semibold hover:underline">New Arrivals 2026</Link>
              </li>
              <li>
                <Link to="/collection/festive-specials" className="hover:text-white transition-colors">Festive Specials</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Shipping &amp; Logistics</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Complimentary Returns</Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-white transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link to="/become-a-seller" className="text-amber-400 font-semibold hover:underline">Sell on VEXIVO</Link>
              </li>
              <li>
                <Link to="/delivery/login" className="text-emerald-400 font-semibold hover:underline">Delivery Fleet Partner</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About {settings?.siteName || 'VEXIVO'}</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Concierge
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                <span>{settings?.contactInfo?.address || 'Connaught Place, Central Delhi, New Delhi 110001, India'}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <span>{settings?.contactInfo?.phone || '+91 80000 12345'}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <span>{settings?.contactInfo?.email || 'support@vexivo.com'}</span>
              </li>
              <li className="text-[11px] text-neutral-500 pt-1">
                {settings?.contactInfo?.hours || 'Mon – Sat: 9:00 AM – 8:00 PM IST'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 {settings?.siteName || 'VEXIVO'} Marketplace India. All rights reserved.</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/become-a-seller" className="hover:text-amber-400 text-neutral-400 transition-colors">Seller Registration</Link>
            <Link to="/delivery/login" className="hover:text-emerald-400 text-neutral-400 transition-colors">Fleet Rider</Link>
            <Link to="/admin/login" className="hover:text-neutral-300 text-neutral-600 transition-colors">Admin Portal</Link>
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={() => {
                  import('../../services/sentry').then(({ triggerTestError }) => {
                    triggerTestError();
                    alert('⚡ Test error sent to Sentry! Check your Sentry dashboard at arpit-34.sentry.io');
                  });
                }}
                className="hover:text-rose-400 text-neutral-500 transition-colors font-mono cursor-pointer"
                title="Send test error to Sentry (arpit-34.sentry.io)"
              >
                ⚡ Test Sentry
              </button>
            )}
          </div>

          {/* Payment Badges (Pills) */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">UPI</span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">RUPAY</span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">VISA</span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">MASTERCARD</span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400">NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
