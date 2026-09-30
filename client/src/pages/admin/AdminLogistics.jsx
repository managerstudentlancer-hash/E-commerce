import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Boxes,
  Building2,
  MapPin,
  QrCode,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Check,
  X,
  Loader2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Navigation,
  Calendar,
  AlertTriangle,
  UserCheck,
  Send,
  Eye,
  Sliders,
} from 'lucide-react';
import api from '../../services/api';

const STAGE_CONFIGS = {
  ORDER_PLACED: { label: 'Order Placed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  ORDER_CONFIRMED: { label: 'Order Confirmed', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  SELLER_PROCESSING: { label: 'Seller Processing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  READY_FOR_PICKUP: { label: 'Ready For Pickup', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  PICKED_UP: { label: 'Picked Up (Inbound)', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  WAREHOUSE_RECEIVED: { label: 'At Warehouse', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  SCANNED: { label: 'Scanned & Verified', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  SORTED: { label: 'Sorted For Hub', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  DISPATCHED_FROM_WAREHOUSE: { label: 'In Line-Haul Transit', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  HUB_RECEIVED: { label: 'At Delivery Hub', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  READY_FOR_DELIVERY: { label: 'Ready For Delivery', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  DELIVERY_PARTNER_ASSIGNED: { label: 'Rider Assigned', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  OUT_FOR_DELIVERY: { label: 'Out For Delivery', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' },
  DELIVERY_ATTEMPTED: { label: 'Delivery Attempted', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  RESCHEDULED: { label: 'Rescheduled', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' },
  RETURN_INITIATED: { label: 'Return Initiated', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  RETURN_IN_TRANSIT: { label: 'Return In Transit', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  RETURN_WAREHOUSE_RECEIVED: { label: 'Return at WH', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  RETURN_TO_SELLER: { label: 'Returning to Merchant', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  SELLER_RECEIVED: { label: 'Returned (Closed)', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const AdminLogistics = () => {
  const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' | 'scanner' | 'warehouses' | 'hubs'
  const [stageFilter, setStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shipments, setShipments] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pendingPickup: 0,
    atWarehouse: 0,
    inTransit: 0,
    atHub: 0,
    outForDelivery: 0,
    delivered: 0,
    failed: 0,
    returns: 0,
  });
  const [warehouses, setWarehouses] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Modals state
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [actionModalType, setActionModalType] = useState(''); // 'timeline' | 'assign_partner' | 'fail_attempt' | 'reschedule' | 'override' | 'add_wh' | 'add_hub' | 'damage_receive'
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [assignPartnerId, setAssignPartnerId] = useState('');
  const [failureReason, setFailureReason] = useState('Customer unavailable / unreachable');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [overrideStage, setOverrideStage] = useState('OUT_FOR_DELIVERY');
  const [overrideReason, setOverrideReason] = useState('');
  const [damageNotes, setDamageNotes] = useState('');

  // Scanner Simulator state
  const [scanCode, setScanCode] = useState('');
  const [scannerType, setScannerType] = useState('WAREHOUSE_RECEIVE_SCAN');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadData = async (showSpinner = false) => {
    try {
      if (showSpinner) setRefreshing(true);
      const [shipRes, whRes, hubRes, partnerRes] = await Promise.all([
        api.logistics.getShipments({ stage: stageFilter, search: searchQuery }),
        api.logistics.getWarehouses(),
        api.logistics.getHubs(),
        api.adminLogistics.getDeliveryPartners().catch(() => ({ partners: [] })),
      ]);

      if (shipRes?.success) {
        setShipments(shipRes.shipments || []);
        if (shipRes.metrics) setMetrics(shipRes.metrics);
      }
      if (whRes?.success) setWarehouses(whRes.warehouses || []);
      if (hubRes?.success) setHubs(hubRes.hubs || []);
      if (partnerRes?.partners) setRiders(partnerRes.partners || []);
    } catch (err) {
      showToast(err.message || 'Failed to load logistics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [stageFilter]);

  // Handle Search on Enter or debounced
  const handleSearch = (e) => {
    e.preventDefault();
    loadData(true);
  };

  // Stage Advance Handlers
  const handleAdvanceStage = async (shipment, nextAction) => {
    try {
      setActionLoading(true);
      let res;
      const id = shipment._id;

      if (nextAction === 'pickup_confirm') {
        res = await api.logistics.confirmPickup(id);
      } else if (nextAction === 'warehouse_receive') {
        res = await api.logistics.warehouseReceive(id);
      } else if (nextAction === 'sort') {
        res = await api.logistics.sort(id, { sortingBin: 'A-14', routeCode: 'EXP-DELIV' });
      } else if (nextAction === 'dispatch_warehouse') {
        res = await api.logistics.dispatchWarehouse(id, { truckNumber: 'RJ-14-TR-8812', containerId: 'VEX-C88' });
      } else if (nextAction === 'hub_receive') {
        res = await api.logistics.hubReceive(id);
      } else if (nextAction === 'ready_for_delivery') {
        res = await api.logistics.readyForDelivery(id);
      } else if (nextAction === 'out_for_delivery') {
        res = await api.logistics.outForDelivery(id);
      } else if (nextAction === 'deliver') {
        res = await api.logistics.deliver(id, { bypassOtp: true });
      }

      if (res?.success) {
        showToast(res.message);
        loadData(false);
      }
    } catch (err) {
      showToast(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Partner Assignment
  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedShipment || !assignPartnerId) return;
    try {
      setActionLoading(true);
      const res = await api.logistics.assignPartner(selectedShipment._id, assignPartnerId);
      if (res?.success) {
        showToast(res.message);
        setActionModalType('');
        loadData(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign partner');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Delivery Attempt Failure
  const handleConfirmFailure = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;
    try {
      setActionLoading(true);
      const res = await api.logistics.deliveryAttempt(selectedShipment._id, { reason: failureReason });
      if (res?.success) {
        showToast(res.message);
        setActionModalType('');
        loadData(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to record attempt');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Reschedule
  const handleConfirmReschedule = async (e) => {
    e.preventDefault();
    if (!selectedShipment || !rescheduleDate) return;
    try {
      setActionLoading(true);
      const res = await api.logistics.reschedule(selectedShipment._id, { newDate: rescheduleDate });
      if (res?.success) {
        showToast(res.message);
        setActionModalType('');
        loadData(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to reschedule');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Admin Manual Override
  const handleConfirmOverride = async (e) => {
    e.preventDefault();
    if (!selectedShipment || !overrideReason) return;
    try {
      setActionLoading(true);
      const res = await api.logistics.adminOverride(selectedShipment._id, {
        targetStage: overrideStage,
        reason: overrideReason,
      });
      if (res?.success) {
        showToast(res.message);
        setActionModalType('');
        loadData(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to apply admin override');
    } finally {
      setActionLoading(false);
    }
  };

  // Scanner Simulator Submission
  const handleScannerSubmit = async (e) => {
    e.preventDefault();
    if (!scanCode.trim()) return;
    try {
      setScanLoading(true);
      const res = await api.logistics.scan({
        barcodeOrId: scanCode.trim(),
        scanType: scannerType,
      });
      if (res?.success) {
        setLastScanResult(res);
        showToast(`Scan verified for ${res.shipment?.shipmentId}`);
        setScanCode('');
        loadData(false);
      }
    } catch (err) {
      setLastScanResult({ success: false, message: err.message });
      showToast(err.message || 'Scan verification failed');
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans antialiased">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2028-READY MULTI-STAGE LOGISTICS CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Logistics, Fulfillment &amp; Warehouses
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Strict end-to-end lifecycle tracking: Seller Pickup → Warehouse Inbound → Barcode Sorting → Line-Haul Transit → Delivery Hub → Rider Assignment → Out for Delivery → Customer Handover.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync Live Fleet</span>
          </button>
        </div>
      </div>

      {/* SUMMARY STATS METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Total Shipments', count: metrics.total, color: 'text-white', icon: Boxes },
          { label: 'Pending Pickup', count: metrics.pendingPickup, color: 'text-amber-400', icon: Clock },
          { label: 'At Warehouse', count: metrics.atWarehouse, color: 'text-sky-400', icon: Building2 },
          { label: 'In Transit', count: metrics.inTransit, color: 'text-cyan-400', icon: Navigation },
          { label: 'At Local Hub', count: metrics.atHub, color: 'text-yellow-400', icon: MapPin },
          { label: 'Out for Delivery', count: metrics.outForDelivery, color: 'text-emerald-400', icon: Truck },
          { label: 'Delivered', count: metrics.delivered, color: 'text-emerald-300', icon: CheckCircle2 },
          { label: 'Failed / Returns', count: metrics.failed + metrics.returns, color: 'text-rose-400', icon: RotateCcw },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">{m.label}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className={`text-xl sm:text-2xl font-black ${m.color}`}>{m.count}</p>
            </div>
          );
        })}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'shipments', label: 'Active Shipments', icon: Package },
          { id: 'scanner', label: 'Barcode / QR Scanner Simulator', icon: QrCode },
          { id: 'warehouses', label: 'Fulfillment Warehouses', icon: Building2 },
          { id: 'hubs', label: 'Delivery Hubs & Coverage', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ACTIVE SHIPMENTS TABLE & MULTI-STAGE STAGE ACTIONS */}
      {/* ============================================================== */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-white/10">
            {/* Stage Selector Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Shipments' },
                { id: 'PENDING_PICKUP', label: 'Pickup Queue' },
                { id: 'AT_WAREHOUSE', label: 'At Warehouse' },
                { id: 'IN_TRANSIT', label: 'In Transit' },
                { id: 'AT_HUB', label: 'At Hub' },
                { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                { id: 'DELIVERED', label: 'Delivered' },
                { id: 'FAILED_RESCHEDULED', label: 'Failed / Rescheduled' },
                { id: 'RETURNS', label: 'Reverse Returns' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStageFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    stageFilter === pill.id
                      ? 'bg-white/15 text-white font-extrabold border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking, order, city..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </form>
          </div>

          {/* Shipments List */}
          <div className="bg-slate-900/60 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-xs text-slate-400 font-bold">Querying live logistics network...</p>
              </div>
            ) : shipments.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Package className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-300">No shipments matched current filter</h3>
                <p className="text-xs text-slate-500">Try selecting a different filter or reset search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/50 border-b border-white/10 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Shipment &amp; Order</th>
                      <th className="py-3.5 px-4">Current Stage &amp; Location</th>
                      <th className="py-3.5 px-4">Warehouse &amp; Hub</th>
                      <th className="py-3.5 px-4">Delivery Partner</th>
                      <th className="py-3.5 px-4">Next Expected Step</th>
                      <th className="py-3.5 px-4 text-right">Logistics Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {shipments.map((s) => {
                      const cfg = STAGE_CONFIGS[s.currentStage] || { label: s.currentStage, color: 'bg-white/10 text-white' };

                      return (
                        <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-black text-white text-[12px] block">
                              {s.shipmentId}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                              #{s.orderNumber} • {s.customerName}
                            </span>
                            <span className="text-[10px] text-emerald-400/80">
                              📍 {s.shippingAddress?.city}, {s.shippingAddress?.state}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <span className="block text-[11px] text-slate-300 mt-1 font-semibold truncate max-w-[200px]">
                              {s.currentLocation}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-200 truncate max-w-[170px]">{s.warehouseName || 'Assigned Warehouse'}</p>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                              Hub: {s.hubName || 'Local Delivery Facility'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {s.deliveryPartnerName ? (
                              <div>
                                <span className="font-extrabold text-white text-[11px] block">{s.deliveryPartnerName}</span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {s.deliveryPartnerPhone ? `+91 ${s.deliveryPartnerPhone}` : 'Assigned Rider'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[10px] italic">Not Assigned</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="text-[11px] text-slate-300 font-medium line-clamp-2 max-w-[220px]">
                              {s.nextExpectedStep || 'Awaiting automated logistics movement'}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5 flex-wrap gap-1">
                              {/* Dynamic Next Stage Step Button */}
                              {s.currentStage === 'READY_FOR_PICKUP' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'pickup_confirm')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Pickup Confirm
                                </button>
                              )}

                              {s.currentStage === 'PICKED_UP' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'warehouse_receive')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Receive at WH
                                </button>
                              )}

                              {s.currentStage === 'WAREHOUSE_RECEIVED' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'sort')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Sort To Hub
                                </button>
                              )}

                              {['SORTED', 'SCANNED'].includes(s.currentStage) && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'dispatch_warehouse')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Dispatch Line-Haul
                                </button>
                              )}

                              {s.currentStage === 'DISPATCHED_FROM_WAREHOUSE' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'hub_receive')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Receive at Hub
                                </button>
                              )}

                              {s.currentStage === 'HUB_RECEIVED' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'ready_for_delivery')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Stage for Delivery
                                </button>
                              )}

                              {['READY_FOR_DELIVERY', 'DELIVERY_PARTNER_ASSIGNED'].includes(s.currentStage) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedShipment(s);
                                    setActionModalType('assign_partner');
                                    setAssignPartnerId(s.deliveryPartner?._id || '');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider"
                                >
                                  {s.deliveryPartnerName ? 'Reassign Rider' : 'Assign Rider'}
                                </button>
                              )}

                              {s.currentStage === 'DELIVERY_PARTNER_ASSIGNED' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(s, 'out_for_delivery')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider"
                                >
                                  Dispatch Out
                                </button>
                              )}

                              {s.currentStage === 'OUT_FOR_DELIVERY' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleAdvanceStage(s, 'deliver')}
                                    disabled={actionLoading}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider"
                                  >
                                    Mark Delivered
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedShipment(s);
                                      setActionModalType('fail_attempt');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] uppercase tracking-wider"
                                  >
                                    Attempt Failed
                                  </button>
                                </>
                              )}

                              {/* Timeline Inspector */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedShipment(s);
                                  setActionModalType('timeline');
                                }}
                                title="Inspect Audit Timeline"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Admin Override */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedShipment(s);
                                  setOverrideStage(s.currentStage);
                                  setOverrideReason('');
                                  setActionModalType('override');
                                }}
                                title="Admin Stage Override"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 transition-colors"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: BARCODE / QR OPTICAL SCANNER SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Input Station */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Logistics Optical Barcode Station</h3>
                <p className="text-xs text-slate-400">Scan or manually enter Tracking ID or Order # to execute instant facility checkpoint</p>
              </div>
            </div>

            <form onSubmit={handleScannerSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Scanning Action Type
                </label>
                <select
                  value={scannerType}
                  onChange={(e) => setScannerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="WAREHOUSE_RECEIVE_SCAN">Warehouse Inbound Check-in Scan</option>
                  <option value="SORTING_SCAN">Automated Conveyor Sorting Scan</option>
                  <option value="DISPATCH_SCAN">Line-Haul Outbound Dispatch Scan</option>
                  <option value="HUB_RECEIVE_SCAN">Local Delivery Hub Inbound Scan</option>
                  <option value="OUT_FOR_DELIVERY_SCAN">Final Mile Out for Delivery Scan</option>
                  <option value="DELIVERY_CONFIRM_SCAN">Customer Handover Verification Scan</option>
                  <option value="AUDIT_SCAN">Quality &amp; Inventory Audit Scan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Scan Barcode / Enter Shipment ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value)}
                    placeholder="e.g. VX-SHP-123456-7890 or VEX-123456"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-emerald-500/40 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={scanLoading || !scanCode.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    {scanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan Checkpoint'}
                  </button>
                </div>
              </div>
            </form>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">💡 Fast Testing Tip:</p>
              <p>You can copy any Shipment ID from the Active Shipments table (e.g. <span className="font-mono text-emerald-400">VX-SHP-...</span>) and paste it here to simulate high-speed barcode verification.</p>
            </div>
          </div>

          {/* Last Scan Result Stage */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Latest Optical Scan Verification</h4>
            {lastScanResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Barcode Verified &amp; Checkpoint Recorded</span>
                  </div>
                  <p className="text-slate-200">
                    Shipment <strong className="font-mono text-white">{lastScanResult.shipment?.shipmentId}</strong> updated to{' '}
                    <span className="font-bold text-emerald-300">{lastScanResult.shipment?.currentStage}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">📍 Facility: {lastScanResult.scan?.facility}</p>
                </div>

                {lastScanResult.shipment && (
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 text-xs space-y-2">
                    <p className="font-bold text-white">Parcel Specifications:</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div>Weight: <span className="text-white font-mono">{lastScanResult.shipment.parcelDetails?.weight}</span></div>
                      <div>Dimensions: <span className="text-white font-mono">{lastScanResult.shipment.parcelDetails?.dimensions}</span></div>
                      <div>Destination: <span className="text-white">{lastScanResult.shipment.shippingAddress?.city}</span></div>
                      <div>Warehouse: <span className="text-white">{lastScanResult.shipment.warehouseName}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">Awaiting scan input. Ready for barcode capture.</p>
              </div>
            )}
            <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Station: VEXIVO Central Gateway Scanner #01</span>
              <span>Status: Online</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: WAREHOUSES MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
              Active Regional Fulfillment Centers ({warehouses.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((wh) => (
              <div key={wh._id} className="bg-slate-900/60 p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {wh.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-sm">{wh.name}</h4>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{wh.warehouseId} • {wh.code}</p>
                  <p className="text-xs text-slate-400 mt-2">📍 {wh.address}, {wh.city}, {wh.state} - {wh.postalCode}</p>
                </div>

                <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Capacity</span>
                    <span className="font-bold text-white">{(wh.capacity || 50000).toLocaleString('en-IN')} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Active Parcels</span>
                    <span className="font-bold text-emerald-400">{wh.currentParcels || 0}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Supervisor: {wh.managerName || 'Logistics Officer'}</span>
                  <span>{wh.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: DELIVERY HUBS & SERVICE ZONES */}
      {/* ============================================================== */}
      {activeTab === 'hubs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
              Registered Final-Mile Delivery Hubs ({hubs.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hubs.map((hub) => (
              <div key={hub._id} className="bg-slate-900/60 p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {hub.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-sm">{hub.name}</h4>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{hub.hubId} • Linked to {hub.warehouseName || 'Parent WH'}</p>
                  <p className="text-xs text-slate-400 mt-2">📍 {hub.address}, {hub.city} - {hub.postalCode}</p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1.5">
                    Covered Service Zones:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(hub.serviceZones || [hub.city]).map((zone, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Manager: {hub.managerName || 'Hub Officer'}</span>
                  <span>{hub.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: COMPLETE SHIPMENT AUDIT TIMELINE INSPECTOR */}
      {/* ============================================================== */}
      {actionModalType === 'timeline' && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Logistics Event Audit Trail</span>
                <h3 className="text-lg font-black text-white font-mono">{selectedShipment.shipmentId}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActionModalType('')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 flex-1">
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {(selectedShipment.timeline || []).map((ev, i) => (
                  <div key={i} className="relative text-xs">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-slate-900" />
                    <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-[13px]">{ev.status || ev.stage}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(ev.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{ev.message}</p>
                      <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] text-slate-400 border-t border-white/5">
                        <span>📍 Facility: {ev.facility || ev.location}</span>
                        <span>•</span>
                        <span>Verified by: {ev.actor} ({ev.actorRole})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-right">
              <button
                type="button"
                onClick={() => setActionModalType('')}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ASSIGN DELIVERY PARTNER */}
      {/* ============================================================== */}
      {actionModalType === 'assign_partner' && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Assign Delivery Partner</h3>
              <button
                type="button"
                onClick={() => setActionModalType('')}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4 text-xs">
              <div>
                <p className="text-slate-400 text-[11px] mb-1">Destination Customer &amp; Address:</p>
                <p className="font-bold text-white">{selectedShipment.customerName}</p>
                <p className="text-slate-300">{selectedShipment.shippingAddress?.address}, {selectedShipment.shippingAddress?.city}</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Select Active Delivery Partner
                </label>
                <select
                  value={assignPartnerId}
                  onChange={(e) => setAssignPartnerId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Rider from Fleet --</option>
                  {riders.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.deliveryProfile?.city || 'Jaipur'}) - {r.deliveryProfile?.vehicleType || 'Bike'} [★{r.deliveryProfile?.rating || 4.9}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActionModalType('')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !assignPartnerId}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: LOG DELIVERY ATTEMPT FAILURE */}
      {/* ============================================================== */}
      {actionModalType === 'fail_attempt' && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider">Log Delivery Attempt Failed</h3>
              <button
                type="button"
                onClick={() => setActionModalType('')}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmFailure} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Failure Reason
                </label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Customer unavailable / unreachable">Customer unavailable / unreachable</option>
                  <option value="Customer requested reschedule">Customer requested reschedule</option>
                  <option value="Address incomplete or incorrect">Address incomplete or incorrect</option>
                  <option value="Customer refused delivery">Customer refused delivery</option>
                  <option value="Cash on Delivery amount not ready">Cash on Delivery amount not ready</option>
                  <option value="Delivery partner unable to reach premises / gate locked">Gate locked / Premises closed</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActionModalType('')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Attempt Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: ADMIN STAGE MANUAL OVERRIDE */}
      {/* ============================================================== */}
      {actionModalType === 'override' && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <h3 className="text-sm font-black uppercase tracking-wider">Superadmin Stage Override</h3>
              </div>
              <button
                type="button"
                onClick={() => setActionModalType('')}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOverride} className="space-y-4 text-xs">
              <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                Warning: Manual stage override bypasses automated validation checks. An immutable audit entry will be logged under your administrator account.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Force Set Target Stage:
                </label>
                <select
                  value={overrideStage}
                  onChange={(e) => setOverrideStage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  {Object.keys(STAGE_CONFIGS).map((k) => (
                    <option key={k} value={k}>
                      {STAGE_CONFIGS[k].label} ({k})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Audit Rationale / Explanation *
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  required
                  placeholder="e.g. Corrected manual delivery confirmation following phone customer verification ticket #884"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActionModalType('')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !overrideReason.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogistics;
