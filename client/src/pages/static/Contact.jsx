import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, MessageSquare, Headphones, MessageCircle, Clock, Loader2, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const Contact = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'General Inquiry',
    orderNumber: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await api.support.submitInquiry(form);
      if (res.success) {
        setTicketResult(res.ticket);
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactPhone = settings?.contactInfo?.phone || '+91 80000 12345';
  const contactEmail = settings?.contactInfo?.email || 'concierge@vexivo.com';
  const contactWhatsapp = settings?.contactInfo?.whatsapp || '+91 98765 43210';
  const contactHours = settings?.contactInfo?.hours || '24/7 Round-the-Clock Support (Always Available)';
  const contactAddress = settings?.contactInfo?.address || 'Connaught Place, Central Delhi, New Delhi 110001, India';

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#C4301C] text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" />
            <span>24*7 CLIENT CONCIERGE DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Contact {settings?.siteName || 'VEXIVO'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Our 24/7 client concierge team is on standby for styling assistance, priority order tracking, bespoke wedding curations, and instant exchanges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 24/7 Contact Channels */}
          <div className="lg:col-span-5 space-y-5">
            {/* Direct 24/7 Channels Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 text-white space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>24/7 Live Assistance</span>
                </h3>
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AGENTS ONLINE</span>
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Helpline Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-rose-300 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block">Toll-Free Helpline</span>
                    <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-rose-300 transition-colors text-sm">
                      {contactPhone}
                    </a>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-rose-300 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block">Concierge Email</span>
                    <a href={`mailto:${contactEmail}`} className="font-bold text-white hover:text-rose-300 transition-colors">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Chat Link */}
                {contactWhatsapp && (
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-300 block">WhatsApp Priority Hotline</span>
                      <a
                        href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-300 hover:text-white transition-colors flex items-center space-x-1"
                      >
                        <span>{contactWhatsapp}</span>
                        <span className="text-[10px] bg-emerald-400/20 px-1.5 py-0.2 rounded text-emerald-300 ml-1">Chat Now</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Operating Schedule */}
                <div className="flex items-start space-x-3.5 pt-2 border-t border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block">Service Schedule</span>
                    <p className="text-neutral-200 font-medium">{contactHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered Desk Box */}
            <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center space-x-2 text-neutral-900 font-bold uppercase text-xs">
                <MapPin className="w-4 h-4 text-[#C4301C]" />
                <span>Concierge Desk &amp; Office</span>
              </div>
              <p className="text-neutral-600 leading-relaxed pl-6">{contactAddress}</p>
            </div>
          </div>

          {/* Right Column: Contact & Ticket Submission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      INQUIRY LOGGED IN 24/7 QUEUE
                    </span>
                    <h3 className="text-xl font-black text-neutral-900 mt-2">
                      Inquiry Dispatched Successfully
                    </h3>
                    {ticketResult?.ticketNumber && (
                      <p className="text-xs font-mono font-bold text-rose-600 mt-1">
                        Tracking Reference: {ticketResult.ticketNumber}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-neutral-800">{form.name}</strong>. A senior customer support officer has received your request and will respond directly to <strong className="text-neutral-800">{form.email}</strong> shortly.
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        category: 'General Inquiry',
                        orderNumber: '',
                        message: '',
                      });
                    }}
                    className="btn-pill-dark px-6 py-2.5 text-xs font-bold mt-2"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                      Send a Direct Message
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Fill in the details below. Requests are routed instantly to our live admin support team.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="input-pill w-full"
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
                        className="input-pill w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="input-pill w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full border border-neutral-200 text-xs bg-white focus:outline-none focus:border-black"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Issue">Order Tracking &amp; Delivery</option>
                        <option value="Return/Refund">Return / Exchange Request</option>
                        <option value="Payment Issue">Payment &amp; Coupon Codes</option>
                        <option value="Product Issue">Product Details &amp; Sizing</option>
                        <option value="24/7 Support">24/7 Urgent Concierge</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="e.g. Saree delivery timeline inquiry"
                        className="input-pill w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Order Number (if applicable)
                      </label>
                      <input
                        type="text"
                        value={form.orderNumber}
                        onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                        placeholder="e.g. ORD-12345"
                        className="input-pill w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How may our 24/7 customer concierge assist you today?..."
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-pill-dark w-full py-3 text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit to 24/7 Support Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
