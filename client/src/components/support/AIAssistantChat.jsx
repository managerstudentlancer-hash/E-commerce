import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RotateCcw,
  ShoppingBag,
  Package,
  Truck,
  RotateCcw as ReturnIcon,
  CreditCard,
  Headphones,
  Tag,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Plus,
  Loader2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const DEFAULT_SUGGESTIONS = [
  { label: '🛍️ Find Sarees', prompt: 'Show me sarees under ₹1500.' },
  { label: '📦 Track My Order', prompt: 'Where is my order?' },
  { label: '🎁 Offers & Coupons', prompt: 'Any offers or coupons on sarees?' },
  { label: '💎 Match Jewellery', prompt: 'Which jewellery goes with a saree?' },
  { label: '↩️ Return / Refund', prompt: 'I want to return my order.' },
  { label: '💳 Payment Help', prompt: 'My payment failed.' },
];

const ORDER_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const AIAssistantChat = ({ onOpenTicketModal }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I’m your **VEXIVO AI Assistant**.

I can automatically help you track orders in real-time, find products, apply discount coupons, and handle returns or cancellations directly in this chat!

How can I help you today?`,
      timestamp: new Date(),
      data: null,
      suggestedActions: DEFAULT_SUGGESTIONS.map((s) => s.prompt),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Copy coupon handler
  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  // Add to cart directly from chat card
  const handleAddToCart = async (product, variant = '') => {
    if (!product) return;
    const prodId = product._id || product.id;
    const chosenVariant = variant || selectedVariants[prodId] || 'Free Size';

    setAddingProductId(prodId);
    try {
      await addToCart(
        {
          _id: prodId,
          id: prodId,
          name: product.name,
          price: product.price,
          image: product.image || product.thumbnail,
          slug: product.slug,
          category: product.category,
          variant: chosenVariant,
        },
        1
      );
      setAddedProductId(prodId);
      setTimeout(() => setAddedProductId(null), 2500);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingProductId(null);
    }
  };

  // Autonomous Client-side fallback handler if network fails
  const getAutonomousFallbackResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('saree') || q.includes('sari')) {
      return {
        reply: `Here are our handcrafted luxury sarees available in the catalog with 30-day doorstep returns:`,
        data: {
          actionType: 'PRODUCT_GRID',
          products: [
            {
              _id: 'sar-1',
              name: 'Banarasi Art Silk Zari Woven Saree',
              price: 1299,
              compareAtPrice: 1999,
              discount: 35,
              rating: 4.8,
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
              slug: 'banarasi-art-silk-zari-woven-saree',
            },
            {
              _id: 'sar-2',
              name: 'Chanderi Pure Cotton Handloom Saree',
              price: 999,
              compareAtPrice: 1699,
              discount: 41,
              rating: 4.7,
              image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
              slug: 'chanderi-pure-cotton-handloom-saree',
            },
            {
              _id: 'sar-3',
              name: 'Floral Printed Georgette Party Wear Saree',
              price: 899,
              compareAtPrice: 1499,
              discount: 40,
              rating: 4.6,
              image: 'https://images.unsplash.com/photo-1610030469668-9655ec843f55?auto=format&fit=crop&w=600&q=80',
              slug: 'floral-printed-georgette-party-wear-saree',
            },
          ],
        },
        suggestedActions: ['🎁 View Coupons', '💎 Match Jewellery', '📦 Track My Order'],
      };
    }

    if (q.includes('order') || q.includes('track') || q.includes('status')) {
      return {
        reply: `You can track all your live order shipments, check estimated delivery times, and schedule doorstep pickups below:`,
        data: {
          actionType: 'INFO',
        },
        suggestedActions: ['Show sarees under ₹1500', '🎁 View Offers', '↩️ Return Policy'],
      };
    }

    return {
      reply: `I’m here to help you shop with ease! You can discover sarees, track live orders, grab discount coupons, or get styling recommendations.`,
      data: {
        actionType: 'OFFERS_AND_COUPONS',
        coupons: [
          { code: 'AUTUMN30', discountDisplay: '30% OFF', minimumOrder: 999 },
          { code: 'SAREE20', discountDisplay: '20% OFF', minimumOrder: 1499 },
        ],
      },
      suggestedActions: ['Show sarees under ₹1500', '📦 Track My Order', '🎁 View Offers'],
    };
  };

  // Send message to AI backend
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessageObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages
        .slice(-8)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const res = await api.ai.chat({
        message: text,
        history,
      });

      const aiMessageObj = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply || "I'm here to assist you with any questions about VEXIVO products and orders.",
        timestamp: new Date(),
        data: res.data || null,
        suggestedActions: res.suggestedActions || [],
      };

      setMessages((prev) => [...prev, aiMessageObj]);
    } catch (error) {
      console.warn('Backend chat notice, switching to autonomous fallback:', error.message);
      const fallback = getAutonomousFallbackResponse(text);

      const aiMessageObj = {
        id: `ai-fb-${Date.now()}`,
        sender: 'ai',
        text: fallback.reply,
        timestamp: new Date(),
        data: fallback.data,
        suggestedActions: fallback.suggestedActions,
      };

      setMessages((prev) => [...prev, aiMessageObj]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle 1-Click Cancel Order Confirmation from Chat Card
  const handleConfirmCancelOrder = async (orderId, orderNumber) => {
    if (actionInProgress) return;
    setActionInProgress(true);
    try {
      await api.ai.cancelOrder(orderId, 'Cancelled with 1-click confirmation via AI Assistant');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-cancel-${Date.now()}`,
          sender: 'ai',
          text: `✅ **Order #${orderNumber || orderId} has been successfully cancelled.**\n\nA full refund has been initiated to your original payment method within 48 hours.`,
          timestamp: new Date(),
          data: null,
          suggestedActions: ['🛍️ Continue Shopping', '🎁 View Deals', '📦 Check My Orders'],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-cancel-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Order status update:** ${err.message || 'Please check order status in account.'}`,
          timestamp: new Date(),
          data: null,
          suggestedActions: ['📦 View My Orders', '🛍️ Browse Products'],
        },
      ]);
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle 1-Click Return Request from Chat Card
  const handleInitiateReturn = async (orderId, orderNumber, requestType = 'return') => {
    if (actionInProgress) return;
    setActionInProgress(true);
    try {
      await api.ai.returnOrder(orderId, {
        reason: 'Initiated via AI Assistant',
        requestType,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-return-${Date.now()}`,
          sender: 'ai',
          text: `📦 **${requestType === 'exchange' ? 'Exchange' : 'Return'} Request Submitted for Order #${orderNumber || orderId}!**\n\nDoorstep pickup will arrive at your address within 24–48 hours. Zero additional fee!`,
          timestamp: new Date(),
          data: null,
          suggestedActions: ['📦 View My Orders', '🎁 View Deals', '🛍️ Browse Products'],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-ret-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Notice:** ${err.message || 'Unable to submit return.'}`,
          timestamp: new Date(),
          data: null,
          suggestedActions: ['📦 Check Orders', '🛍️ Continue Shopping'],
        },
      ]);
    } finally {
      setActionInProgress(false);
    }
  };

  // Clear / Reset Chat Session
  const handleNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I’m your **VEXIVO AI Assistant**.
How can I help you today?`,
        timestamp: new Date(),
        data: null,
        suggestedActions: DEFAULT_SUGGESTIONS.map((s) => s.prompt),
      },
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden flex flex-col h-[700px] max-h-[85vh] transition-all">
      {/* ================= CHAT HEADER ================= */}
      <div className="px-5 py-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white flex items-center justify-between border-b border-neutral-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center text-neutral-900 shadow-md">
              <Sparkles className="w-5 h-5 text-neutral-900 fill-amber-400" />
            </div>
            {/* Pulsing Online Badge */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-neutral-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold tracking-tight text-white">
                VEXIVO AI Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 flex items-center space-x-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Available 24×7 • Live Auto-Resolution & Order Tracking</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewChat}
            title="Start a fresh conversation"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all border border-white/10 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* ================= CHAT MESSAGE THREAD ================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-neutral-50/70 to-white text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-2`}
          >
            {/* Chat Bubble */}
            <div className="flex items-start space-x-2.5 max-w-[92%] sm:max-w-[85%]">
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl shadow-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-neutral-900 text-white rounded-br-none'
                    : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-bl-none'
                }`}
              >
                <div className="font-normal text-[12.5px]">{msg.text}</div>

                <div
                  className={`text-[9px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            {/* ================= STRUCTURED RICH CARDS ================= */}
            {msg.data && (
              <div className="w-full max-w-full sm:max-w-[94%] pl-0 sm:pl-9 space-y-3">
                {/* 1. PRODUCT CARDS GRID */}
                {msg.data.products && msg.data.products.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center space-x-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Matching Products from Catalog ({msg.data.products.length})</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {msg.data.products.map((p) => {
                        const prodId = p._id || p.id;
                        const isAdded = addedProductId === prodId;
                        const isAdding = addingProductId === prodId;

                        return (
                          <div
                            key={prodId || p.slug}
                            className="bg-white rounded-2xl border border-neutral-200/90 hover:border-neutral-900 hover:shadow-md transition-all overflow-hidden flex flex-col group"
                          >
                            {/* Product Image */}
                            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                              <img
                                src={
                                  p.image ||
                                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
                                }
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              {p.discount > 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold uppercase shadow-sm">
                                  {p.discount}% OFF
                                </span>
                              )}
                              {p.rating && (
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{Number(p.rating).toFixed(1)}</span>
                                </span>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                              <div>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                                  {p.brand || 'VEXIVO'}
                                </p>
                                <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                                  {p.name}
                                </h4>
                              </div>

                              {/* Price */}
                              <div className="flex items-baseline space-x-2">
                                <span className="text-sm font-extrabold text-neutral-900">
                                  ₹{Number(p.price || 0).toLocaleString('en-IN')}
                                </span>
                                {p.compareAtPrice > p.price && (
                                  <span className="text-[11px] text-neutral-400 line-through">
                                    ₹{Number(p.compareAtPrice).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                <Link
                                  to={`/product/${p.slug || prodId}`}
                                  className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold text-center transition-colors flex items-center justify-center space-x-1"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                                </Link>

                                <button
                                  onClick={() => handleAddToCart(p)}
                                  disabled={isAdding}
                                  className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-center transition-all flex items-center justify-center space-x-1 ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-neutral-900 hover:bg-black text-white active:scale-95'
                                  }`}
                                >
                                  {isAdding ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : isAdded ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>Add to Bag</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. OFFERS CARDS */}
                {msg.data.offers && msg.data.offers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Active Verified Offers</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.data.offers.map((o) => (
                        <div
                          key={o._id || o.title}
                          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-300/70 space-y-2 relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider">
                                {o.badge || o.discountText || 'Special Offer'}
                              </span>
                              <h4 className="text-xs font-extrabold text-neutral-900 mt-1">
                                {o.title}
                              </h4>
                              {o.subtitle && (
                                <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                                  {o.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px]">
                            <span className="text-amber-800 font-semibold">{o.validity || 'Limited Stock'}</span>
                            <Link
                              to={o.link || '/shop'}
                              className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-black text-white font-bold text-[10px] transition-all shadow-sm"
                            >
                              Shop Now →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. COUPON CARDS */}
                {msg.data.coupons && msg.data.coupons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span>Available Promo Codes</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.data.coupons.map((c) => {
                        const isCopied = copiedCoupon === c.code;
                        return (
                          <div
                            key={c.code}
                            className="p-3 rounded-2xl bg-white border-2 border-dashed border-neutral-300 hover:border-blue-500 transition-colors flex items-center justify-between gap-2 shadow-sm"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-extrabold text-blue-700 tracking-wider">
                                  {c.code}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[9px]">
                                  {c.discountDisplay}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-500 mt-0.5">
                                Min order: ₹{c.minimumOrder}
                              </p>
                            </div>

                            <button
                              onClick={() => handleCopyCoupon(c.code)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. ORDERS WITH LIVE TRACKING PROGRESS BAR */}
                {msg.data.orders && msg.data.orders.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center space-x-1">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      <span>Live Order Status & Actions</span>
                    </p>

                    <div className="space-y-3">
                      {msg.data.orders.map((ord) => {
                        const stepIndex = ORDER_STEPS.indexOf(ord.orderStatus);
                        const isDelivered = ord.orderStatus === 'delivered';
                        const isCancelled = ord.orderStatus === 'cancelled';

                        return (
                          <div
                            key={ord._id || ord.orderNumber}
                            className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-extrabold text-neutral-900">
                                    {ord.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      isDelivered
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isCancelled
                                        ? 'bg-rose-100 text-rose-800'
                                        : ord.orderStatus === 'out_for_delivery'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {ord.orderStatus?.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 mt-1">
                                  Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB')} • Total: ₹
                                  {Number(ord.total || 0).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>

                            {/* Visual Progress Timeline */}
                            {!isCancelled && (
                              <div className="py-2">
                                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 mb-1.5 px-1">
                                  <span className={stepIndex >= 0 ? 'text-neutral-900' : ''}>Placed</span>
                                  <span className={stepIndex >= 2 ? 'text-neutral-900' : ''}>Processing</span>
                                  <span className={stepIndex >= 3 ? 'text-neutral-900' : ''}>Shipped</span>
                                  <span className={stepIndex >= 4 ? 'text-neutral-900' : ''}>Out for Delivery</span>
                                  <span className={stepIndex >= 5 ? 'text-emerald-600' : ''}>Delivered</span>
                                </div>
                                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden flex">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      isDelivered ? 'bg-emerald-500' : 'bg-blue-600'
                                    }`}
                                    style={{
                                      width: `${
                                        isDelivered
                                          ? 100
                                          : ord.orderStatus === 'out_for_delivery'
                                          ? 80
                                          : ord.orderStatus === 'shipped'
                                          ? 60
                                          : ord.orderStatus === 'processing'
                                          ? 40
                                          : 20
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Items preview */}
                            {ord.items && ord.items.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center space-x-2">
                                {ord.items[0]?.image && (
                                  <img
                                    src={ord.items[0].image}
                                    alt="Item"
                                    className="w-10 h-10 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-neutral-800 truncate">
                                    {ord.items[0]?.name}
                                  </p>
                                  {ord.items.length > 1 && (
                                    <p className="text-[10px] text-neutral-500">
                                      + {ord.items.length - 1} more item(s)
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* CANCEL CONFIRMATION BUTTONS */}
                            {msg.data.actionType === 'CANCEL_CONFIRM' && (
                              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                                <p className="font-bold text-rose-900 text-xs flex items-center space-x-1.5">
                                  <AlertCircle className="w-4 h-4 text-rose-600" />
                                  <span>Would you like to cancel this order automatically?</span>
                                </p>
                                <div className="flex items-center space-x-2 pt-1">
                                  <button
                                    onClick={() => handleConfirmCancelOrder(ord._id, ord.orderNumber)}
                                    disabled={actionInProgress}
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
                                  >
                                    {actionInProgress ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <span>Cancel Order Now</span>
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleSendMessage('Keep my order active. Do not cancel.')
                                    }
                                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-all"
                                  >
                                    Keep Order
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 1-CLICK RETURN / EXCHANGE BUTTONS */}
                            {(msg.data.actionType === 'RETURN_FLOW' || isDelivered) && (
                              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                                <p className="font-bold text-blue-900 text-xs">
                                  30-Day Doorstep Pickup & 100% Refund Guarantee:
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <button
                                    onClick={() => handleInitiateReturn(ord._id, ord.orderNumber, 'return')}
                                    disabled={actionInProgress}
                                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
                                  >
                                    <span>Initiate Return (Refund)</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleInitiateReturn(ord._id, ord.orderNumber, 'exchange')
                                    }
                                    disabled={actionInProgress}
                                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all"
                                  >
                                    Free Size / Color Exchange
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suggested Follow-up Actions (Pills) */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 pl-0 sm:pl-9 max-w-full">
                {msg.suggestedActions.map((action, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => {
                      if (action === 'Create Support Ticket') {
                        if (onOpenTicketModal) onOpenTicketModal(msg.data?.ticketPrefill || {});
                      } else {
                        handleSendMessage(action);
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-[11px] border border-neutral-300/80 hover:border-neutral-900 transition-all shadow-sm active:scale-95"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2.5 text-neutral-500 text-xs pl-2">
            <div className="w-7 h-7 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-center space-x-2">
              <span className="font-semibold text-[11px] text-neutral-600">VEXIVO AI is typing</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= CHAT INPUT AREA ================= */}
      <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex-shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your VEXIVO order or shopping…"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl border border-neutral-300 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs sm:text-[13px] bg-neutral-50/50 transition-all placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 active:scale-95"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Disclaimer Note */}
        <p className="text-[10px] text-neutral-400 text-center flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-neutral-400" />
          <span>VEXIVO AI automatically resolves inquiries and connects live with your account & orders.</span>
        </p>
      </div>
    </div>
  );
};

export default AIAssistantChat;
