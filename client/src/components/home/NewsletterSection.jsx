import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await api.newsletter.subscribe(email);
      setSubmitted(true);
      setEmail('');
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-[#F4F691] mb-4 border border-white/10">
          <Mail className="w-3.5 h-3.5" />
          <span>EXCLUSIVE INSIDER ACCESS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Receive 10% Off Your First Order
        </h2>

        <p className="text-xs sm:text-base text-neutral-300 max-w-lg mx-auto mb-8 leading-relaxed">
          Be first to experience seasonal drops, private archive sales, and acoustic hardware launches. No spam, ever.
        </p>

        {submitted ? (
          <div className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#0D8756] text-white text-sm font-bold shadow-lg animate-fade-in">
            <Check className="w-5 h-5" />
            <span>Success! Use promo code VEX10 at checkout for 10% off.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full sm:flex-1 px-5 py-3.5 rounded-full bg-neutral-800 text-white placeholder-neutral-400 text-sm border border-neutral-700 focus:outline-none focus:border-white focus:bg-neutral-800/90 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-pill-yellow w-full sm:w-auto py-3.5 px-7 text-xs uppercase tracking-wider whitespace-nowrap shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-neutral-400 mt-4">
          By signing up, you agree to VEXIVO's Privacy Policy. You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
