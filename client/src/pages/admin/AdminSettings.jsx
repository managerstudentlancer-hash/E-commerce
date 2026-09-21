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
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
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
        showToast('Store & System settings saved successfully!');
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
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          System & Store Settings
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure administrator credentials, store identity, customer support channels, and shipping thresholds.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Admin Profile Overview */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-neutral-100">
            <UserCheck className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Active Administrator Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Admin Name</p>
              <p className="font-bold text-neutral-900 mt-0.5">{user?.name || 'VEXIVO Superadmin'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Authenticated Email</p>
              <p className="font-semibold text-neutral-700 mt-0.5">{user?.email || 'admin@vexivo.com'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Role Privilege</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C4301C] text-white mt-0.5">
                FULL ACCESS ({user?.role || 'admin'})
              </span>
            </div>
          </div>
        </div>

        {/* 2. Store Identity */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-neutral-100">
            <Store className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Storefront Identity & Banner Announcement
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Store Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="input-pill"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                placeholder="✨ FREE UK NEXT-DAY DELIVERY OVER £50"
                className="input-pill"
              />
            </div>
          </div>
        </div>

        {/* 3. Customer Contact & Support */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-neutral-100">
            <Mail className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Store Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Concierge Support Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="input-pill"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Support Phone Line
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="input-pill"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Registered Physical Address
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                className="input-pill"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Operating Hours (GMT)
              </label>
              <input
                type="text"
                value={formData.contactHours}
                onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                className="input-pill"
              />
            </div>
          </div>
        </div>

        {/* 4. Basic Shipping & Payment Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-neutral-100">
            <Truck className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Shipping & Gateway Configuration Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">
                Free UK Next-Day Delivery Threshold (£)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: e.target.value })
                }
                className="input-pill"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Cart subtotals above this amount receive automatic complimentary shipping.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold uppercase text-neutral-700">
                Payment Gateways Status
              </label>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="font-semibold text-neutral-800">Stripe Card Terminal</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700">
                    Live Demo Ready
                  </span>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="font-semibold text-neutral-800">Cash on Delivery (COD)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700">
                    Active
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
            className="btn-pill-dark py-3 px-8 text-xs font-bold flex items-center space-x-2 shadow-lg"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving System Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
