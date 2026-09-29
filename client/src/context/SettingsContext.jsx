import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const defaultSettings = {
  siteName: 'VEXIVO',
  logo: '',
  announcementText: '✨ FREE PAN-INDIA EXPRESS DELIVERY OVER ₹499 | USE CODE VEX10 FOR 10% OFF',
  announcements: [
    '✨ FREE PAN-INDIA EXPRESS DELIVERY OVER ₹499',
    '🔥 FESTIVE SEASON CAPSULE LIVE | USE CODE VEX10 FOR 10% OFF',
    '⭐ OVER 18,500+ VERIFIED 5-STAR REVIEWS ACROSS INDIA',
    '⚡ 7-DAY COMPLIMENTARY REPLACEMENTS & PREMIUM PACKAGING',
  ],
  contactInfo: {
    email: 'support@vexivo.com',
    phone: '+91 98765 43210',
    address: 'DLF Cyber City, Tower B, Gurugram, Haryana, 122002',
    hours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST',
  },
  freeShippingThreshold: 499,
  currency: '₹',
  currencyCode: 'INR',
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: false,
  refreshSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.settings.get();
      if (res.success && res.settings) {
        const s = res.settings;
        setSettings({
          siteName: s.siteName || defaultSettings.siteName,
          logo: s.logo || defaultSettings.logo,
          announcementText: s.announcementText || defaultSettings.announcementText,
          announcements:
            s.announcements && s.announcements.length > 0
              ? s.announcements
              : s.announcementText
              ? [s.announcementText]
              : defaultSettings.announcements,
          contactInfo: {
            email: s.contactInfo?.email || defaultSettings.contactInfo.email,
            phone: s.contactInfo?.phone || defaultSettings.contactInfo.phone,
            address: s.contactInfo?.address || defaultSettings.contactInfo.address,
            hours: s.contactInfo?.hours || defaultSettings.contactInfo.hours,
          },
          freeShippingThreshold:
            s.freeShippingThreshold !== undefined && s.freeShippingThreshold !== null
              ? Number(s.freeShippingThreshold)
              : defaultSettings.freeShippingThreshold,
          currency: defaultSettings.currency,
          currencyCode: defaultSettings.currencyCode,
        });
      }
    } catch (err) {
      console.warn('[SettingsContext] Failed to load site settings:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;
