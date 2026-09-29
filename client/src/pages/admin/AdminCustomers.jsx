import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Eye,
  Loader2,
  Calendar,
  Mail,
  Phone,
  ShoppingBag,
  IndianRupee,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  // Customer Details Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await api.customers.getAll(params);
      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleStatus = async (customer) => {
    setActionLoading(customer._id);
    try {
      const nextStatus = !customer.isActive;
      const res = await api.customers.updateStatus(customer._id, nextStatus);
      if (res.success) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === customer._id ? { ...c, isActive: nextStatus } : c))
        );
        if (selectedCustomer && selectedCustomer._id === customer._id) {
          setSelectedCustomer((prev) => ({ ...prev, isActive: nextStatus }));
        }
        showToast(
          `Customer ${customer.name} ${nextStatus ? 'activated' : 'deactivated'} successfully`
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update customer status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingOrders(true);
    try {
      const res = await api.customers.getById(cust._id);
      if (res.success) {
        setSelectedCustomer(res.customer);
        setCustomerOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)
    );
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const activeCount = customers.filter((c) => c.isActive !== false).length;

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
            Customer Directory &amp; Client Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit registered accounts, review lifetime spending volume, and manage account access privileges.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Registered Clients
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{customers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 glow-cyan">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Active Buyers
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">{activeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 glow-emerald">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Lifetime Spend Volume
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
              ₹{totalSpentAll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="admin-card p-4 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="flex-1 flex items-center space-x-3 bg-slate-900/60 px-4 py-3 rounded-2xl border border-white/10">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email address, or phone..."
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

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying customer accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-4">Orders</th>
                  <th className="py-4 px-4">Total Spent (₹)</th>
                  <th className="py-4 px-4">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 text-xs">
                      No customer accounts match your search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const isCustActive = cust.isActive !== false;
                    return (
                      <tr key={cust._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                              {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {cust.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{cust.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-300">
                          {cust.phone || '—'}
                        </td>

                        <td className="py-4 px-4 text-slate-400 font-mono">
                          {new Date(cust.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-slate-200">
                            {cust.totalOrders || 0} orders
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-emerald-400 font-mono text-sm">
                          ₹{cust.totalSpent?.toFixed(2) || '0.00'}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              isCustActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCustActive ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{isCustActive ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleViewCustomer(cust)}
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                            title="View Customer Profile & Orders"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(cust)}
                            disabled={actionLoading === cust._id}
                            className={`p-2 rounded-xl border transition-colors ${
                              isCustActive
                                ? 'bg-white/5 border-white/10 text-slate-400 hover:border-rose-500/40 hover:text-rose-400'
                                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                            title={isCustActive ? 'Suspend Account' : 'Reactivate Account'}
                          >
                            {actionLoading === cust._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isCustActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
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

      {/* Customer Details & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setSelectedCustomer(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 text-base font-black flex items-center justify-center">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                <p className="font-semibold text-white mt-1 font-mono">
                  {selectedCustomer.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Joined</p>
                <p className="font-semibold text-white mt-1 font-mono">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent</p>
                <p className="font-black text-emerald-400 mt-1 font-mono">
                  ₹{selectedCustomer.totalSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p
                  className={`font-black mt-1 uppercase text-[10px] ${
                    selectedCustomer.isActive !== false ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedCustomer.isActive !== false ? 'Active' : 'Suspended'}
                </p>
              </div>
            </div>

            {/* Order History Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                Order History Records ({customerOrders.length})
              </h4>

              {loadingOrders ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl">
                  This client has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-cyan-300">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/5 border border-white/10 text-slate-300">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          • {ord.items?.length || 0} items
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-emerald-400 font-mono text-sm">
                          ₹{ord.total?.toFixed(2)}
                        </p>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedCustomer)}
                disabled={actionLoading === selectedCustomer._id}
                className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-colors ${
                  selectedCustomer.isActive !== false
                    ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                    : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
                }`}
              >
                {selectedCustomer.isActive !== false
                  ? 'Suspend Account Access'
                  : 'Reactivate Account'}
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
