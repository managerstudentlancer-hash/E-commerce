import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const defaultSettings = {
  siteName: 'VEXIVO',
  logo: '',
  announcementText: '✨ FREE UK NEXT-DAY DELIVERY OVER £50 | USE CODE VEX10 FOR 10% OFF',
  announcements: [
    '✨ FREE UK NEXT-DAY DELIVERY OVER £50',
    '🔥 SPRING / SUMMER CAPSULE LIVE | USE CODE VEX10 FOR 10% OFF',
    '⭐ OVER 18,500+ VERIFIED 5-STAR REVIEWS ACROSS THE UK',
    '⚡ 30-DAY COMPLIMENTARY RETURNS & BESPOKE PACKAGING',
  ],
  contactInfo: {
    email: 'concierge@vexivo.com',
    phone: '+44 20 7946 0991',
    address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
    hours: 'Monday - Saturday: 9:00 AM - 6:00 PM GMT',
  },
  freeShippingThreshold: 50,
  currency: '£',
  currencyCode: 'GBP',
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
