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
  ChevronRight,
  Boxes,
  X,
  Copy,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import api from '../../services/api';

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

// Helper to format date in Flipkart format: "Fri, 3rd Jul '26"
const formatFlipkartDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[d.getDay()];
  const monthName = months[d.getMonth()];
  const dayNum = d.getDate();
  const yearShort = String(d.getFullYear()).slice(-2);
  const nth = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${dayName}, ${dayNum}${nth(dayNum)} ${monthName} '${yearShort}`;
};

// Helper to format short date for compact summary: "Jul 03"
const formatShortDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

// Helper to format time: "8:20am"
const formatFlipkartTime = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}:${minutes}${ampm}`;
};

// Helper to format combined date & time: "Fri, 3rd Jul '26 - 8:20am"
const formatFlipkartDateTime = (dateInput) => {
  const dStr = formatFlipkartDate(dateInput);
  const tStr = formatFlipkartTime(dateInput);
  return dStr && tStr ? `${dStr} - ${tStr}` : dStr || tStr;
};

const CustomerShipmentTracker = ({ order, initialShipment = null }) => {
  const [shipment, setShipment] = useState(initialShipment);
  const [loading, setLoading] = useState(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
  const [isDeliveryDetailsOpen, setIsDeliveryDetailsOpen] = useState(false);
  const [isPriceDetailsOpen, setIsPriceDetailsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

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
    order?.orderStatus === 'shipped' || order?.orderStatus === 'dispatched_from_warehouse' ? 'DISPATCHED_FROM_WAREHOUSE' :
    order?.orderStatus === 'processing' ? 'SELLER_PROCESSING' :
    order?.orderStatus === 'cancelled' ? 'CANCELLED' :
    order?.orderStatus === 'returned' ? 'RETURNED' : 'ORDER_CONFIRMED'
  );

  const currentStageIdx = STAGE_ORDER.indexOf(currentStage);
  const isDelivered = currentStage === 'DELIVERED' || order?.orderStatus === 'delivered';
  const isShipped = currentStageIdx >= STAGE_ORDER.indexOf('DISPATCHED_FROM_WAREHOUSE') || ['shipped', 'out_for_delivery', 'delivered'].includes(order?.orderStatus);
  const isOutForDelivery = currentStageIdx >= STAGE_ORDER.indexOf('OUT_FOR_DELIVERY') || ['out_for_delivery', 'delivered'].includes(order?.orderStatus);
  const isConfirmed = true; // Any visible order is at least placed/confirmed
  const isCancelled = order?.orderStatus === 'cancelled' || currentStage === 'CANCELLED';

  // Base timestamps
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  
  // Placed / Confirmed times
  const placedTime = orderDate;
  const processedTime = new Date(orderDate.getTime() + 3 * 3600 * 1000 + 58 * 60 * 1000);
  const pickupTime = new Date(orderDate.getTime() + 4 * 3600 * 1000);

  // Shipped times
  const shippedTime = new Date(orderDate.getTime() + 4 * 3600 * 1000 + 10 * 60 * 1000);
  const hubArrivalDate = new Date(orderDate.getTime() + 2 * 24 * 3600 * 1000 + 5 * 3600 * 1000);

  // Out for delivery / Delivered times
  const deliveryEstimatedDate = order?.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(orderDate.getTime() + 4 * 24 * 3600 * 1000);
  const outForDeliveryTime = new Date(deliveryEstimatedDate.getTime() - 6 * 3600 * 1000);
  const deliveredTime = deliveryEstimatedDate;

  // Courier display string (e.g. "VEXIVO Express Logistics - VEX4115389461" or from shipment)
  const courierName = shipment?.courierCompany || 'Ekart Logistics';
  const trackingNumberDisplay = shipment?.shipmentId || order?.trackingNumber || (order?.orderNumber ? `FMPP${order.orderNumber.replace(/[^0-9]/g, '').padEnd(10, '8').slice(0, 10)}` : 'FMPP4115389461');
  const courierHeading = `${courierName} - ${trackingNumberDisplay}`;

  const handleCopyOrderId = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const recipientName = order?.shippingAddress
    ? `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'Rushikesh'
    : 'Customer';

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* FLIPKART STYLE SUMMARY TRACKER ROW & DETAILS ACCORDIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Left Column: 2-Point Vertical Status Preview + See All Updates link */}
        <div className="lg:col-span-6 space-y-3">
          {/* Vertical Stepper Summary */}
          <div className="relative pl-1">
            {/* Step 1: Order Confirmed */}
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-[#26a541] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-neutral-900">
                Order Confirmed, {formatShortDate(placedTime)}
              </span>
            </div>

            {/* Connecting Line */}
            <div className="w-[2px] h-6 bg-[#26a541] ml-[7px] my-1" />

            {/* Step 2: Delivered / Current Stage */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  isDelivered
                    ? 'bg-[#26a541]'
                    : isCancelled
                    ? 'bg-red-500'
                    : 'bg-[#26a541] animate-pulse'
                }`}
              >
                {isDelivered ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : isCancelled ? (
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-neutral-900">
                {isDelivered
                  ? `Delivered, ${formatShortDate(deliveredTime)}`
                  : isCancelled
                  ? `Order Cancelled`
                  : isOutForDelivery
                  ? `Out For Delivery, Today`
                  : isShipped
                  ? `Shipped, Expected by ${formatShortDate(deliveryEstimatedDate)}`
                  : `Expected Delivery, ${formatShortDate(deliveryEstimatedDate)}`}
              </span>
            </div>
          </div>

          {/* See All Updates Link (Flipkart Blue with Chevron) */}
          <div>
            <button
              type="button"
              onClick={() => setIsUpdatesModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs sm:text-[13px] font-semibold text-[#2874f0] hover:text-[#1855b7] hover:underline transition-colors focus:outline-hidden"
            >
              <span>See All Updates</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Column: Delivery Details & Price Details Collapsible Accordions */}
        <div className="lg:col-span-6 space-y-2.5">
          {/* 1. Delivery Details Accordion */}
          <div className="border border-neutral-200/90 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setIsDeliveryDetailsOpen(!isDeliveryDetailsOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-left bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-neutral-900">Delivery details</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  Delivered to {recipientName} at home
                </p>
              </div>
              <div className="w-6 h-6 flex items-center justify-center text-neutral-400">
                {isDeliveryDetailsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isDeliveryDetailsOpen && (
              <div className="px-3.5 py-3 border-t border-neutral-100 text-xs text-neutral-700 space-y-1 bg-white animate-fade-in">
                <p className="font-bold text-neutral-900">{recipientName}</p>
                {order?.shippingAddress && (
                  <>
                    <p className="text-neutral-600 leading-relaxed">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-neutral-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="text-neutral-500 text-[11px] pt-1">
                        Phone: <span className="font-semibold text-neutral-800">{order.shippingAddress.phone}</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* 2. Price Details Accordion */}
          <div className="border border-neutral-200/90 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPriceDetailsOpen(!isPriceDetailsOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-left bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-neutral-900">Price details</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  Paid ₹{Number(order?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} by {order?.paymentMethod || 'UPI / Online'}
                </p>
              </div>
              <div className="w-6 h-6 flex items-center justify-center text-neutral-400">
                {isPriceDetailsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isPriceDetailsOpen && (
              <div className="px-3.5 py-3 border-t border-neutral-100 text-xs text-neutral-700 space-y-2 bg-white animate-fade-in">
                <div className="flex justify-between text-neutral-600">
                  <span>List Price / Subtotal</span>
                  <span>₹{Number(order?.subtotal || order?.total || 0).toFixed(2)}</span>
                </div>
                {Number(order?.discount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Savings</span>
                    <span>-₹{Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-semibold">
                    {order?.shipping === 0 ? 'FREE' : `₹${order?.shipping || 0}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-100 flex justify-between font-extrabold text-neutral-900 text-[13px]">
                  <span>Total Amount Paid</span>
                  <span>₹{Number(order?.total || 0).toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-0.5">
                  Payment Mode: <strong className="text-neutral-700">{order?.paymentMethod || 'Online'}</strong> ({order?.paymentStatus || 'paid'})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Out for Delivery Agent & Handover OTP notification banner - ONLY when strictly Out For Delivery */}
      {(currentStage === 'OUT_FOR_DELIVERY' || order?.orderStatus === 'out_for_delivery') && !isDelivered && !isCancelled && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#26a541] text-white flex items-center justify-center font-bold flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-xs">
                {shipment?.deliveryPartner?.name || shipment?.deliveryPartnerName || order?.deliveryPartnerName || 'Logistics Agent Assigned'}
                <span className="ml-2 text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">
                  {currentStage === 'DELIVERY_PARTNER_ASSIGNED' ? 'Agent Assigned' : 'Out For Delivery'}
                </span>
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Share this delivery OTP only after receiving and physically inspecting the package.
              </p>
            </div>
          </div>
          {(shipment?.deliveryOtp || order?.deliveryDetails?.deliveryOtp) && (
            <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-center shadow-2xs">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-800 block">
                Delivery OTP
              </span>
              <span className="font-mono font-black text-emerald-700 text-base tracking-widest">
                {shipment?.deliveryOtp || order?.deliveryDetails?.deliveryOtp}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLIPKART STYLE "SEE ALL UPDATES" MODAL POPUP */}
      {/* ========================================================================= */}
      {isUpdatesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsUpdatesModalOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] max-h-[90vh] overflow-y-auto relative border border-neutral-200 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Shipment Updates</h3>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  ID: #{order?.orderNumber || identifier}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdatesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors focus:outline-hidden"
                aria-label="Close updates modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body: Flipkart Vertical Timeline with Green Nodes */}
            <div className="p-6 relative">
              {/* Continuous Vertical Green Connector Line */}
              <div className="absolute left-[31px] top-8 bottom-12 w-[2.5px] bg-[#26a541]" />

              <div className="space-y-7 relative">
                {/* 1. ORDER CONFIRMED */}
                <div className="relative flex items-start space-x-4">
                  {/* Status Dot */}
                  <div className="w-3.5 h-3.5 rounded-full bg-[#26a541] ring-4 ring-white flex-shrink-0 mt-0.5 z-10" />

                  <div className="space-y-2.5 flex-1 -mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-bold text-sm text-neutral-900">Order Confirmed</span>
                      <span className="text-xs text-neutral-500 font-normal">
                        {formatFlipkartDate(placedTime)}
                      </span>
                    </div>

                    {/* Sub-events */}
                    <div className="space-y-2 text-xs text-neutral-800">
                      <div>
                        <p className="font-normal text-neutral-900">Your Order has been placed.</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                          {formatFlipkartDateTime(placedTime)}
                        </p>
                      </div>

                      <div>
                        <p className="font-normal text-neutral-900">Seller has processed your order.</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                          {formatFlipkartDateTime(processedTime)}
                        </p>
                      </div>

                      <div>
                        <p className="font-normal text-neutral-900">
                          Your item has been picked up by delivery partner.
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                          {formatFlipkartDateTime(pickupTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SHIPPED */}
                <div className="relative flex items-start space-x-4">
                  {/* Status Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full ring-4 ring-white flex-shrink-0 mt-0.5 z-10 ${
                      isShipped ? 'bg-[#26a541]' : 'bg-neutral-300'
                    }`}
                  />

                  <div className="space-y-2.5 flex-1 -mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-bold text-sm text-neutral-900">Shipped</span>
                      <span className="text-xs text-neutral-500 font-normal">
                        {formatFlipkartDate(shippedTime)}
                      </span>
                    </div>

                    {/* Sub-events */}
                    <div className="space-y-2 text-xs text-neutral-800">
                      {/* Courier & Tracking Heading (Matching Flipkart exact label) */}
                      <div>
                        <p className="font-bold text-neutral-900">{courierHeading}</p>
                      </div>

                      <div>
                        <p className="font-normal text-neutral-900">Your item has been shipped.</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                          {formatFlipkartDateTime(shippedTime)}
                        </p>
                      </div>

                      <div>
                        <p className="font-normal text-neutral-900">
                          Your item has been received in the hub nearest to you
                        </p>
                        {isShipped && (
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                            {formatFlipkartDateTime(hubArrivalDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. OUT FOR DELIVERY */}
                <div className="relative flex items-start space-x-4">
                  {/* Status Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full ring-4 ring-white flex-shrink-0 mt-0.5 z-10 ${
                      isOutForDelivery ? 'bg-[#26a541]' : 'bg-neutral-300'
                    }`}
                  />

                  <div className="space-y-2 flex-1 -mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-bold text-sm text-neutral-900">Out For Delivery</span>
                      <span className="text-xs text-neutral-500 font-normal">
                        {formatFlipkartDate(outForDeliveryTime)}
                      </span>
                    </div>

                    {/* Sub-events */}
                    <div className="text-xs text-neutral-800">
                      <p className="font-normal text-neutral-900">Your item is out for delivery</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                        {formatFlipkartDateTime(outForDeliveryTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. DELIVERED */}
                <div className="relative flex items-start space-x-4">
                  {/* Status Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full ring-4 ring-white flex-shrink-0 mt-0.5 z-10 ${
                      isDelivered ? 'bg-[#26a541]' : 'bg-neutral-300'
                    }`}
                  />

                  <div className="space-y-2 flex-1 -mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-bold text-sm text-neutral-900">Delivered</span>
                      <span className="text-xs text-neutral-500 font-normal">
                        {formatFlipkartDate(deliveredTime)}
                      </span>
                    </div>

                    {/* Sub-events */}
                    <div className="text-xs text-neutral-800">
                      <p className="font-normal text-neutral-900">
                        {isDelivered
                          ? 'Your item has been delivered'
                          : `Expected delivery by ${formatFlipkartDate(deliveryEstimatedDate)}`}
                      </p>
                      {isDelivered && (
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                          {formatFlipkartDateTime(deliveredTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="text-[11px]">Need help with this order?</span>
              <button
                type="button"
                onClick={() => setIsUpdatesModalOpen(false)}
                className="font-bold text-[#2874f0] hover:underline"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerShipmentTracker;
