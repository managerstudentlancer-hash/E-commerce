import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  Store,
  Plus,
  Camera,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  FileText,
  HelpCircle,
  Sparkles,
  Gift,
  CreditCard,
  Bell,
  Headphones,
  Search,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  ChevronDown,
  ArrowRight,
  Lock,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import CustomerShipmentTracker from '../../components/logistics/CustomerShipmentTracker';

const formatShortDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

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

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
];

const AccountDashboard = () => {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, addMultipleToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state: orders | profile | addresses | wishlist | rewards | coupons | notifications | support | seller
  const urlTab = searchParams.get('tab');
  // For phone users: tracks if a specific subpage (Orders, Profile, Addresses, etc.) is currently open
  const [mobileSubpageOpen, setMobileSubpageOpen] = useState(() => Boolean(urlTab));

  useEffect(() => {
    if (urlTab) {
      setMobileSubpageOpen(true);
    } else {
      setMobileSubpageOpen(false);
    }
  }, [urlTab]);

  const activeTab = urlTab || 'orders';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
    setMobileSubpageOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMobileMenu = () => {
    setMobileSubpageOpen(false);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [buyingAgainId, setBuyingAgainId] = useState(null);

  // Buy Again Handler (Safely extracts product details and batches to cart)
  const handleBuyAgain = (order) => {
    if (!order?.items || order.items.length === 0) return;
    setBuyingAgainId(order._id);

    try {
      const itemsToAdd = order.items.map((it) => {
        const prod = (typeof it.product === 'object' && it.product !== null) ? it.product : {};
        return {
          _id: prod._id || it.product || it._id || `item-${Date.now()}`,
          id: prod._id || it.product || it._id || `item-${Date.now()}`,
          name: it.name || prod.name || 'Order Item',
          price: Number(it.price ?? prod.price ?? 0),
          quantity: it.quantity || 1,
          image: it.image || prod.thumbnail || (prod.images && prod.images[0]) || '',
          variant: it.variant || '',
          slug: prod.slug || '',
        };
      });

      if (typeof addMultipleToCart === 'function') {
        addMultipleToCart(itemsToAdd);
      } else {
        itemsToAdd.forEach((item) => addToCart(item, item.quantity));
      }

      navigate('/cart');
    } catch (err) {
      console.error('Failed to buy again:', err);
      navigate('/cart');
    } finally {
      setTimeout(() => setBuyingAgainId(null), 1000);
    }
  };

  // Order Action Modals
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [isCancelling, setIsCancelling] = useState(false);

  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Defective or damaged product');
  const [returnRequestType, setReturnRequestType] = useState('return'); // 'return' | 'exchange'
  const [exchangeNote, setExchangeNote] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const [deliveringId, setDeliveringId] = useState(null);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Addresses State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    landmark: '',
    addressType: 'Home',
    isDefault: false,
  });
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: 'Order Issue',
    subject: '',
    message: '',
    orderNumber: '',
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Seller Onboarding State
  const [sellerForm, setSellerForm] = useState({
    storeName: '',
    storeDescription: '',
    storePhone: '',
    storeAddress: '',
  });
  const [isActivatingSeller, setIsActivatingSeller] = useState(false);
  const [sellerSuccessMsg, setSellerSuccessMsg] = useState('');

  // Copied Coupon State
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [couponsList, setCouponsList] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Sync profile fields from user
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileGender(user.gender || '');
      setProfileDob(user.dateOfBirth || '');
      setSellerForm({
        storeName: user.sellerProfile?.storeName || `${user.name}'s Collection`,
        storeDescription: user.sellerProfile?.storeDescription || '',
        storePhone: user.sellerProfile?.storePhone || user.phone || '',
        storeAddress: user.sellerProfile?.storeAddress || '',
      });
    }
  }, [user]);

  // Load orders, notifications, tickets, and available coupons
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchNotifications();
      fetchTickets();
      fetchAvailableCoupons();
    }
  }, [isAuthenticated]);

  const fetchAvailableCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await api.coupons.getAvailable();
      if (res.success && res.coupons) {
        setCouponsList(res.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.orders.getMy();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.notifications.getAll();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadNotificationCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await api.support.getMyTickets();
      if (res.success) {
        setTickets(res.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setIsUploadingPhoto(true);
    try {
      await api.auth.uploadProfilePhoto(formData);
      await updateProfile({}); // Refresh context
      setProfileSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to upload photo');
      setTimeout(() => setProfileErrorMsg(''), 3000);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Remove Photo Handler
  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      await api.auth.removeProfilePhoto();
      await updateProfile({});
      setProfileSuccessMsg('Profile photo removed.');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to remove photo');
      setTimeout(() => setProfileErrorMsg(''), 3000);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        gender: profileGender,
        dateOfBirth: profileDob,
      });
      setProfileSuccessMsg('Personal information updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3500);
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    try {
      const res = await api.orders.cancel(cancelModalOrder._id, cancelReason);
      if (res.success) {
        setCancelModalOrder(null);
        fetchOrders();
        fetchNotifications();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  // Return or Exchange Order Handler
  const handleReturnOrder = async () => {
    if (!returnModalOrder) return;
    setIsReturning(true);
    try {
      const res = await api.orders.return(returnModalOrder._id, {
        reason: returnReason,
        requestType: returnRequestType,
        exchangeNote,
      });
      if (res.success) {
        setReturnModalOrder(null);
        fetchOrders();
        fetchNotifications();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit return/exchange request');
    } finally {
      setIsReturning(false);
    }
  };

  // Simulate Delivery Handler (Fast-track to test Return / Exchange)
  const handleSimulateDelivery = async (order) => {
    setDeliveringId(order._id);
    try {
      const res = await api.orders.deliver(order._id);
      if (res.success) {
        await fetchOrders();
        await fetchNotifications();
      }
    } catch (err) {
      alert(err.message || 'Failed to mark order as delivered');
    } finally {
      setDeliveringId(null);
    }
  };

  // Address Submit Handler
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await api.auth.updateAddress(editingAddressId, addressForm);
        setAddressSuccessMsg('Address updated successfully!');
      } else {
        await api.auth.addAddress(addressForm);
        setAddressSuccessMsg('New address added successfully!');
      }
      await updateProfile({});
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United Kingdom',
        landmark: '',
        addressType: 'Home',
        isDefault: false,
      });
      setTimeout(() => setAddressSuccessMsg(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to save address');
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'United Kingdom',
      landmark: addr.landmark || '',
      addressType: addr.addressType || 'Home',
      isDefault: addr.isDefault || false,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    try {
      await api.auth.deleteAddress(addrId);
      await updateProfile({});
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      await api.auth.setDefaultAddress(addrId);
      await updateProfile({});
    } catch (err) {
      alert(err.message || 'Failed to set default address');
    }
  };

  // Notification Click
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await api.notifications.markRead(notif._id).catch(() => {});
      fetchNotifications();
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.notifications.markAllRead().catch(() => {});
    fetchNotifications();
  };

  // Support Ticket Submit
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    try {
      const res = await api.support.createTicket(ticketForm);
      if (res.success) {
        setShowNewTicketModal(false);
        setTicketForm({ category: 'Order Issue', subject: '', message: '', orderNumber: '' });
        fetchTickets();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit ticket');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      const res = await api.support.reply(selectedTicket._id, replyMessage.trim());
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyMessage('');
        fetchTickets();
      }
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    }
  };

  // Activate Seller Mode
  const handleActivateSeller = async (e) => {
    e.preventDefault();
    setIsActivatingSeller(true);
    try {
      const res = await api.auth.activateSeller(sellerForm);
      if (res.success) {
        setSellerSuccessMsg('Congratulations! Your seller account is now active.');
        await updateProfile({});
      }
    } catch (err) {
      alert(err.message || 'Failed to activate seller account');
    } finally {
      setIsActivatingSeller(false);
    }
  };

  // Copy Coupon Code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      orderSearchQuery === '' ||
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.items?.some((it) => it.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (orderStatusFilter === 'ALL') return true;
    if (orderStatusFilter === 'ON_THE_WAY')
      return ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(order.orderStatus);
    if (orderStatusFilter === 'DELIVERED') return order.orderStatus === 'delivered';
    if (orderStatusFilter === 'CANCELLED') return order.orderStatus === 'cancelled';
    if (orderStatusFilter === 'RETURNED') return order.orderStatus === 'returned';
    return true;
  });

  return (
    <div className="bg-[#F1F3F6] min-h-screen py-6 sm:py-10 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Indicator */}
        <div className="text-xs text-neutral-500 mb-4 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/account" className="hover:text-blue-600 transition-colors">
            My Account
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-semibold capitalize">{activeTab}</span>
        </div>

        {/* Main Flipkart-Style 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ================= LEFT SIDEBAR (FLIPKART STYLE) ================= */}
          <div className={`${mobileSubpageOpen ? 'hidden lg:block' : 'block'} lg:col-span-4 xl:col-span-3 space-y-4`}>
            {/* User Profile Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/70 flex items-center space-x-3.5">
              <div className="relative group">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Update profile photo"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-neutral-400 font-medium leading-none">Hello,</p>
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 truncate mt-1">
                  {user?.name || 'Customer'}
                </h2>
                {user?.isSeller && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded bg-purple-100 text-purple-700">
                    Seller Partner
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Menu List matching Screenshot */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200/70 overflow-hidden text-xs">
              {/* MY ORDERS */}
              <div className="border-b border-neutral-100">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 font-bold transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="uppercase tracking-wider">MY ORDERS</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* ACCOUNT SETTINGS GROUP */}
              <div className="border-b border-neutral-100 py-2">
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>ACCOUNT SETTINGS</span>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-10 py-2 font-medium transition-colors ${
                    activeTab === 'profile' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-10 py-2 font-medium transition-colors ${
                    activeTab === 'addresses' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  Manage Addresses
                </button>
              </div>

              {/* PAYMENTS & REWARDS */}
              <div className="border-b border-neutral-100 py-2">
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 flex items-center space-x-2">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                  <span>PAYMENTS & REWARDS</span>
                </div>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full text-left px-10 py-2 font-medium flex items-center justify-between transition-colors ${
                    activeTab === 'rewards' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <span>VEXIVO Plus Zone</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                    {user?.rewardPoints || 100} pts
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full text-left px-10 py-2 font-medium transition-colors ${
                    activeTab === 'coupons' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  Gift Cards & Coupons
                </button>
              </div>

              {/* MY STUFF */}
              <div className="border-b border-neutral-100 py-2">
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 flex items-center space-x-2">
                  <Heart className="w-3.5 h-3.5 text-neutral-400" />
                  <span>MY STUFF</span>
                </div>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-10 py-2 font-medium flex items-center justify-between transition-colors ${
                    activeTab === 'wishlist' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <span>My Wishlist</span>
                  <span className="text-[11px] text-neutral-400">({wishlist?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-10 py-2 font-medium flex items-center justify-between transition-colors ${
                    activeTab === 'notifications' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <span>Notification Preferences</span>
                  {unreadNotificationCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full text-left px-10 py-2 font-medium transition-colors ${
                    activeTab === 'support' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  24x7 Customer Care
                </button>
              </div>

              {/* BECOME A SELLER / SELLER DASHBOARD */}
              <div className="border-b border-neutral-100 p-2">
                {user?.isSeller ? (
                  <Link
                    to="/account/seller"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 text-purple-900 font-bold hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Store className="w-4 h-4 text-purple-700" />
                      <span>Seller Dashboard</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-700" />
                  </Link>
                ) : (
                  <Link
                    to="/become-a-seller"
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-amber-50/80 text-amber-900 font-bold hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Become a Seller</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </Link>
                )}
              </div>

              {/* LOGOUT */}
              <div className="p-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <div className={`${mobileSubpageOpen ? 'block' : 'hidden lg:block'} lg:col-span-8 xl:col-span-9 bg-white rounded-xl shadow-sm border border-neutral-200/70 p-4 sm:p-6 lg:p-8 min-h-[550px]`}>
            {/* Phone App Back Navigation Header (Only visible on Mobile Phones when a subpage is open) */}
            <div className="lg:hidden flex items-center space-x-3 pb-3.5 mb-4 border-b border-neutral-100">
              <button
                type="button"
                onClick={handleBackToMobileMenu}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 active:scale-90 transition-transform flex-shrink-0"
                aria-label="Back to Account Menu"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-extrabold text-neutral-900 truncate">
                  {activeTab === 'orders' ? 'My Orders' :
                   activeTab === 'profile' ? 'Personal Information' :
                   activeTab === 'addresses' ? 'Manage Addresses' :
                   activeTab === 'wishlist' ? 'My Wishlist' :
                   activeTab === 'coupons' ? 'Gift Cards & Coupons' :
                   activeTab === 'rewards' ? 'VEXIVO Plus Zone' :
                   activeTab === 'notifications' ? 'Notifications' :
                   activeTab === 'support' ? '24x7 Customer Care' : 'Account Details'}
                </h2>
                <p className="text-[10px] text-neutral-400">Back to all options</p>
              </div>
            </div>

            {/* ---------------- 1. MY ORDERS TAB (FLIPKART STYLE) ---------------- */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      My Orders ({orders.length})
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Track your packages, download invoices, cancel or request returns
                    </p>
                  </div>

                  {/* Order Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search orders by item or ID..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
                  {[
                    { key: 'ALL', label: 'All Orders' },
                    { key: 'ON_THE_WAY', label: 'On The Way' },
                    { key: 'DELIVERED', label: 'Delivered' },
                    { key: 'CANCELLED', label: 'Cancelled' },
                    { key: 'RETURNED', label: 'Returned' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setOrderStatusFilter(filter.key)}
                      className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                        orderStatusFilter === filter.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                {ordersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-xs font-medium text-neutral-500">Loading your orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-neutral-50/50 rounded-2xl border border-neutral-100 p-8">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto" />
                    <h3 className="text-sm font-bold text-neutral-800">No matching orders found</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Explore our collections and place your first order. It will appear right here with full tracking!
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block mt-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const isDelivered = order.orderStatus === 'delivered';
                      const isCancelled = order.orderStatus === 'cancelled';
                      const isReturned = order.orderStatus === 'returned';
                      const isEligibleForCancel = ['pending', 'confirmed', 'processing'].includes(order.orderStatus);

                      const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
                      const deliveryEstimatedDate = order?.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(orderDate.getTime() + 4 * 24 * 3600 * 1000);
                      const deliveredTime = deliveryEstimatedDate;
                      const isOutForDelivery = order.orderStatus === 'out_for_delivery';
                      const isShipped = ['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus);

                      return (
                        <div key={order._id} className="space-y-4">
                          {/* ========================================================================= */}
                          {/* FLIPKART MOBILE PHONE ORDER CARD (sm:hidden - STRICTLY FOR MOBILE PHONES) */}
                          {/* ========================================================================= */}
                          <div className="sm:hidden bg-white border border-neutral-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
                            {/* 1. Status Row with Indicator Dot */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2.5">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                                    isDelivered
                                      ? 'bg-[#26a541]'
                                      : isCancelled
                                      ? 'bg-red-500'
                                      : isReturned
                                      ? 'bg-amber-500'
                                      : 'bg-[#2874f0] animate-pulse'
                                  }`}
                                />
                                <div>
                                  <p className="text-[13px] font-bold text-neutral-900 leading-tight">
                                    {isDelivered
                                      ? `Delivered on ${formatFlipkartDate(deliveredTime)}`
                                      : isCancelled
                                      ? `Cancelled`
                                      : isReturned
                                      ? `Returned`
                                      : isOutForDelivery
                                      ? `Out for delivery today`
                                      : isShipped
                                      ? `Expected delivery by ${formatShortDate(deliveryEstimatedDate)}`
                                      : `Order Confirmed, ${formatShortDate(orderDate)}`}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 mt-0.5">
                                    {isDelivered
                                      ? 'Your item has been delivered'
                                      : isCancelled
                                      ? 'Order was cancelled'
                                      : isReturned
                                      ? 'Return processed successfully'
                                      : isOutForDelivery
                                      ? 'Arriving today by 9 PM'
                                      : isShipped
                                      ? 'Your item is on the way'
                                      : 'Seller has processed your order'}
                                  </p>
                                </div>
                              </div>

                              <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase">
                                #{order.orderNumber?.slice(-6) || order.orderNumber}
                              </span>
                            </div>

                            {/* 2. Items List */}
                            <div className="divide-y divide-neutral-100">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex items-start space-x-3">
                                  <Link to={`/product/${item.slug || ''}`} className="flex-shrink-0">
                                    <img
                                      src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80'}
                                      alt={item.name}
                                      className="w-16 h-18 object-cover rounded-lg bg-neutral-50 border border-neutral-200/80"
                                    />
                                  </Link>
                                  <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.slug || ''}`}>
                                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-snug">
                                        {item.name}
                                      </h4>
                                    </Link>
                                    {item.variant && (
                                      <p className="text-[11px] text-neutral-500 mt-0.5">
                                        Size: {item.variant}
                                      </p>
                                    )}
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs font-extrabold text-neutral-900">
                                        ₹{Number(item.price || 0).toFixed(2)}
                                      </span>
                                      <span className="text-[11px] text-neutral-400">
                                        Qty: {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* 3. Flipkart Compact 2-Step Tracker */}
                            <div className="pt-2 border-t border-neutral-100">
                              <CustomerShipmentTracker order={order} />
                            </div>

                            {/* 4. Flipkart "Rate & Review Product" (Only on Delivered orders) */}
                            {isDelivered && (
                              <div className="pt-2.5 pb-1 border-t border-neutral-100 flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-neutral-700">
                                  Rate & Review Product
                                </span>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => {
                                        if (order.items?.[0]?.slug) {
                                          navigate(`/product/${order.items[0].slug}`);
                                        }
                                      }}
                                      className="p-0.5 text-neutral-300 hover:text-amber-400 focus:outline-none"
                                      aria-label={`Rate ${s} stars`}
                                    >
                                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 5. Mobile Action Buttons Row */}
                            <div className="pt-2.5 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                              <button
                                onClick={() => handleBuyAgain(order)}
                                disabled={buyingAgainId === order._id}
                                className="flex-1 min-w-[90px] py-2 px-3 rounded-lg bg-[#2874f0] text-white text-[11px] font-bold flex items-center justify-center space-x-1 shadow-2xs active:scale-95 transition-transform"
                              >
                                <RotateCcw className="w-3 h-3 flex-shrink-0" />
                                <span>{buyingAgainId === order._id ? 'Adding...' : 'Buy Again'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setTicketForm({
                                    category: 'Order Issue',
                                    subject: `Assistance with Order #${order.orderNumber}`,
                                    message: '',
                                    orderNumber: order.orderNumber,
                                  });
                                  setActiveTab('support');
                                  setShowNewTicketModal(true);
                                }}
                                className="py-2 px-3 rounded-lg border border-neutral-200 text-neutral-700 text-[11px] font-bold flex items-center justify-center space-x-1 active:bg-neutral-50 transition-colors whitespace-nowrap"
                              >
                                <HelpCircle className="w-3 h-3 text-[#2874f0] flex-shrink-0" />
                                <span>Help</span>
                              </button>

                              <button
                                onClick={() => window.print()}
                                className="py-2 px-3 rounded-lg border border-neutral-200 text-neutral-700 text-[11px] font-semibold flex items-center justify-center space-x-1 active:bg-neutral-50 transition-colors whitespace-nowrap"
                              >
                                <FileText className="w-3 h-3 flex-shrink-0" />
                                <span>Invoice</span>
                              </button>

                              {isEligibleForCancel && (
                                <button
                                  onClick={() => setCancelModalOrder(order)}
                                  className="py-2 px-3 rounded-lg border border-red-200 text-red-600 text-[11px] font-bold flex items-center justify-center active:bg-red-50 transition-colors whitespace-nowrap"
                                >
                                  Cancel
                                </button>
                              )}

                              {isDelivered && (
                                <button
                                  onClick={() => {
                                    setReturnModalOrder(order);
                                    setReturnRequestType('return');
                                    setExchangeNote('');
                                  }}
                                  className="py-2 px-3 rounded-lg border border-amber-300 text-amber-800 text-[11px] font-bold flex items-center justify-center active:bg-amber-50 transition-colors whitespace-nowrap"
                                >
                                  Return
                                </button>
                              )}
                            </div>
                          </div>

                          {/* ========================================================================= */}
                          {/* DESKTOP ORDER CARD (hidden sm:block - 100% UNCHANGED FOR LAPTOP / PC)     */}
                          {/* ========================================================================= */}
                          <div className="hidden sm:block border border-neutral-200 rounded-xl p-4 sm:p-5 hover:border-neutral-300 hover:shadow-sm transition-all bg-white">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-100 text-xs gap-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-neutral-900 font-mono">
                                #{order.orderNumber}
                              </span>
                              <span className="text-neutral-400">•</span>
                              <span className="text-neutral-500">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            {/* Status Pills */}
                            <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                              <span
                                className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  isDelivered
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : isCancelled
                                    ? 'bg-red-50 text-red-700'
                                    : isReturned
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isDelivered
                                      ? 'bg-emerald-500'
                                      : isCancelled
                                      ? 'bg-red-500'
                                      : isReturned
                                      ? 'bg-amber-500'
                                      : 'bg-blue-500 animate-pulse'
                                  }`}
                                />
                                <span>{order.orderStatus?.replace('_', ' ')}</span>
                              </span>

                              {/* Payment Status Pill */}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.paymentStatus === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : order.paymentStatus === 'refunded'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                }`}
                              >
                                {order.paymentStatus === 'paid'
                                  ? 'Paid'
                                  : order.paymentStatus === 'refunded'
                                  ? 'Refunded'
                                  : (order.paymentMethod?.toLowerCase().includes('cash') || order.paymentMethod?.toLowerCase().includes('cod'))
                                  ? 'Cash on Delivery (Pending)'
                                  : order.paymentDetails?.utrNumber
                                  ? 'UPI (Under Verification)'
                                  : 'Payment Pending'}
                              </span>
                            </div>
                          </div>

                          {/* Items Grid */}
                          <div className="divide-y divide-neutral-100 py-1">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-center space-x-3.5">
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80'}
                                    alt={item.name}
                                    className="w-16 h-20 object-cover rounded-lg bg-neutral-100 flex-shrink-0 border border-neutral-100"
                                  />
                                  <div className="space-y-1">
                                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-blue-600 transition-colors">
                                      {item.name}
                                    </h4>
                                    {item.variant && (
                                      <p className="text-[11px] text-neutral-500">Size / Variant: {item.variant}</p>
                                    )}
                                    <p className="text-[11px] text-neutral-400">
                                      Sold by:{' '}
                                      <strong className="text-neutral-700 font-semibold">
                                        {item.sellerName || 'VEXIVO Official'}
                                      </strong>
                                    </p>
                                    <p className="text-xs font-bold text-neutral-900">
                                      ₹{item.price?.toFixed(2)}{' '}
                                      <span className="text-neutral-400 font-normal">× {item.quantity}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                  <span className="text-xs text-neutral-400 hidden sm:inline">Subtotal</span>
                                  <span className="text-sm font-extrabold text-neutral-900">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => {
                                      addToCart(item, 1);
                                      navigate('/cart');
                                    }}
                                    className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-neutral-200 hover:border-blue-600 text-[11px] font-bold text-neutral-700 hover:text-blue-600 transition-colors"
                                    title="Buy this product again"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Buy Again</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Real-time Multi-Stage Logistics Stepper & Location */}
                          <div className="pt-4 border-t border-neutral-100">
                            <CustomerShipmentTracker order={order} />

                            {/* Return & Refund Status Card */}
                            {order.returnDetails?.status && order.returnDetails.status !== 'none' && (
                              <div className="mt-3.5 p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-purple-950">
                                <div className="flex items-center space-x-2.5">
                                  <RotateCcw className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                  <div>
                                    <p className="font-bold">
                                      Return Status: <span className="uppercase">{order.returnDetails.status.replace('_', ' ')}</span>
                                    </p>
                                    <p className="text-[11px] text-purple-700">
                                      Refund Mode: {order.returnDetails.refundMethod || 'Original Payment Method'} • Refund: <strong className="capitalize">{order.returnDetails.refundStatus || 'Processing'}</strong>
                                    </p>
                                  </div>
                                </div>
                                {order.returnDetails.returnPickupOtp && order.returnDetails.status !== 'completed' && order.returnDetails.status !== 'refunded' && (
                                  <div className="bg-white px-3 py-1 rounded-xl border border-purple-200 text-center">
                                    <span className="text-[9px] uppercase font-bold text-purple-700 block">Return Pickup OTP</span>
                                    <span className="font-mono font-black text-purple-900 text-sm tracking-widest">
                                      {order.returnDetails.returnPickupOtp}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Order Actions Toolbar */}
                          <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                              <span className="text-neutral-500">
                                {order.paymentStatus === 'paid'
                                  ? 'Total Paid:'
                                  : (order.paymentMethod?.toLowerCase().includes('cash') || order.paymentMethod?.toLowerCase().includes('cod'))
                                  ? 'To Pay on Delivery:'
                                  : 'Amount (Pending Verification):'}
                              </span>
                              <span className="text-base font-extrabold text-neutral-900">
                                ₹{order.total?.toFixed(2)}
                              </span>
                              <span className="text-[11px] font-semibold text-neutral-400">
                                ({order.paymentMethod || 'Online'})
                              </span>
                              {order.paymentDetails?.utrNumber && (
                                <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                                  UTR: {order.paymentDetails.utrNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                              {/* Buy Again Button */}
                              <button
                                onClick={() => handleBuyAgain(order)}
                                disabled={buyingAgainId === order._id}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                              >
                                {buyingAgainId === order._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                )}
                                <span>{buyingAgainId === order._id ? 'Adding to Bag...' : 'Buy Again'}</span>
                              </button>

                              {/* Cancel Button */}
                              {isEligibleForCancel && (
                                <button
                                  onClick={() => setCancelModalOrder(order)}
                                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}


                              {/* Return / Exchange Button */}
                              {isDelivered && (
                                <button
                                  onClick={() => {
                                    setReturnModalOrder(order);
                                    setReturnRequestType('return');
                                    setExchangeNote('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold transition-colors flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Return / Exchange</span>
                                </button>
                              )}

                              {/* Print / Download Invoice */}
                              <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black text-neutral-700 hover:text-black font-semibold transition-colors flex items-center space-x-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>GST Invoice</span>
                              </button>

                              {/* Need Help Button */}
                              <button
                                onClick={() => {
                                  setTicketForm({
                                    category: 'Order Issue',
                                    subject: `Assistance with Order #${order.orderNumber}`,
                                    message: '',
                                    orderNumber: order.orderNumber,
                                  });
                                  setActiveTab('support');
                                  setShowNewTicketModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition-colors flex items-center space-x-1"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Need Help?</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 2. PROFILE INFORMATION TAB ---------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <div className="pb-4 border-b border-neutral-100">
                  <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                    Personal Information
                  </h1>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Manage your personal details, gender, and date of birth
                  </p>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 text-red-800 text-xs font-bold border border-red-200 flex items-center space-x-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                {/* Profile Photo Uploader */}
                <div className="flex items-center space-x-5 p-4 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-neutral-900">Profile Photo</p>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-black text-xs font-bold text-neutral-800 shadow-sm transition-all"
                      >
                        {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                      </button>
                      {user?.profilePhoto && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400">JPG, PNG or WEBP, max 5MB</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs text-neutral-900"
                    />
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Your Gender
                    </label>
                    <div className="flex items-center space-x-6">
                      {['male', 'female', 'other'].map((genderOption) => (
                        <label
                          key={genderOption}
                          className="inline-flex items-center space-x-2 cursor-pointer font-medium capitalize text-neutral-700"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={genderOption}
                            checked={profileGender === genderOption}
                            onChange={(e) => setProfileGender(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>{genderOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)}
                      className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs text-neutral-900"
                    />
                  </div>

                  {/* Registered Login Email (Locked & Non-Editable) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-neutral-700 uppercase tracking-wider flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Registered Login Email</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Non-Editable (Permanent Login ID)</span>
                      </span>
                    </div>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-600 cursor-not-allowed text-xs font-mono font-bold select-none shadow-2xs"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      🔒 Yeh aapka registered login email hai. Account security ke liye ise edit nahi kiya ja sakta.
                    </p>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs text-neutral-900 font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------------- 3. MANAGE ADDRESSES TAB ---------------- */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      Manage Addresses
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Save multiple delivery addresses for seamless 1-click checkout
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm({
                        fullName: user?.name || '',
                        phone: user?.phone || '',
                        street: '',
                        city: '',
                        state: 'Maharashtra',
                        postalCode: '',
                        country: 'India',
                        landmark: '',
                        addressType: 'Home',
                        isDefault: false,
                      });
                      setShowAddressForm(!showAddressForm);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD A NEW ADDRESS</span>
                  </button>
                </div>

                {addressSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{addressSuccessMsg}</span>
                  </div>
                )}

                {/* Add / Edit Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 animate-fade-in text-xs"
                  >
                    <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="Full Name"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="10-digit mobile"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-neutral-700 mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="House No., Building Name, Street / Road"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">City / Town *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="e.g. Mumbai, Bengaluru, Jaipur"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">6-Digit Indian PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 400001, 560103"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">State / UT *</label>
                        <select
                          value={addressForm.state || 'Maharashtra'}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="e.g. Near Metro Station / Apollo Pharmacy"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* Address Type Selection (Home / Work) */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">Address Type</label>
                      <div className="flex items-center space-x-4">
                        {['Home', 'Work'].map((type) => (
                          <label key={type} className="inline-flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={addressForm.addressType === type}
                              onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                              className="text-blue-600"
                            />
                            <span className="font-semibold">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-700 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Saved Addresses List */}
                <div className="space-y-3">
                  {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-4 sm:p-5 rounded-xl border transition-all text-xs ${
                          addr.isDefault
                            ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                                {addr.addressType || 'Home'}
                              </span>
                              <span className="font-bold text-neutral-900">
                                {addr.fullName || user.name}
                              </span>
                              <span className="font-mono text-neutral-500 font-medium">
                                {addr.phone || user.phone}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-600 leading-relaxed pt-1">
                              {addr.street}, {addr.city} {addr.state && `• ${addr.state}`} -{' '}
                              <strong className="font-mono text-neutral-900">{addr.postalCode}</strong>
                            </p>
                            {addr.landmark && (
                              <p className="text-[11px] text-neutral-400">Landmark: {addr.landmark}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors"
                              title="Edit address"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors"
                              title="Delete address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {!addr.isDefault && (
                          <div className="pt-2 mt-2 border-t border-neutral-100">
                            <button
                              onClick={() => handleSetDefaultAddress(addr._id)}
                              className="text-[11px] font-bold text-blue-600 hover:underline"
                            >
                              Set as Default Address
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-neutral-50 rounded-xl text-neutral-500 text-xs">
                      No addresses saved yet. Click "+ ADD A NEW ADDRESS" to add one!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 4. MY WISHLIST TAB ---------------- */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      My Wishlist ({wishlist?.length || 0})
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Items you saved for later purchase
                    </p>
                  </div>
                  <Link to="/shop" className="text-xs font-bold text-blue-600 hover:underline">
                    Continue Shopping
                  </Link>
                </div>

                {!wishlist || wishlist.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-neutral-50/50 rounded-2xl border border-neutral-100 p-8">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
                    <h3 className="text-sm font-bold text-neutral-800">Your wishlist is empty</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Explore trending fashion, accessories, and shoes. Tap the heart icon to save items!
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block mt-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((product) => (
                      <div
                        key={product._id}
                        className="rounded-xl border border-neutral-200 p-3 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={product.images?.[0] || product.thumbnail}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeFromWishlist(product._id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 transition-colors shadow"
                              title="Remove from wishlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              {product.category}
                            </p>
                            <Link
                              to={`/product/${product.slug}`}
                              className="text-xs font-bold text-neutral-900 hover:text-blue-600 transition-colors line-clamp-1 mt-0.5"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-extrabold text-neutral-900">
                                ₹{product.price?.toFixed(2)}
                              </span>
                              {product.compareAtPrice > product.price && (
                                <span className="text-xs text-neutral-400 line-through">
                                  ₹{product.compareAtPrice?.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-neutral-100">
                          <button
                            onClick={() => {
                              addToCart(product, 1);
                              removeFromWishlist(product._id);
                            }}
                            className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 5. VEXIVO PLUS / SUPERCOINS TAB ---------------- */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-neutral-100">
                  <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                    VEXIVO Plus Zone & SuperCoins
                  </h1>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Earn 2 SuperCoins for every ₹100 spent on VEXIVO India
                  </p>
                </div>

                {/* Reward Balance Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>FLIPKART STYLE PLUS ZONE</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                      {user?.rewardPoints || 100}{' '}
                      <span className="text-base font-semibold text-amber-100">SuperCoins</span>
                    </h3>
                    <p className="text-xs text-amber-100">
                      Equivalent to ₹{((user?.rewardPoints || 100)).toFixed(2)} in instant checkout discounts (1 SuperCoin = ₹1)
                    </p>
                  </div>

                  <Link
                    to="/shop"
                    className="px-5 py-2.5 rounded-xl bg-white text-amber-900 font-extrabold text-xs shadow hover:bg-amber-50 transition-colors self-start sm:self-auto"
                  >
                    Redeem at Checkout
                  </Link>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      🚚
                    </div>
                    <h4 className="font-bold text-neutral-900">Free Pan-India Delivery</h4>
                    <p className="text-neutral-500 text-[11px]">
                      Plus members enjoy zero delivery charge across 28,000+ Indian PIN codes.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <h4 className="font-bold text-neutral-900">Early Access to Big Sales</h4>
                    <p className="text-neutral-500 text-[11px]">
                      Access Big Festive deals and exclusive runway drops 2 hours before general access.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      💎
                    </div>
                    <h4 className="font-bold text-neutral-900">Priority Customer Care</h4>
                    <p className="text-neutral-500 text-[11px]">
                      Fast-track support ticket routing with guaranteed resolution under 4 hours.
                    </p>
                  </div>
                </div>

                {/* Ledger */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Points Activity
                  </h3>
                  <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 text-xs bg-white">
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-neutral-900">Welcome Bonus Credits</p>
                        <p className="text-[11px] text-neutral-400">Account verified</p>
                      </div>
                      <span className="font-bold text-emerald-600">+100 pts</span>
                    </div>
                    {user?.rewardsHistory?.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-900">{item.description}</p>
                          <p className="text-[11px] text-neutral-400">
                            {new Date(item.date).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <span
                          className={`font-bold ${
                            item.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {item.type === 'earned' ? `+${item.points}` : `-${item.points}`} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 6. MY COUPONS & OFFERS TAB ---------------- */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      Available Coupons & Discount Vouchers
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Copy and apply these active discount vouchers during checkout for instant savings in INR (₹)
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all self-start sm:self-auto shadow-sm"
                  >
                    Shop All Offers →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(couponsList.length > 0
                    ? couponsList.map((c) => ({
                        code: c.code,
                        discount: c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`,
                        title: c.description || `${c.code} Promotional Discount`,
                        description: `Save ${c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} on eligible items.`,
                        minSpend: c.minimumOrder ? `Min cart ₹${c.minimumOrder}` : 'No minimum cart amount',
                        expiry: c.expiryDate ? `Expires ${new Date(c.expiryDate).toLocaleDateString('en-GB')}` : 'Active & Verified',
                        badge: c.value >= 25 ? 'HOT DEAL' : 'VERIFIED',
                        color: 'border-blue-200 bg-blue-50/40 text-blue-700',
                      }))
                    : [
                        {
                          code: 'AUTUMN30',
                          discount: '30% OFF',
                          title: 'Autumn Festive Flash Sale',
                          description: 'Valid across Women, Men, Shoes, and Handcrafted Living collections.',
                          minSpend: 'Min purchase ₹499',
                          expiry: 'Valid until 31 Oct 2026',
                          badge: 'MOST POPULAR',
                          color: 'border-red-200 bg-red-50/40 text-red-700',
                        },
                        {
                          code: 'WELCOME10',
                          discount: '10% OFF',
                          title: 'Welcome First Order Discount',
                          description: 'Instant 10% discount on your introductory purchase on VEXIVO India.',
                          minSpend: 'Min purchase ₹299',
                          expiry: 'Lifetime for new customers',
                          badge: 'NEW USER',
                          color: 'border-blue-200 bg-blue-50/40 text-blue-700',
                        },
                        {
                          code: 'FREESHIP',
                          discount: 'FREE DELIVERY',
                          title: 'Free Pan-India Express Courier',
                          description: 'Zero delivery charge on orders across 28,000+ Indian PIN codes.',
                          minSpend: 'Min purchase ₹499',
                          expiry: 'Valid until 31 Dec 2026',
                          badge: 'ALL INDIA',
                          color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
                        },
                        {
                          code: 'FESTIVE25',
                          discount: '₹250 OFF',
                          title: 'Mega Festive Wardrobe Voucher',
                          description: 'Flat ₹250 instant cashback on wardrobe and footwear purchases.',
                          minSpend: 'Min purchase ₹1,499',
                          expiry: 'Valid until 15 Nov 2026',
                          badge: 'MEGA SAVINGS',
                          color: 'border-purple-200 bg-purple-50/40 text-purple-700',
                        },
                      ]
                  ).map((coupon) => (
                    <div
                      key={coupon.code}
                      className="border border-dashed border-neutral-300 rounded-2xl p-5 bg-white space-y-3 relative hover:border-black transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${coupon.color}`}>
                            {coupon.badge}
                          </span>
                          <h3 className="text-xl font-extrabold text-neutral-900 mt-2">
                            {coupon.discount}
                          </h3>
                          <p className="text-xs font-bold text-neutral-700 mt-0.5">{coupon.title}</p>
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
                        >
                          {copiedCoupon === coupon.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{coupon.code}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed">{coupon.description}</p>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                        <span className="text-neutral-700 font-semibold">{coupon.minSpend}</span>
                        <span>{coupon.expiry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------- 7. NOTIFICATIONS TAB ---------------- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      Notification Preferences & Alerts
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Live order status updates, delivery notifications, and exclusive offers
                    </p>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-neutral-50/50 rounded-2xl border border-neutral-100 p-8">
                    <Bell className="w-12 h-12 text-neutral-300 mx-auto" />
                    <h3 className="text-sm font-bold text-neutral-800">All caught up!</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Whenever an order status changes or a new promotion arrives, you'll see it here.
                    </p>
                  </div>
                ) : (
                  <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 bg-white">
                    {notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 flex items-start space-x-3.5 hover:bg-neutral-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            notif.type === 'order'
                              ? 'bg-blue-100 text-blue-700'
                              : notif.type === 'offer'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs ${
                                !notif.read ? 'font-extrabold text-neutral-900' : 'font-semibold text-neutral-700'
                              }`}
                            >
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(notif.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 8. 24x7 CUSTOMER CARE TAB ---------------- */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      24x7 Help Center & Support Tickets
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Need help with an order, return, or delivery? Reach our dedicated support team
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Support Ticket</span>
                  </button>
                </div>

                {/* FAQ Quick Selector */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
                  <p className="font-bold text-neutral-800">Quick Assistance FAQs:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-600">
                    <p>• Returns accepted within 30 days of delivery.</p>
                    <p>• Orders can be cancelled while in processing.</p>
                    <p>• Express courier delivery takes 2-3 business days.</p>
                    <p>• Refunds are processed back to original payment within 48h.</p>
                  </div>
                </div>

                {/* My Tickets List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    My Support Tickets ({tickets.length})
                  </h3>

                  {tickets.length === 0 ? (
                    <div className="py-12 text-center bg-white border border-neutral-200 rounded-xl p-6 text-neutral-500 text-xs">
                      You have no active support tickets. Click "Create Support Ticket" if you require assistance!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((t) => (
                        <div
                          key={t._id}
                          onClick={() => setSelectedTicket(t)}
                          className="border border-neutral-200 rounded-xl p-4 hover:border-blue-600 hover:shadow-sm cursor-pointer transition-all bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-neutral-900">
                                  {t.ticketNumber}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-neutral-100 text-neutral-700">
                                  {t.category}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                    t.status === 'OPEN'
                                      ? 'bg-blue-100 text-blue-800'
                                      : t.status === 'RESOLVED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : t.status === 'CLOSED'
                                      ? 'bg-neutral-100 text-neutral-600'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-neutral-900 mt-1">{t.subject}</h4>
                              <p className="text-[11px] text-neutral-500 line-clamp-1">{t.message}</p>
                            </div>
                            <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                              {new Date(t.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 9. BECOME A SELLER TAB ---------------- */}
            {activeTab === 'seller' && (
              <div className="space-y-6 max-w-3xl">
                <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                      VEXIVO India Seller Hub
                    </h1>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Become a verified marketplace partner and sell to millions of Indian shoppers
                    </p>
                  </div>
                </div>

                {user?.isSeller ? (
                  <div className="p-8 rounded-3xl bg-gradient-to-tr from-purple-900 to-indigo-950 text-white text-center space-y-4 shadow-xl">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-bold">
                      Your Seller Store is Active!
                    </h3>
                    <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                      You are an approved merchant on VEXIVO India. Manage your catalog, inventory, and track sales inside your dedicated Seller Dashboard.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/account/seller"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white text-purple-950 font-bold text-xs shadow-md hover:bg-neutral-100 transition-all"
                      >
                        <Store className="w-4 h-4 text-purple-800" />
                        <span>Enter Seller Dashboard →</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-300/60 space-y-3">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Flipkart Seller Pattern</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-neutral-900">
                        Dedicated Multi-Step Seller Registration Required
                      </h2>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        To maintain high buyer trust, VEXIVO India follows Flipkart seller onboarding standards. To start selling, please complete the verified seller registration wizard with your Indian business details, GSTIN/PAN, pickup address, and bank account for daily INR (₹) payouts.
                      </p>
                    </div>

                    {/* What you need checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
                        <p className="font-bold text-neutral-900 flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>1. GSTIN & Business PAN</span>
                        </p>
                        <p className="text-[11px] text-neutral-500 pl-6">
                          15-digit GSTIN (or craft/handicraft exemption) and 10-digit PAN for legal invoicing.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
                        <p className="font-bold text-neutral-900 flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>2. Dispatch Hub & 6-Digit PIN</span>
                        </p>
                        <p className="text-[11px] text-neutral-500 pl-6">
                          Location where Ekart and Delhivery couriers will collect customer parcels.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
                        <p className="font-bold text-neutral-900 flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>3. Bank Account & IFSC</span>
                        </p>
                        <p className="text-[11px] text-neutral-500 pl-6">
                          Indian Bank account (Current or Savings) for direct sales payouts in INR (₹).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
                        <p className="font-bold text-neutral-900 flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>4. Minimum 1 Product Listing</span>
                        </p>
                        <p className="text-[11px] text-neutral-500 pl-6">
                          Product photographs, description, and ₹ price to launch your boutique.
                        </p>
                      </div>
                    </div>

                    {/* Launch Onboarding Portal Button */}
                    <div className="pt-2 text-center sm:text-left">
                      <Link
                        to="/become-a-seller"
                        className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                      >
                        <Store className="w-4 h-4" />
                        <span>Launch Seller Registration Portal →</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CANCEL ORDER MODAL ================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up text-xs">
            <div className="flex items-center space-x-3 text-red-600 pb-2 border-b border-neutral-100">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-neutral-900">Cancel Order #{cancelModalOrder.orderNumber}</h3>
            </div>

            <p className="text-neutral-500">
              Are you sure you want to cancel this order? Once cancelled, the items will be returned to stock.
            </p>

            <div>
              <label className="block font-bold text-neutral-700 mb-1.5">Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600 bg-white"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found better price elsewhere">Found better price elsewhere</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RETURN / EXCHANGE MODAL ================= */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up text-xs">
            <div className="flex items-center space-x-3 text-amber-600 pb-2 border-b border-neutral-100">
              <RotateCcw className="w-6 h-6" />
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {returnRequestType === 'exchange' ? 'Exchange' : 'Return'} Order #{returnModalOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-neutral-500 font-normal">
                  VEXIVO 30-Day Hassle-Free Return &amp; Exchange Assurance
                </p>
              </div>
            </div>

            {/* Request Type Switcher */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1.5 uppercase tracking-wider text-[10px]">
                Choose Service Type:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReturnRequestType('return')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    returnRequestType === 'return'
                      ? 'border-amber-500 bg-amber-50/60 text-amber-900 shadow-2xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-xs">🔄 Return &amp; Refund</p>
                  <p className="text-[10px] font-normal text-neutral-500 mt-0.5">
                    Doorstep pickup &amp; full refund
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReturnRequestType('exchange')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    returnRequestType === 'exchange'
                      ? 'border-blue-500 bg-blue-50/60 text-blue-900 shadow-2xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-xs">🔁 Size / Color Exchange</p>
                  <p className="text-[10px] font-normal text-neutral-500 mt-0.5">
                    Fast replacement dispatched
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1.5">
                Reason for {returnRequestType === 'exchange' ? 'Exchange' : 'Return'}:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600 bg-white"
              >
                <option value="Size doesn't fit (Need Exchange)">Size doesn't fit (Need Exchange)</option>
                <option value="Defective or damaged product">Defective or damaged product</option>
                <option value="Wrong item or size received">Wrong item or size received</option>
                <option value="Quality not as expected">Quality not as expected</option>
                <option value="Don't want the item anymore">Don't want the item anymore</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            {returnRequestType === 'exchange' && (
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  Exchange Preference / Details:
                </label>
                <input
                  type="text"
                  value={exchangeNote}
                  onChange={(e) => setExchangeNote(e.target.value)}
                  placeholder="e.g. Need size 32 instead of 30, or replace with Blue variant"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600 text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnOrder}
                disabled={isReturning}
                className={`px-4 py-2 rounded-lg text-white font-bold transition-colors ${
                  returnRequestType === 'exchange'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isReturning
                  ? 'Submitting...'
                  : returnRequestType === 'exchange'
                  ? 'Submit Exchange Request'
                  : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW SUPPORT TICKET MODAL ================= */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTicket}
            className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Create New Support Ticket</h3>
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Issue Category *</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600 bg-white"
              >
                <option value="Order Issue">Order Issue</option>
                <option value="Delivery Issue">Delivery Issue</option>
                <option value="Return/Refund">Return / Refund</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Product Issue">Product Quality Issue</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Related Order Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. VEX-891234"
                value={ticketForm.orderNumber}
                onChange={(e) => setTicketForm({ ...ticketForm, orderNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your query"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Description / Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe the issue in detail..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow"
              >
                {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TICKET CONVERSATION MODAL ================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 flex-shrink-0">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedTicket.ticketNumber}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Replies Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedTicket.replies?.map((rep, rIdx) => {
                const isAdminReply = rep.senderRole === 'admin';
                return (
                  <div
                    key={rIdx}
                    className={`p-3.5 rounded-xl space-y-1 ${
                      isAdminReply
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span>{isAdminReply ? '🛡️ VEXIVO Support Specialist' : rep.senderName}</span>
                      <span className="text-neutral-400 font-normal">
                        {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{rep.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendTicketReply} className="pt-2 border-t border-neutral-100 flex-shrink-0 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your response here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-blue-600 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
