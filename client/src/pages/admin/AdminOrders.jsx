import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  RotateCcw,
  Ban,
  User,
  MapPin,
  IndianRupee,
  CreditCard,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Boxes,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

const LOGISTICS_MILESTONES = [
  { key: 'pending', label: 'Order Placed', shortLabel: 'Placed' },
  { key: 'confirmed', label: 'Confirmed', shortLabel: 'Confirmed' },
  { key: 'processing', label: 'Seller Processing', shortLabel: 'Packed' },
  { key: 'picked_up', label: 'Parcel Picked Up', shortLabel: 'Picked Up' },
  { key: 'warehouse_received', label: 'Warehouse Inbound', shortLabel: 'Warehouse' },
  { key: 'scanned', label: 'Scanned & Verified', shortLabel: 'Scanned' },
  { key: 'sorted', label: 'Sorted by Hub', shortLabel: 'Sorted' },
  { key: 'dispatched_from_warehouse', label: 'Dispatched to Hub', shortLabel: 'Dispatched' },
  { key: 'hub_received', label: 'Delivery Hub Inbound', shortLabel: 'Hub' },
  { key: 'ready_for_delivery', label: 'Ready For Delivery', shortLabel: 'Staged' },
  { key: 'delivery_partner_assigned', label: 'Agent Assigned', shortLabel: 'Assigned' },
  { key: 'out_for_delivery', label: 'Out For Delivery', shortLabel: 'Out for Deliv' },
  { key: 'delivered', label: 'Delivered', shortLabel: 'Delivered' },
];

