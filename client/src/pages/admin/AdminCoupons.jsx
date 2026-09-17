import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Check, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minimumOrder: 0,
    maximumDiscount: 50,
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.coupons.getAll();
      if (res.success) setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) return;

    try {
      await api.coupons.create(formData);
      setIsModalOpen(false);
      setFormData({
        code: '',
        type: 'percentage',
        value: 10,
        minimumOrder: 0,
        maximumDiscount: 50,
        active: true,
      });
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.coupons.delete(id);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Promotional Coupons
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create discount codes, flash vouchers, and spending thresholds.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Promo Code</th>
                  <th className="py-4 px-4">Discount</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Min. Spend</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {coupons.map((coup) => (
                  <tr key={coup._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-6 font-mono font-bold text-neutral-900">
                      <span className="bg-neutral-100 px-3 py-1 rounded-full">{coup.code}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0D8756]">
                      {coup.type === 'percentage' ? `${coup.value}% OFF` : `£${coup.value} OFF`}
                    </td>
                    <td className="py-3 px-4 capitalize">{coup.type}</td>
                    <td className="py-3 px-4">£{coup.minimumOrder || 0}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          coup.active ? 'bg-green-50 text-[#0D8756]' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {coup.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleDelete(coup._id)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:text-red-600 hover:border-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 z-10 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Create New Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="input-pill uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-neutral-200 bg-white font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="input-pill"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Minimum Order (£)</label>
                <input
                  type="number"
                  value={formData.minimumOrder}
                  onChange={(e) => setFormData({ ...formData, minimumOrder: Number(e.target.value) })}
                  className="input-pill"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pill-light py-2 px-5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-pill-dark py-2 px-6">
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
