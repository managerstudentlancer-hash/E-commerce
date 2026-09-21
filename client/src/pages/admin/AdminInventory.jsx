import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Plus,
  Minus,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, in, low, out

  // Stock edit tracking { [productId]: stockValue }
  const [editedStock, setEditedStock] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [stockFilter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (stockFilter !== 'all') params.stockStatus = stockFilter;
      const res = await api.inventory.getAll(params);
      if (res.success) {
        setInventory(res.products || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleStockChange = (productId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setEditedStock((prev) => ({ ...prev, [productId]: num }));
  };

  const handleStockStep = (productId, currentStock, step) => {
    const base = editedStock[productId] !== undefined ? editedStock[productId] : currentStock;
    const nextVal = Math.max(0, base + step);
    setEditedStock((prev) => ({ ...prev, [productId]: nextVal }));
  };

  const handleSaveStock = async (product) => {
    const newStock =
      editedStock[product._id] !== undefined ? editedStock[product._id] : product.stock;
    setSavingId(product._id);
    try {
      const res = await api.inventory.updateStock(product._id, newStock);
      if (res.success) {
        setInventory((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, stock: newStock } : p))
        );
        // Clear local edit state for this product
        setEditedStock((prev) => {
          const clone = { ...prev };
          delete clone[product._id];
          return clone;
        });
        showToast(`Stock updated for ${product.name} to ${newStock} units`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update stock');
    } finally {
      setSavingId(null);
    }
  };

  const filteredInventory = inventory.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Inventory & Stock Control
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor real-time stock levels, resolve shortages, and adjust warehouse inventory.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="btn-pill-light text-xs py-2 px-4 flex items-center space-x-1.5 self-start sm:self-auto font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Units In Stock
            </p>
            <p className="text-2xl font-black text-neutral-900 mt-1">
              {summary.totalUnits.toLocaleString()}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Low Stock Items
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">{summary.lowStockCount}</p>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">1 - 10 units left</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Out of Stock
            </p>
            <p className="text-2xl font-black text-[#C4301C] mt-1">{summary.outOfStockCount}</p>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">0 units remaining</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#C4301C] flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="flex-1 flex items-center space-x-3 bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/60">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or category..."
            className="w-full bg-transparent text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-neutral-400 hover:text-black font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Stock Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Stock' },
            { id: 'in', label: 'Healthy (>10)' },
            { id: 'low', label: 'Low (1-10)' },
            { id: 'out', label: 'Out of Stock' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                stockFilter === tab.id
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Stock Level & Quick Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-neutral-400">
                      No inventory items match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((prod) => {
                    const currentStock = prod.stock || 0;
                    const stagedStock =
                      editedStock[prod._id] !== undefined ? editedStock[prod._id] : currentStock;
                    const isDirty = editedStock[prod._id] !== undefined && editedStock[prod._id] !== currentStock;

                    let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                    let badgeLabel = 'In Stock';

                    if (stagedStock <= 0) {
                      badgeColor = 'bg-red-50 text-red-600 border-red-200/60';
                      badgeLabel = 'Out of Stock';
                    } else if (stagedStock <= 10) {
                      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200/60';
                      badgeLabel = 'Low Stock';
                    }

                    return (
                      <tr key={prod._id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.thumbnail || prod.images?.[0] || ''}
                              alt=""
                              className="w-10 h-10 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                              <span className="text-[10px] text-neutral-400 capitalize">{prod.status}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-600">
                          {prod.sku || 'NO-SKU'}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">{prod.category}</td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          £{prod.price?.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeColor}`}
                          >
                            {badgeLabel}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Step Controls */}
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, -5)}
                              className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition-colors"
                              title="Decrease stock by 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, -1)}
                              className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition-colors"
                              title="Decrease stock by 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            {/* Direct Input */}
                            <input
                              type="number"
                              min="0"
                              value={stagedStock}
                              onChange={(e) => handleStockChange(prod._id, e.target.value)}
                              className={`w-16 px-2 py-1.5 rounded-xl border text-center font-bold text-xs outline-none transition-colors ${
                                isDirty
                                  ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-2 ring-blue-100'
                                  : 'border-neutral-200 bg-white text-neutral-900 focus:border-black'
                              }`}
                            />

                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, 1)}
                              className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition-colors"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, 5)}
                              className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition-colors"
                              title="Increase stock by 5"
                            >
                              +5
                            </button>

                            {/* Save Button */}
                            {isDirty && (
                              <button
                                onClick={() => handleSaveStock(prod)}
                                disabled={savingId === prod._id}
                                className="btn-pill-dark text-xs py-1 px-3 flex items-center space-x-1 font-bold animate-fade-in"
                                title="Save updated stock level"
                              >
                                {savingId === prod._id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                                <span>Save</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
