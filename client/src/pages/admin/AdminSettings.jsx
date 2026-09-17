import React, { useState, useEffect } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import api from '../../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'VEXIVO',
    announcementText: '',
    freeShippingThreshold: 50,
    contactEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.settings.get()
      .then((res) => {
        if (res.success && res.settings) {
          setSettings({
            siteName: res.settings.siteName || 'VEXIVO',
            announcementText: res.settings.announcementText || '',
            freeShippingThreshold: res.settings.freeShippingThreshold || 50,
            contactEmail: res.settings.contactInfo?.email || 'arpit123@gmail.com',
            contactPhone: res.settings.contactInfo?.phone || '+44 20 7946 0991',
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.settings.update({
        siteName: settings.siteName,
        announcementText: settings.announcementText,
        freeShippingThreshold: Number(settings.freeShippingThreshold),
        contactInfo: {
          email: settings.contactEmail,
          phone: settings.contactPhone,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          Global Store Settings
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure site-wide parameters, top announcement ticker text, and shipping rules.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 text-[#0D8756] text-xs font-bold flex items-center space-x-2 border border-green-200">
          <Check className="w-4 h-4" />
          <span>Settings saved and applied across storefront!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-5 text-xs">
        <div>
          <label className="block font-bold uppercase text-neutral-700 mb-1">
            Storefront Brand Name
          </label>
          <input
            type="text"
            required
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="input-pill"
          />
        </div>

        <div>
          <label className="block font-bold uppercase text-neutral-700 mb-1">
            Top Announcement Bar Ticker Text
          </label>
          <input
            type="text"
            value={settings.announcementText}
            onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
            placeholder="✨ FREE UK NEXT-DAY DELIVERY OVER £50 | USE CODE VEX10"
            className="input-pill"
          />
        </div>

        <div>
          <label className="block font-bold uppercase text-neutral-700 mb-1">
            Free Shipping Threshold (£)
          </label>
          <input
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
            className="input-pill"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Orders exceeding this amount automatically unlock complimentary tracked UK delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">
              Concierge Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="input-pill"
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">
              Concierge Phone
            </label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="input-pill"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-pill-dark py-3 px-8 text-xs flex items-center space-x-2"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
