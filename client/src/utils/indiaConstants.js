/**
 * India Localization Constants & Helpers
 */

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Andaman and Nicobar Islands',
  'Lakshadweep',
];

export const isValidIndianPin = (pin) => {
  return /^[1-9][0-9]{5}$/.test(String(pin || '').trim());
};

export const isValidIndianPhone = (phone) => {
  const cleaned = String(phone || '').replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};
