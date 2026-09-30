import React, { useState, useEffect } from 'react';
import {
  Check,
  Truck,
  Package,
  MapPin,
  Clock,
  Building2,
  Navigation,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Boxes,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';

const LOGISTICS_MILESTONES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', shortLabel: 'Placed' },
  { key: 'ORDER_CONFIRMED', label: 'Confirmed', shortLabel: 'Confirmed' },
  { key: 'SELLER_PROCESSING', label: 'Seller Processing', shortLabel: 'Packed' },
  { key: 'PICKED_UP', label: 'Parcel Picked Up', shortLabel: 'Picked Up' },
  { key: 'WAREHOUSE_RECEIVED', label: 'Warehouse Inbound', shortLabel: 'Warehouse' },
  { key: 'SCANNED', label: 'Scanned & Verified', shortLabel: 'Scanned' },
  { key: 'SORTED', label: 'Sorted by Hub', shortLabel: 'Sorted' },
  { key: 'DISPATCHED_FROM_WAREHOUSE', label: 'Dispatched to Hub', shortLabel: 'Dispatched' },
  { key: 'HUB_RECEIVED', label: 'Delivery Hub Inbound', shortLabel: 'Hub' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready For Delivery', shortLabel: 'Staged' },
  { key: 'DELIVERY_PARTNER_ASSIGNED', label: 'Agent Assigned', shortLabel: 'Assigned' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', shortLabel: 'Out for Deliv' },
  { key: 'DELIVERED', label: 'Delivered', shortLabel: 'Delivered' },
];

const STAGE_ORDER = [
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'SELLER_PROCESSING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'WAREHOUSE_RECEIVED',
  'SCANNED',
  'SORTED',
  'DISPATCHED_FROM_WAREHOUSE',
  'HUB_RECEIVED',
  'READY_FOR_DELIVERY',
  'DELIVERY_PARTNER_ASSIGNED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const CustomerShipmentTracker = ({ order, initialShipment = null }) => {
  const [shipment, setShipment] = useState(initialShipment);
  const [loading, setLoading] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const identifier = shipment?.shipmentId || order?.shipment?.shipmentId || order?.trackingNumber || order?.orderNumber;

  useEffect(() => {
    let isCancelled = false;
    const fetchTracking = async () => {
      if (!identifier) return;
      try {
        setLoading(true);
        const res = await api.logistics.track(identifier);
        if (!isCancelled && res.success && res.tracking) {
          setShipment(res.tracking);
        }
      } catch (err) {
        // Fall back gracefully to order's embedded tracking
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchTracking();
    return () => {
      isCancelled = true;
    };
  }, [identifier]);

  // Determine current stage index
  const currentStage = shipment?.currentStage || (
    order?.orderStatus === 'delivered' ? 'DELIVERED' :
    order?.orderStatus === 'out_for_delivery' ? 'OUT_FOR_DELIVERY' :
    order?.orderStatus === 'shipped' ? 'DISPATCHED_FROM_WAREHOUSE' :
    order?.orderStatus === 'processing' ? 'SELLER_PROCESSING' : 'ORDER_CONFIRMED'
  );

  const currentStageIdx = STAGE_ORDER.indexOf(currentStage);
  const isDelivered = currentStage === 'DELIVERED';
  const isFailed = currentStage === 'DELIVERY_ATTEMPTED';
  const isRescheduled = currentStage === 'RESCHEDULED';
  const isReturn = currentStage.startsWith('RETURN_');

  // Find timeline events for milestones
  const timelineEvents = shipment?.timeline || (order?.trackingHistory || []).map(th => ({
    stage: th.status?.toUpperCase() || 'UPDATE',
    status: th.status,
    message: th.message,
    timestamp: th.timestamp,
    location: shipment?.currentLocation || `${order?.shippingAddress?.city || 'India'}`,
  }));

  const latestEvent = timelineEvents.length > 0 ? timelineEvents[timelineEvents.length - 1] : null;

  return (
    <div className="w-full space-y-4">
      {/* 1. REAL-TIME LOGISTICS LOCATION & STATUS BANNER */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-4 sm:p-5 rounded-2xl border border-neutral-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE SHIPMENT TRACKING</span>
              <span>•</span>
              <span className="font-mono text-white/80">{shipment?.shipmentId || order?.trackingNumber || 'VEX-EXPRESS'}</span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
              {isDelivered ? 'Delivered Safely' :
               isFailed ? 'Delivery Attempt Notice' :
               isRescheduled ? 'Delivery Rescheduled' :
               isReturn ? 'Return Transit in Progress' :
               currentStage.replace(/_/g, ' ')}
            </h4>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              isDelivered ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              isFailed || isRescheduled ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {isDelivered ? '✓ Completed' : isFailed ? 'Attempted' : isRescheduled ? 'Rescheduled' : 'Active Run'}
            </span>
          </div>
        </div>

        {/* Location & Next Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5 text-xs">
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Current Parcel Location</p>
              <p className="font-bold text-white text-xs sm:text-[13px] mt-0.5 leading-snug">
                {shipment?.currentLocation || `${shipment?.warehouseName || 'Regional Hub'}, ${order?.shippingAddress?.city || 'India'}`}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Next Expected Step</p>
              <p className="font-semibold text-neutral-200 text-xs sm:text-[13px] mt-0.5 leading-snug">
                {shipment?.nextExpectedStep || 'Awaiting logistics movement'}
              </p>
            </div>
          </div>
        </div>

        {/* Latest Timestamp Note */}
        {latestEvent && (
          <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="truncate max-w-[80%]">
              <strong className="text-neutral-300">Latest Update:</strong> {latestEvent.message}
            </span>
            <span className="font-mono text-[10px] text-neutral-400 flex-shrink-0">
              {new Date(latestEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* 2. MULTI-STAGE STEPPER TIMELINE */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center space-x-1.5">
            <Boxes className="w-4 h-4 text-neutral-800" />
            <span>Complete Shipment Lifecycle</span>
          </p>
          <button
            type="button"
            onClick={() => setShowFullTimeline(!showFullTimeline)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>{showFullTimeline ? 'Hide History' : 'View Audit Trail'}</span>
            {showFullTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile-Friendly Stepper Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
          {LOGISTICS_MILESTONES.map((step, idx) => {
            const stepStageIdx = STAGE_ORDER.indexOf(step.key);
            const isCompleted = currentStageIdx >= stepStageIdx && !isFailed;
            const isCurrent = currentStage === step.key;

            return (
              <div
                key={step.key}
                className={`p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                    : isCompleted
                    ? 'border-neutral-200 bg-neutral-50/60'
                    : 'border-dashed border-neutral-200 bg-white opacity-60'
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
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                      Current
                    </span>
                  )}
                </div>
                <p className={`font-bold text-[11px] leading-tight ${isCurrent ? 'text-emerald-950 font-extrabold' : 'text-neutral-800'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {isCurrent ? 'In progress' : isCompleted ? 'Passed' : 'Upcoming'}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3. EXPANDABLE COMPLETE AUDIT TIMELINE TABLE */}
        {showFullTimeline && (
          <div className="mt-5 pt-4 border-t border-neutral-100 space-y-3 animate-fade-in">
            <h5 className="text-xs font-black uppercase tracking-wider text-neutral-800">
              Verified Logistics Checkpoint Logs:
            </h5>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative text-xs">
                  <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/70">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-neutral-900">{ev.status || ev.stage}</span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {new Date(ev.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed">{ev.message}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-neutral-400">
                      <span>📍 Facility: {ev.facility || ev.location || 'VEXIVO Logistics'}</span>
                      <span>•</span>
                      <span>Verified by: {ev.actor || 'Logistics System'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. DELIVERY PARTNER HANDOVER & OTP CARD (Shown only when in final mile delivery stage!) */}
      {(['DELIVERY_PARTNER_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(currentStage) || (order?.deliveryDetails?.deliveryOtp && !isDelivered)) && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-emerald-950 text-sm">
                  {shipment?.deliveryPartner?.name || shipment?.deliveryPartnerName || order?.deliveryPartnerName || 'Assigned Logistics Agent'}
                </span>
                <span className="text-[9px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {currentStage === 'OUT_FOR_DELIVERY' ? 'Out For Delivery' : 'Agent Assigned'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {(shipment?.deliveryPartner?.phone || shipment?.deliveryPartnerPhone || order?.deliveryPartnerPhone) && (
                  <strong className="font-bold text-emerald-950 mr-1.5">
                    📞 Rider: +91 {shipment?.deliveryPartner?.phone || shipment?.deliveryPartnerPhone || order?.deliveryPartnerPhone} •
                  </strong>
                )}
                Share this confidential OTP with your delivery agent only upon physical box inspection.
              </p>
            </div>
          </div>

          {(shipment?.deliveryOtp || order?.deliveryDetails?.deliveryOtp) && (
            <div className="bg-white px-4 py-2 rounded-xl border border-emerald-300 text-center shadow-xs">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-800 block">
                Delivery Handover OTP
              </span>
              <span className="font-mono font-black text-emerald-700 text-lg tracking-widest">
                {shipment?.deliveryOtp || order?.deliveryDetails?.deliveryOtp}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerShipmentTracker;
