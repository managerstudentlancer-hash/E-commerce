import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AddressBook = () => {
  const { user, updateProfile } = useAuth();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addresses = user?.addresses || [
    {
      street: '71-75 Shelton Street, Covent Garden',
      city: 'London',
      postalCode: 'WC2H 9JQ',
      country: 'United Kingdom',
      isDefault: true,
    },
  ];

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode) return;

    const newAddr = {
      street,
      city,
      postalCode,
      country: 'United Kingdom',
      isDefault: false,
    };

    try {
      await updateProfile({
        addresses: [...addresses, newAddr],
      });
      setSavedSuccess(true);
      setStreet('');
      setCity('');
      setPostalCode('');
      setShowAddForm(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
          <Link to="/account" className="hover:text-black">Account</Link>
          <span>/</span>
          <span className="text-black font-semibold">Addresses</span>
        </nav>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 uppercase tracking-tight">
            Saved Addresses
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-pill-dark text-xs py-2 px-4 flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-green-50 text-[#0D8756] text-xs font-bold mb-6 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Address saved successfully!</span>
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddAddress} className="mb-8 p-6 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold uppercase text-neutral-900">New Address</h3>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Flat 4B, 18 Regent Street"
                className="input-pill"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="London"
                  className="input-pill"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="SW1A 1AA"
                  className="input-pill"
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="submit" className="btn-pill-dark text-xs py-2.5 px-6">
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-pill-light text-xs py-2.5 px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-neutral-200 bg-white space-y-2 relative shadow-subtle"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900">
                <MapPin className="w-4 h-4 text-black" />
                <span>Address #{idx + 1}</span>
                {addr.isDefault && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black text-white">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-700 font-medium pt-1">{addr.street}</p>
              <p className="text-xs text-neutral-500">{addr.city}, {addr.postalCode}</p>
              <p className="text-xs text-neutral-500">{addr.country || 'United Kingdom'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
