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
  PoundSterling,
  X,
  CheckCircle2,
  AlertCircle,
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
            Customer Directory
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage buyer accounts, review lifetime spending, and monitor activity status.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Registered
            </p>
            <p className="text-2xl font-black text-neutral-900 mt-1">{customers.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Active Accounts
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Customer Lifetime Spend
            </p>
            <p className="text-2xl font-black text-neutral-900 mt-1">
              £{totalSpentAll.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <PoundSterling className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="flex-1 flex items-center space-x-3 bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/60">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email address, or phone..."
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

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
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
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-4">Orders</th>
                  <th className="py-4 px-4">Total Spent</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-400">
                      No customers match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const isCustActive = cust.isActive !== false;
                    return (
                      <tr key={cust._id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-neutral-950 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                              {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900">{cust.name}</p>
                              <p className="text-[11px] text-neutral-500">{cust.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-600">
                          {cust.phone || '—'}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {new Date(cust.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800">
                            {cust.totalOrders || 0} orders
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          £{cust.totalSpent?.toFixed(2) || '0.00'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isCustActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-red-50 text-red-600 border border-red-200/60'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCustActive ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <span>{isCustActive ? 'Active' : 'Deactivated'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleViewCustomer(cust)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                            title="View Customer Profile & Orders"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(cust)}
                            disabled={actionLoading === cust._id}
                            className={`p-1.5 rounded-xl border transition-colors ${
                              isCustActive
                                ? 'border-neutral-200 text-neutral-700 hover:border-red-500 hover:text-red-500'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={isCustActive ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {actionLoading === cust._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isCustActive ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white text-base font-black flex items-center justify-center">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Phone</p>
                <p className="font-semibold text-neutral-900 mt-0.5">
                  {selectedCustomer.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Joined Date</p>
                <p className="font-semibold text-neutral-900 mt-0.5">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Total Spent</p>
                <p className="font-bold text-neutral-900 mt-0.5">
                  £{selectedCustomer.totalSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Account Status</p>
                <p
                  className={`font-bold mt-0.5 ${
                    selectedCustomer.isActive !== false ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {selectedCustomer.isActive !== false ? 'Active' : 'Deactivated'}
                </p>
              </div>
            </div>

            {/* Order History Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                  Order History ({customerOrders.length})
                </h4>
              </div>

              {loadingOrders ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl">
                  This customer has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-neutral-900">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-neutral-200 text-neutral-700">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          • {ord.items?.length || 0} items
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-neutral-900">£{ord.total?.toFixed(2)}</p>
                        <span
                          className={`text-[10px] font-bold ${
                            ord.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
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
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedCustomer)}
                disabled={actionLoading === selectedCustomer._id}
                className={`btn-pill text-xs py-2.5 px-4 font-bold border transition-colors ${
                  selectedCustomer.isActive !== false
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {selectedCustomer.isActive !== false
                  ? 'Deactivate This Account'
                  : 'Activate This Account'}
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-pill-dark text-xs py-2.5 px-6 font-bold"
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
