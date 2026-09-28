import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
            CLIENT CONCIERGE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Contact {settings.siteName || 'VEXIVO'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Our concierge team is on hand for styling advice, order tracking, and bespoke requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-4">
              <h3 className="text-sm font-bold uppercase text-neutral-900">Registered Office</h3>
              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span>{settings.contactInfo?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-black flex-shrink-0" />
                  <span>{settings.contactInfo?.phone || '+44 20 7946 0991'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-black flex-shrink-0" />
                  <span>{settings.contactInfo?.email || 'concierge@vexivo.com'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs text-neutral-600">
              <h3 className="text-sm font-bold uppercase text-neutral-900">Hours of Operation</h3>
              <p>{settings.contactInfo?.hours || 'Monday – Saturday: 9:00 AM – 6:00 PM GMT'}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0D8756]/10 text-[#0D8756] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Message Dispatched</h3>
                <p className="text-xs text-neutral-500">
                  Thank you. A senior concierge officer will review your inquiry within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Eleanor Sterling"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Inquiry regarding Aethel headphones"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How may our concierge assist you today?..."
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-pill-dark w-full py-3 text-xs flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