const getMilestoneIndex = (status) => {
  const norm = (status || '').toLowerCase().trim();
  if (norm === 'pending') return 0;
  if (norm === 'confirmed') return 1;
  if (norm === 'processing') return 2;
  if (norm === 'ready_for_pickup' || norm === 'picked_up') return 3;
  if (norm === 'warehouse_received') return 4;
  if (norm === 'scanned') return 5;
  if (norm === 'sorted') return 6;
  if (norm === 'dispatched_from_warehouse' || norm === 'shipped') return 7;
  if (norm === 'hub_received') return 8;
  if (norm === 'ready_for_delivery') return 9;
  if (norm === 'delivery_partner_assigned') return 10;
  if (norm === 'out_for_delivery') return 11;
  if (norm === 'delivered') return 12;
  return 1;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  // Delivery Partner Assignment State
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [assigningPartner, setAssigningPartner] = useState(false);

  useEffect(() => {
    fetchOrders();
    api.adminLogistics.getDeliveryPartners()
      .then((res) => {
        if (res.success) setDeliveryPartners(res.partners || []);
      })
      .catch(() => {});
  }, [statusFilter]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.orders.getAll(params);
      if (res.success) {
        setOrders(res.orders || []);
        if (res.statusCounts) setStatusCounts(res.statusCounts);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setTrackingNumberInput(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (newOrderStatus, newPaymentStatus = null) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const payload = {
        orderStatus: newOrderStatus,
        trackingNumber: trackingNumberInput,
      };
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const res = await api.orders.updateStatus(selectedOrder._id, payload);
      if (res.success) {
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.order : o))
        );
        showToast(`Order status updated to ${newOrderStatus.toUpperCase()}`);
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order and replenish its inventory?')) return;
    await handleUpdateStatus('cancelled');
  };

  const handleProcessRefund = async () => {
    if (!window.confirm('Process full refund and mark order as RETURNED & REFUNDED?')) return;
    await handleUpdateStatus('returned', 'refunded');
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder) return;
    try {
      const res = await api.orders.verifyPayment(selectedOrder._id);
      if (res.success) {
        showToast('Payment verified & approved as PAID successfully!');
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.order : o))
        );
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Payment verification failed');
    }
  };

  const handleAssignDeliveryPartner = async () => {
    if (!selectedOrder || !selectedPartnerId) {
      showToast('Please select a delivery partner from the dropdown');
      return;
    }
    try {
      setAssigningPartner(true);
      const res = await api.adminLogistics.assignDeliveryPartner(selectedOrder._id, selectedPartnerId);
      if (res.success) {
        showToast(res.message);
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.order : o))
        );
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign delivery partner');
    } finally {
      setAssigningPartner(false);
    }
  };

  const handleAutoAssignDeliveryPartner = async () => {
    if (!selectedOrder) return;
    try {
      setAssigningPartner(true);
      const res = await api.adminLogistics.autoAssign(selectedOrder._id);
      if (res.success) {
        showToast(res.message);
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.order : o))
        );
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Auto-assignment failed');
    } finally {
      setAssigningPartner(false);
    }
  };

  // COD Reconciliation State & Operations
  const [showCodModal, setShowCodModal] = useState(false);
  const [codData, setCodData] = useState(null);
  const [loadingCod, setLoadingCod] = useState(false);
  const [settlingPartnerId, setSettlingPartnerId] = useState(null);

  const fetchCodReconciliation = async () => {
    try {
      setLoadingCod(true);
      const res = await api.adminLogistics.getCodReconciliation();
      if (res.success) {
        setCodData(res);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch COD reconciliation');
    } finally {
      setLoadingCod(false);
    }
  };

  const handleSettleCod = async (partnerId) => {
    try {
      setSettlingPartnerId(partnerId);
      const res = await api.adminLogistics.settleCod(partnerId);
      if (res.success) {
        showToast(res.message);
        fetchCodReconciliation();
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Settlement failed');
    } finally {
      setSettlingPartnerId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(term) ||
      o.guestEmail?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term) ||
      o.user?.email?.toLowerCase().includes(term) ||
      o.shippingAddress?.firstName?.toLowerCase().includes(term) ||
      o.shippingAddress?.lastName?.toLowerCase().includes(term) ||
      o.shippingAddress?.phone?.toLowerCase().includes(term) ||
      o.trackingNumber?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'out_for_delivery':
      case 'delivery_partner_assigned':
      case 'ready_for_delivery':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse';
      case 'dispatched_from_warehouse':
      case 'shipped':
      case 'hub_received':
      case 'sorted':
      case 'scanned':
      case 'warehouse_received':
      case 'picked_up':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'processing':
      case 'confirmed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'cancelled':
      case 'returned':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast */}
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
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Process client orders, dispatch courier tracking numbers, and manage returns & refunds.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setShowCodModal(true);
              fetchCodReconciliation();
            }}
            className="px-4 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            title="View fleet Cash on Delivery (COD) cash in hand and settle deposits"
          >
            <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
            <span>COD Settlement</span>
          </button>

          <button
            onClick={fetchOrders}
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Orders</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs Bar */}
      <div className="admin-card p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'All Orders', count: statusCounts.all },
          { id: 'pending', label: 'Pending', count: statusCounts.pending },
          { id: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          { id: 'processing', label: 'Processing', count: statusCounts.processing },
          { id: 'shipped', label: 'Shipped', count: statusCounts.shipped },
          { id: 'out_for_delivery', label: 'Out for Delivery', count: statusCounts.out_for_delivery },
          { id: 'delivered', label: 'Delivered', count: statusCounts.delivered },
          { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
          { id: 'returned', label: 'Returned', count: statusCounts.returned },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
              statusFilter === tab.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  statusFilter === tab.id ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="admin-card p-4 rounded-3xl flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order #, customer name, email address, tracking #..."
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

      {/* Orders Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying order fulfillment...</p>
          </div>
        ) : (
          <div>
            {/* Mobile Orders Card View (Screens < md) */}
            <div className="md:hidden divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No customer orders found matching this filter criteria.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord._id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-cyan-300 text-xs">{ord.orderNumber}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusBadge(ord.orderStatus)}`}>
                          {ord.orderStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="font-black text-emerald-400 font-mono text-sm">
                        ₹{ord.total?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div>
                        <p className="font-bold text-white text-xs">
                          {ord.shippingAddress?.firstName
                            ? `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName || ''}`
                            : ord.user?.name || 'Direct Buyer'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-300 font-medium">
                          {ord.items?.length || 0} item(s)
                        </span>
                        <div className="mt-0.5">
                          <span className={`inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Partner Assignment & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <div className="flex items-center space-x-1.5 text-[11px]">
                        {ord.deliveryPartnerName ? (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[130px]">{ord.deliveryPartnerName}</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Unassigned
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenOrder(ord)}
                        className="px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center space-x-1 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View (Screens >= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Amount (₹)</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Fulfillment Status</th>
                  <th className="py-4 px-4">Assigned Partner</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-16 text-center text-slate-400 text-xs">
                      No customer orders found matching this filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-cyan-300">
                        <div className="flex items-center space-x-1.5">
                          <span>{ord.orderNumber}</span>
                          {((ord.orderStatus === 'pending' || ord.orderStatus === 'processing') && (new Date() - new Date(ord.createdAt) > 24 * 3600 * 1000)) && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans font-bold uppercase" title="SLA Alert: Pending fulfillment >24h">
                              SLA Alert
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white">
                          {ord.shippingAddress?.firstName
                            ? `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName || ''}`
                            : ord.user?.name || 'Direct Buyer'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ord.user?.email || ord.guestEmail || 'N/A'}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-300 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
                          {ord.items?.length || 0} items
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-emerald-400 font-mono text-sm">
                        ₹{ord.total?.toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ord.paymentStatus === 'refunded'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {ord.deliveryPartnerName ? (
                          <div className="flex flex-col space-y-0.5">
                            <span className="font-bold text-white flex items-center space-x-1.5">
                              <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="truncate max-w-[130px] font-sans">{ord.deliveryPartnerName}</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono capitalize">
                              {ord.deliveryDetails?.deliveryStatus?.replace('_', ' ') || 'Assigned'}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

      {/* Order Details Modal with Live Progression Timeline */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-3xl bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-black text-white font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* COMPLETE SHIPMENT LIFECYCLE (13 Stages + View Audit Trail) */}
            {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'returned' ? (
              <div className="bg-white text-neutral-900 p-4 sm:p-6 rounded-2xl border border-neutral-200/90 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                      <Boxes className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                        <span>COMPLETE SHIPMENT LIFECYCLE</span>
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Click any stage card to advance or update order status
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Stage {getMilestoneIndex(selectedOrder.orderStatus) + 1} of 13
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAuditTrail(!showAuditTrail)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                    >
                      <span>{showAuditTrail ? 'Hide History' : 'View Audit Trail'}</span>
                      {showAuditTrail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 13-Stage Responsive Stepper Cards Grid (Matching User Reference Image) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                  {LOGISTICS_MILESTONES.map((step, idx) => {
                    const currentStageIdx = getMilestoneIndex(selectedOrder.orderStatus);
                    const isCompleted = currentStageIdx > idx;
                    const isCurrent = currentStageIdx === idx;

                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() => handleUpdateStatus(step.key)}
                        disabled={updatingStatus}
                        title={`Click to update order status to ${step.label}`}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? 'border-emerald-500 bg-emerald-50/90 shadow-sm ring-2 ring-emerald-500/20'
                            : isCompleted
                            ? 'border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100/60'
                            : 'border-dashed border-neutral-200 bg-white opacity-60 hover:opacity-100 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              isCurrent
                                ? 'bg-emerald-600 text-white animate-pulse'
                                : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {isCompleted || isCurrent ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className={`font-bold text-[11px] leading-tight ${isCurrent ? 'text-emerald-950 font-extrabold' : 'text-neutral-800'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {isCurrent ? 'In progress' : isCompleted ? 'Passed' : 'Upcoming'}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Expandable Audit Trail Logs */}
                {showAuditTrail && (
                  <div className="pt-3 border-t border-neutral-100 space-y-2.5 animate-fade-in">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                      Verified Logistics Checkpoint Logs:
                    </h5>
                    <div className="relative pl-6 space-y-3 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
                      {((selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0)
                        ? selectedOrder.trackingHistory
                        : [
                            {
                              status: 'ORDER_PLACED',
                              message: 'Order created and payment mode confirmed.',
                              timestamp: selectedOrder.createdAt,
                              location: `${selectedOrder.shippingAddress?.city || 'Jaipur'}, Regional Logistics Hub`,
                              actor: 'Customer / Checkout System',
                            },
                            ...(selectedOrder.orderStatus !== 'pending' ? [{
                              status: 'ORDER_CONFIRMED',
                              message: 'Order verified and confirmed for warehouse fulfillment.',
                              timestamp: selectedOrder.createdAt,
                              location: `${selectedOrder.shippingAddress?.city || 'Jaipur'}, Regional Logistics Hub`,
                              actor: 'Admin / Order Automation',
                            }] : []),
                          ]
                      ).map((ev, i) => (
                        <div key={i} className="relative text-xs">
                          <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/70">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                              <span className="font-extrabold text-neutral-900">{ev.status || 'CHECKPOINT'}</span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                {new Date(ev.timestamp || Date.now()).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-neutral-600 text-[11px]">{ev.message}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-neutral-400">
                              <span>📍 Location: {ev.facility || ev.location || `${selectedOrder.shippingAddress?.city || 'Jaipur'} Logistics Facility`}</span>
                              <span>•</span>
                              <span>Actor: {ev.actor || 'Logistics Admin'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>
                  This order is marked as <strong className="uppercase">{selectedOrder.orderStatus}</strong>. Reserved inventory units have been automatically released.
                </span>
              </div>
            )}

            {/* Quick Status Update Selector */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <div className="flex items-center space-x-2.5">
                <label className="text-xs font-bold uppercase text-slate-300">Change Status:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 font-bold text-xs text-white focus:border-cyan-400 uppercase"
                >
                  <option value="pending">1. PENDING (ORDER PLACED)</option>
                  <option value="confirmed">2. CONFIRMED</option>
                  <option value="processing">3. SELLER PROCESSING</option>
                  <option value="picked_up">4. PARCEL PICKED UP</option>
                  <option value="warehouse_received">5. WAREHOUSE INBOUND</option>
                  <option value="scanned">6. SCANNED & VERIFIED</option>
                  <option value="sorted">7. SORTED BY HUB</option>
                  <option value="dispatched_from_warehouse">8. DISPATCHED TO HUB (SHIPPED)</option>
                  <option value="hub_received">9. DELIVERY HUB INBOUND</option>
                  <option value="ready_for_delivery">10. READY FOR DELIVERY</option>
                  <option value="delivery_partner_assigned">11. AGENT ASSIGNED</option>
                  <option value="out_for_delivery">12. OUT FOR DELIVERY</option>
                  <option value="delivered">13. DELIVERED</option>
                  <option value="cancelled">CANCELLED</option>
                  <option value="returned">RETURNED</option>
                </select>
              </div>

              {/* Tracking Number Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Royal Mail / DPD Tracking #"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="px-3.5 py-2 rounded-xl admin-input text-xs font-mono w-48"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.orderStatus)}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20"
                >
                  {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Contact</span>
                </p>
                <p className="font-bold text-white text-sm">
                  {selectedOrder.shippingAddress?.firstName}{' '}
                  {selectedOrder.shippingAddress?.lastName}
                </p>
                <p className="text-slate-300 font-mono">
                  {selectedOrder.user?.email || selectedOrder.guestEmail}
                </p>
                <p className="text-slate-400 font-mono">
                  {selectedOrder.shippingAddress?.phone || 'No phone supplied'}
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dispatch Address</span>
                </p>
                <p className="font-semibold text-slate-200">
                  {selectedOrder.shippingAddress?.address}
                </p>
                <p className="text-slate-300">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-slate-400">
                  {selectedOrder.shippingAddress?.country || 'India'}
                </p>
              </div>
            </div>

            {/* Logistics & Delivery Partner Assignment */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Fleet Dispatch & Logistics
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {selectedOrder.deliveryDetails?.deliveryStatus || 'Unassigned'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Delivery Partner:</span>
                    {selectedOrder.deliveryPartnerName && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Area Assigned ✓
                      </span>
                    )}
                  </div>
                  <p className="font-black text-white text-sm flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{selectedOrder.deliveryPartnerName || 'No Rider Assigned Yet'}</span>
                  </p>
                  {selectedOrder.deliveryPartnerPhone && (
                    <p className="text-[11px] font-mono text-emerald-300">
                      Rider Phone: +91 {selectedOrder.deliveryPartnerPhone}
                    </p>
                  )}
                  {selectedOrder.shippingAddress?.city && (
                    <p className="text-[10px] text-slate-400">
                      Target Delivery Zone: {selectedOrder.shippingAddress?.city} ({selectedOrder.shippingAddress?.postalCode || 'Jaipur'})
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Verification OTPs</span>
                  <div className="flex sm:justify-end gap-2 text-[11px] font-mono">
                    <span className="bg-amber-950/40 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                      Pickup: <strong>{selectedOrder.deliveryDetails?.pickupOtp || '4921'}</strong>
                    </span>
                    <span className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
                      Delivery: <strong>{selectedOrder.deliveryDetails?.deliveryOtp || '8842'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Assign Partner Form */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Delivery Partner from Fleet --</option>
                  {deliveryPartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} ({partner.deliveryProfile?.city || 'Jaipur'}) - {partner.deliveryProfile?.vehicleType || 'Bike'}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssignDeliveryPartner}
                  disabled={assigningPartner || !selectedPartnerId}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {assigningPartner ? 'Assigning...' : 'Assign Rider'}
                </button>

                <button
                  type="button"
                  onClick={handleAutoAssignDeliveryPartner}
                  disabled={assigningPartner}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center space-x-1.5 shadow-md shadow-purple-600/30"
                  title="Auto-Assign best rider based on active duty status, rating, and workload"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Assign</span>
                </button>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-white/5 border-y border-white/10">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between space-x-3 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        {item.variant && (
                          <p className="text-[10px] text-slate-400 font-mono">Option: {item.variant}</p>
                        )}
                        <p className="text-[11px] text-slate-400">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400 font-mono text-sm">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">₹{item.price?.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode</span>
                <span className="font-bold text-white font-mono">{selectedOrder.paymentMethod || 'Online'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Status</span>
                <span className={`font-bold font-mono uppercase ${
                  selectedOrder.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              {selectedOrder.paymentDetails?.utrNumber && (
                <div className="flex justify-between text-cyan-300 font-mono bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/30 my-1">
                  <span>Bank UTR / UPI Ref:</span>
                  <span className="font-bold">{selectedOrder.paymentDetails.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                <span>Subtotal</span>
                <span className="font-bold text-white font-mono">
                  ₹{selectedOrder.subtotal?.toFixed(2)}
                </span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({selectedOrder.coupon || 'PROMO'})</span>
                  <span className="font-mono">-₹{selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span className="font-bold text-white font-mono">
                  {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>
                  {selectedOrder.paymentStatus === 'paid'
                    ? 'Total Collected'
                    : (selectedOrder.paymentMethod?.toLowerCase().includes('cash') || selectedOrder.paymentMethod?.toLowerCase().includes('cod'))
                    ? 'To Collect on Delivery'
                    : 'Awaiting Bank Credit'}
                </span>
                <span className="text-emerald-400 font-mono">₹{selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions & Close */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}

                {selectedOrder.paymentStatus !== 'refunded' && (
                  <button
                    onClick={handleProcessRefund}
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Process Refund</span>
                  </button>
                )}

                {selectedOrder.paymentStatus !== 'paid' && selectedOrder.paymentStatus !== 'refunded' && (
                  <button
                    onClick={handleVerifyPayment}
                    className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve & Mark Paid</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COD Cash Settlement & Reconciliation Modal */}
      {showCodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white">
                    Fleet Cash on Delivery (COD) Settlement
                  </h3>
                  <p className="text-xs text-slate-400">
                    Track cash in hand held by active delivery partners and record Hub cashier deposits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCodModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingCod ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                <p className="text-xs text-slate-400">Loading fleet cash balances...</p>
              </div>
            ) : (
              <>
                {/* 3 Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total COD Collected</span>
                    <p className="text-xl font-black font-mono text-white">
                      ₹{codData?.summary?.totalCodCollected?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-[10px] text-slate-500">Across all fulfilled COD runs</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Settled & Deposited</span>
                    <p className="text-xl font-black font-mono text-emerald-400">
                      ₹{codData?.summary?.totalCodSettled?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-[10px] text-emerald-500/80">Received at Logistics Hub</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400">Outstanding in Field</span>
                    <p className="text-xl font-black font-mono text-amber-400">
                      ₹{codData?.summary?.totalCodOutstanding?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-[10px] text-amber-500/80">Pending cashier deposit</p>
                  </div>
                </div>

                {/* Partners Cash In Hand Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Delivery Partners Cash In Hand ({codData?.partners?.length || 0})
                  </h4>

                  <div className="rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 uppercase text-[10px] font-bold tracking-wider text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="py-3 px-4">Rider</th>
                          <th className="py-3 px-4">Vehicle & Zone</th>
                          <th className="py-3 px-4">Pending Orders</th>
                          <th className="py-3 px-4">Cash in Hand</th>
                          <th className="py-3 px-4 text-right">Settlement Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                        {!codData?.partners || codData.partners.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                              No active delivery partners registered in fleet.
                            </td>
                          </tr>
                        ) : (
                          codData.partners.map((p) => {
                            const hasCash = (p.codInHand || 0) > 0 || (p.pendingReconciliationCount || 0) > 0;
                            return (
                              <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4 font-bold text-white">
                                  <p>{p.name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">Ph: +91 {p.phone || 'N/A'}</p>
                                </td>
                                <td className="py-3.5 px-4 text-slate-300">
                                  <p>{p.vehicleType || 'Bike'}</p>
                                  <p className="text-[10px] text-slate-400">{p.city || 'Jaipur'}</p>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-mono text-[11px]">
                                    {p.pendingReconciliationCount || 0} orders
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-black font-mono text-sm text-amber-400">
                                  ₹{(p.codInHand || 0).toFixed(2)}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => handleSettleCod(p._id)}
                                    disabled={!hasCash || settlingPartnerId === p._id}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 active:scale-95"
                                  >
                                    {settlingPartnerId === p._id ? 'Settling...' : 'Settle Cash'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCodModal(false)}
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

export default AdminOrders;
