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
  Sparkles,
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
    <div className="space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 glow-emerald animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Inventory &amp; Warehouse Stock Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-warehouse inventory levels with quick increment &amp; decrement adjustments.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Stock Data</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Catalog Inventory
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
              {summary.totalUnits.toLocaleString()} units
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 glow-cyan">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Low Stock Warnings
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
              {summary.lowStockCount} items
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">1 - 10 units left</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 glow-amber">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Out of Stock Emergency
            </p>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 font-mono">
              {summary.outOfStockCount} items
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">0 units remaining</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 glow-rose">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card p-4 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="flex-1 flex items-center space-x-3 bg-slate-900/60 px-4 py-3 rounded-2xl border border-white/10">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title, SKU code, or department..."
            className="w-full bg-transparent text-xs outline-none text-white placeholder-slate-500 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-slate-400 hover:text-white font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Stock Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Stock' },
            { id: 'in', label: 'Healthy (>10)' },
            { id: 'low', label: 'Low (1-10)' },
            { id: 'out', label: 'Out of Stock' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                stockFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Auditing warehouse inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product Item</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4">Price (₹)</th>
                  <th className="py-4 px-4">Stock Status</th>
                  <th className="py-4 px-6 text-right">Rapid Warehouse Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400 text-xs">
                      No inventory items match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((prod) => {
                    const currentStock = prod.stock || 0;
                    const stagedStock =
                      editedStock[prod._id] !== undefined ? editedStock[prod._id] : currentStock;
                    const isDirty = editedStock[prod._id] !== undefined && editedStock[prod._id] !== currentStock;

                    let badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                    let badgeLabel = 'In Stock';

                    if (stagedStock <= 0) {
                      badgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                      badgeLabel = 'Out of Stock';
                    } else if (stagedStock <= 10) {
                      badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                      badgeLabel = 'Low Stock';
                    }

                    return (
                      <tr key={prod._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3.5">
                            <img
                              src={prod.thumbnail || prod.images?.[0] || ''}
                              alt=""
                              className="w-11 h-11 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                                {prod.name}
                              </p>
                              <span className="text-[10px] text-slate-400 capitalize">{prod.status}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-400">
                          {prod.sku || 'NO-SKU'}
                        </td>

                        <td className="py-4 px-4 text-slate-300">
                          <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 font-bold">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-white font-mono">
                          ₹{prod.price?.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono ${badgeColor}`}
                          >
                            {badgeLabel}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Step Controls */}
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, -5)}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 font-mono text-xs font-bold"
                              title="Decrease stock by 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, -1)}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
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
                              className={`w-16 px-2 py-1.5 rounded-xl border text-center font-mono font-bold text-xs outline-none transition-all ${
                                isDirty
                                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/30'
                                  : 'border-white/10 bg-slate-900 text-white focus:border-cyan-400'
                              }`}
                            />

                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, 1)}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleStockStep(prod._id, currentStock, 5)}
                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 font-mono text-xs font-bold"
                              title="Increase stock by 5"
                            >
                              +5
                            </button>

                            {/* Save Button */}
                            {isDirty && (
                              <button
                                onClick={() => handleSaveStock(prod)}
                                disabled={savingId === prod._id}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-md shadow-cyan-500/20 animate-fade-in"
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
