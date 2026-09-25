import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Store,
  Mail,
  Phone,
  MapPin,
  Clock,
  Truck,
  CreditCard,
  UserCheck,
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Radio,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    siteName: 'VEXIVO',
    announcementText: '',
    contactEmail: 'concierge@vexivo.com',
    contactPhone: '+44 20 7946 0991',
    contactAddress: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
    contactHours: 'Monday - Saturday: 9:00 AM - 6:00 PM GMT',
    freeShippingThreshold: 50,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.settings.get();
      if (res.success && res.settings) {
        const s = res.settings;
        setFormData({
          siteName: s.siteName || 'VEXIVO',
          announcementText: s.announcementText || '',
          contactEmail: s.contactInfo?.email || 'concierge@vexivo.com',
          contactPhone: s.contactInfo?.phone || '+44 20 7946 0991',
          contactAddress: s.contactInfo?.address || '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
          contactHours: s.contactInfo?.hours || 'Monday - Saturday: 9:00 AM - 6:00 PM GMT',
          freeShippingThreshold: s.freeShippingThreshold !== undefined ? s.freeShippingThreshold : 50,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        siteName: formData.siteName,
        announcementText: formData.announcementText,
        contactInfo: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
          address: formData.contactAddress,
          hours: formData.contactHours,
        },
        freeShippingThreshold: Number(formData.freeShippingThreshold || 0),
      };

      const res = await api.settings.update(payload);
      if (res.success) {
        showToast('Store settings saved & synced to live storefront!');
        refreshSettings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 glow-emerald animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          System &amp; Live Storefront Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure real-time store identity, header branding, customer concierge lines, and checkout shipping rules.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Admin Profile Security Overview */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Active Administrator Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Superadmin Name</p>
              <p className="font-bold text-white mt-1">{user?.name || 'VEXIVO Administrator'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Authenticated Email</p>
              <p className="font-mono text-cyan-300 mt-1">{user?.email || 'admin@vexivo.com'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Security Privilege</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-1">
                MASTER ACCESS ({user?.role || 'admin'})
              </span>
            </div>
          </div>
        </div>

        {/* 2. Storefront Identity & Top Announcement Bar */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
            <Store className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Storefront Branding &amp; Top Ticker Announcement
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Brand Logo Text (Header &amp; Footer) *
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Top Announcement Bar Ticker *
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                placeholder="✨ FREE UK NEXT-DAY DELIVERY OVER £50 | CODE VEX10"
                className="w-full px-4 py-3 rounded-2xl admin-input"
              />
            </div>
          </div>
        </div>

        {/* 3. Customer Concierge & Support Channels */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
            <Mail className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Client Support &amp; Concierge Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Concierge Support Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Concierge Direct Phone Line
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Registered London Office Address
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl admin-input"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Operating Hours (GMT)
              </label>
              <input
                type="text"
                value={formData.contactHours}
                onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl admin-input"
              />
            </div>
          </div>
        </div>

        {/* 4. Shipping & Payment Gateways */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
            <Truck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Logistics Rules &amp; Payment Gateway Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Free UK Next-Day Delivery Threshold (£)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Subtotals exceeding this amount automatically receive complimentary next-day courier dispatch.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold uppercase text-slate-300 mb-1.5">
                Active Payment Gateways
              </label>
              <div className="space-y-2">
                <div className="p-3 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Stripe Credit &amp; Debit Cards</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Sandbox
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Cash on Delivery (COD)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
            <span>{saving ? 'Synchronizing Store Settings...' : 'Save & Sync Live Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
