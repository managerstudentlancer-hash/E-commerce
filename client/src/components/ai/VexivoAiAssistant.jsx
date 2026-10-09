import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  X,
  Minus,
  RotateCcw,
  Send,
  ShoppingBag,
  Heart,
  Star,
  ExternalLink,
  Package,
  Truck,
  Check,
  Copy,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Loader2,
  Tag,
  Headphones,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';

const ORDER_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const VexivoAiAssistant = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Assistant Configuration & State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    assistantName: 'VEXIVO AI Customer Care',
    avatarUrl: '',
    welcomeMessage: '',
    suggestedQuestions: [
      '📦 Track My Order',
      '↩️ Return My Order',
      '💳 Payment Help',
      '🛍️ Find Products',
      '🎁 Offers & Coupons',
      '✨ Talk About Shopping',
    ],
  });

  const [sessionId, setSessionId] = useState(() => {
    try {
      let id = localStorage.getItem('vexivo_ai_session');
      if (!id) {
        id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('vexivo_ai_session', id);
      }
      return id;
    } catch {
      return `sess_${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 1. Fetch AI Assistant Welcome & Settings
  useEffect(() => {
    fetchAssistantConfig();
  }, []);

  const fetchAssistantConfig = async () => {
    try {
      const res = await api.ai.getWelcome();
      if (res.success) {
        setAiSettings({
          enabled: res.enabled !== false,
          assistantName: res.assistantName || 'VEXIVO AI Customer Care',
          avatarUrl: res.avatarUrl || '',
          welcomeMessage: res.welcomeMessage || '',
          suggestedQuestions: res.suggestedQuestions || [
            '📦 Track My Order',
            '↩️ Return My Order',
            '💳 Payment Help',
            '🛍️ Find Products',
            '🎁 Offers & Coupons',
            '✨ Talk About Shopping',
          ],
        });

        // Initialize default welcome message if empty
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content:
              res.welcomeMessage ||
              `Hi ${user?.name ? user.name.split(' ')[0] : 'Member'}! 👋 I’m your **VEXIVO AI Customer Care Assistant**.\n\nI’m available 24×7 to help with orders, returns, refunds, payments, delivery, products, offers and shopping.\n\nHow can I help you today?`,
            timestamp: new Date(),
            suggestedActions: res.suggestedQuestions || [
              '📦 Track My Order',
              '↩️ Return My Order',
              '💳 Payment Help',
              '🛍️ Find Products',
              '🎁 Offers & Coupons',
              '✨ Talk About Shopping',
            ],
          },
        ]);
      }
    } catch (err) {
      // Fallback welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi ${user?.name ? user.name.split(' ')[0] : 'Member'}! 👋 I’m your **VEXIVO AI Customer Care Assistant**.\n\nI’m available 24×7 to help with orders, returns, refunds, payments, delivery, products, offers and shopping.\n\nHow can I help you today?`,
          timestamp: new Date(),
          suggestedActions: [
            '📦 Track My Order',
            '↩️ Return My Order',
            '💳 Payment Help',
            '🛍️ Find Products',
            '🎁 Offers & Coupons',
            '✨ Talk About Shopping',
          ],
        },
      ]);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  // Send Message Handler
  const handleSendMessage = async (customText = '') => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
        data: m.data,
      }));

      const res = await api.ai.chat({
        message: textToSend,
        history: historyPayload,
        sessionId,
      });

      if (res.success) {
        const aiMsg = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          data: res.data || {},
          suggestedActions: res.suggestedActions || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (!isOpen) setHasUnread(true);
      } else {
        throw new Error(res.message || 'Failed to get response');
      }
    } catch (err) {
      console.warn('[AI Assistant Error]:', err);
      const fallbackMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I'm having trouble right now. Please try again or reach our team at care@vexivo.com.`,
        data: { actionType: 'ERROR' },
        suggestedActions: ['📦 Track My Order', '🛍️ Browse Products', '🎁 View Offers'],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // New Chat / Reset
  const handleResetChat = () => {
    const newSession = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSession);
    try {
      localStorage.setItem('vexivo_ai_session', newSession);
    } catch {}
    fetchAssistantConfig();
  };

  // Copy Coupon Code
  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  // Add to Cart from Product Card
  const handleCardAddToCart = async (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    const variant = selectedVariants[prodId] || (product.sizes && product.sizes[0]) || '';

    setAddingProductId(prodId);
    try {
      addToCart(
        {
          _id: prodId,
          id: prodId,
          name: product.name,
          price: product.price,
          image: product.image || product.thumbnail,
          slug: product.slug,
          category: product.category,
        },
        1,
        variant
      );

      // Also notify backend AI cart endpoint if authenticated
      if (isAuthenticated) {
        api.ai.addToCart({ productId: prodId, variant, quantity: 1 }).catch(() => {});
      }

      setAddedProductId(prodId);
      setTimeout(() => setAddedProductId(null), 2500);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingProductId(null);
    }
  };

  // Cancel Order Action from Chat
  const handleCancelOrder = async (orderNumber) => {
    setActionInProgress(true);
    try {
      const res = await api.ai.cancelOrder(orderNumber, 'Customer confirmed cancellation via AI Chatbot');
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: `✅ **Order #${orderNumber} Cancelled Successfully.**

The full amount has been scheduled for refund to your original payment method. Inventory has been restored.`,
            suggestedActions: ['🛍️ Continue Shopping', '🎁 View Offers'],
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: `❌ Could not cancel order: ${err.message}`,
          suggestedActions: ['📦 Show My Orders', '↩️ Return Policy'],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setActionInProgress(false);
    }
  };

  // Return Order Action from Chat
  const handleReturnOrder = async (orderNumber, type = 'return') => {
    setActionInProgress(true);
    try {
      const res = await api.ai.returnOrder(orderNumber, {
        reason: 'Customer initiated return via AI Chatbot',
        requestType: type,
      });
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: `✅ **${type === 'exchange' ? 'Exchange' : 'Return'} Request Logged for Order #${orderNumber}!**

Our logistics partner will coordinate doorstep pickup within 24–48 hours. Please keep items unworn with original tags intact.`,
            suggestedActions: ['📦 View Order Status', '🛍️ Browse Catalog'],
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: `❌ Request error: ${err.message}`,
          suggestedActions: ['📦 Track Orders', '↩️ Return Policy'],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setActionInProgress(false);
    }
  };

  // Format simple markdown into clean HTML elements
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;

      // Bold text handling
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-amber-400 mt-0.5">•</span>
            <span className="text-slate-200 text-xs sm:text-sm leading-relaxed">{renderedParts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  if (aiSettings.enabled === false) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom-Right Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Tooltip badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-200 text-xs font-medium backdrop-blur-md shadow-xl shadow-black/40 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Need help? Ask VEXIVO AI</span>
          </div>

          <button
            id="vexivo-ai-launcher-btn"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-black border-2 border-amber-400/50 text-white shadow-2xl shadow-amber-500/20 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open VEXIVO AI Customer Care"
          >
            {/* Glow ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-200 opacity-30 blur-sm group-hover:opacity-60 transition duration-500 animate-pulse" />

            <div className="relative flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Online status indicator */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm" />

            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full animate-ping" />
            )}
          </button>
        </div>
      )}

      {/* Main AI Chat Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72 h-14'
              : isExpanded
              ? 'inset-0 sm:inset-6 sm:left-auto sm:right-6 sm:w-[680px] sm:max-h-[90vh]'
              : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[680px] sm:max-h-[85vh]'
          }`}
        >
          <div className="w-full h-full flex flex-col bg-[#0b0f19] border border-amber-500/20 rounded-none sm:rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden font-sans text-slate-100">
            {/* 1. Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-neutral-900 via-slate-900 to-[#121826] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                      <span>✨ VEXIVO AI Customer Care</span>
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center space-x-1.5 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Available 24×7 · Instant Support & Shopping Help</span>
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="New Chat"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Standard view' : 'Expand view'}
                  className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title="Minimize"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minimized Bar */}
            {isMinimized ? (
              <div
                onClick={() => setIsMinimized(false)}
                className="flex-1 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 transition"
              >
                <span className="text-xs text-slate-300 font-medium">Chat is minimized. Click to open.</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            ) : (
              <>
                {/* 2. Chat Message List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                      >
                        {/* Bubble */}
                        <div
                          className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 shadow-md ${
                            isUser
                              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-none border border-amber-400/30'
                              : 'bg-slate-900/90 text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-md'
                          }`}
                        >
                          {/* Role tag */}
                          {!isUser && (
                            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                              <Sparkles className="w-3 h-3" />
                              <span>{aiSettings.assistantName}</span>
                            </div>
                          )}

                          <div className="text-xs sm:text-sm">{renderFormattedText(msg.content)}</div>
                        </div>

                        {/* Structured Product Grid */}
                        {msg.data?.products && Array.isArray(msg.data.products) && msg.data.products.length > 0 && (
                          <div className="w-full max-w-[96%] grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-1">
                            {msg.data.products.map((prod) => {
                              const pId = prod._id || prod.id;
                              const isWish = isInWishlist(pId);
                              const isAdding = addingProductId === pId;
                              const isAdded = addedProductId === pId;

                              return (
                                <div
                                  key={pId}
                                  className="group flex flex-col bg-[#111726] border border-white/10 hover:border-amber-400/40 rounded-2xl p-2.5 transition duration-200 overflow-hidden shadow-lg"
                                >
                                  {/* Product Image & Wishlist Button */}
                                  <div className="relative w-full h-36 bg-slate-950 rounded-xl overflow-hidden">
                                    <img
                                      src={prod.image || prod.thumbnail || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                                      alt={prod.name}
                                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />

                                    {/* Discount badge */}
                                    {prod.discount > 0 && (
                                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600/90 text-white font-bold text-[10px] shadow-md">
                                        {prod.discount}% OFF
                                      </span>
                                    )}

                                    {/* Wishlist toggle */}
                                    <button
                                      onClick={() => toggleWishlist(prod)}
                                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm transition"
                                      title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${
                                          isWish ? 'fill-rose-500 text-rose-500' : 'text-white'
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Product Info */}
                                  <div className="pt-2 flex-1 flex flex-col justify-between">
                                    <div>
                                      <Link
                                        to={`/product/${prod.slug || pId}`}
                                        className="text-xs font-semibold text-white line-clamp-1 hover:text-amber-300 transition"
                                      >
                                        {prod.name}
                                      </Link>

                                      {/* Price & Rating */}
                                      <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-sm font-extrabold text-amber-300">
                                          ₹{Number(prod.price || 0).toLocaleString('en-IN')}
                                        </span>
                                        {prod.compareAtPrice > prod.price && (
                                          <span className="text-[10px] line-through text-slate-500">
                                            ₹{Number(prod.compareAtPrice).toLocaleString('en-IN')}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                        <span className="flex items-center gap-1 text-amber-400">
                                          <Star className="w-3 h-3 fill-amber-400" />
                                          <span>{prod.rating || 4.8}</span>
                                        </span>
                                        <span
                                          className={`font-medium ${
                                            prod.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                                          }`}
                                        >
                                          {prod.stock > 0 ? `In Stock` : 'Out of Stock'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex items-center gap-1.5 mt-auto">
                                      <button
                                        onClick={() => handleCardAddToCart(prod)}
                                        disabled={isAdding || prod.stock <= 0}
                                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                                          isAdded
                                            ? 'bg-emerald-600 text-white'
                                            : prod.stock <= 0
                                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                                        }`}
                                      >
                                        {isAdding ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : isAdded ? (
                                          <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Added!</span>
                                          </>
                                        ) : (
                                          <>
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            <span>Add to Cart</span>
                                          </>
                                        )}
                                      </button>

                                      <Link
                                        to={`/product/${prod.slug || pId}`}
                                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                                        title="View Details"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Order Status Card */}
                        {msg.data?.actionType === 'ORDER_STATUS' && msg.data.orders?.[0] && (
                          <div className="w-full max-w-[96%] bg-[#121929] border border-amber-500/30 rounded-2xl p-3 space-y-2.5 my-1 shadow-lg">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-white">
                                  Order #{msg.data.orders[0].orderNumber}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                                {msg.data.orders[0].orderStatus}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-300 space-y-1">
                              <div>
                                <strong className="text-slate-200">Total:</strong> ₹
                                {Number(msg.data.orders[0].total).toLocaleString('en-IN')} (
                                {msg.data.orders[0].paymentStatus})
                              </div>
                              <div>
                                <strong className="text-slate-200">Items:</strong>{' '}
                                {msg.data.orders[0].items?.map((i) => i.name).join(', ')}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-1">
                              {['pending', 'confirmed', 'processing'].includes(msg.data.orders[0].orderStatus) && (
                                <button
                                  onClick={() => handleCancelOrder(msg.data.orders[0].orderNumber)}
                                  disabled={actionInProgress}
                                  className="flex-1 py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {msg.data.orders[0].orderStatus === 'delivered' && (
                                <button
                                  onClick={() => handleReturnOrder(msg.data.orders[0].orderNumber, 'return')}
                                  disabled={actionInProgress}
                                  className="flex-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold"
                                >
                                  Return / Exchange
                                </button>
                              )}
                              <Link
                                to="/account/orders"
                                className="py-1 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-medium border border-white/10"
                              >
                                View Order History
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Offers & Coupons Card */}
                        {msg.data?.actionType === 'OFFERS_AND_COUPONS' && msg.data.coupons && (
                          <div className="w-full max-w-[96%] space-y-2 my-1">
                            {msg.data.coupons.map((c) => (
                              <div
                                key={c.code}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20"
                              >
                                <div className="flex items-center gap-2">
                                  <Tag className="w-4 h-4 text-amber-400" />
                                  <div>
                                    <span className="text-xs font-bold text-white tracking-wider">{c.code}</span>
                                    <p className="text-[10px] text-slate-400">{c.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyCoupon(c.code)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition flex items-center gap-1"
                                >
                                  {copiedCoupon === c.code ? (
                                    <>
                                      <Check className="w-3 h-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Suggested Prompt Chips */}
                        {msg.suggestedActions && Array.isArray(msg.suggestedActions) && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 max-w-[96%]">
                            {msg.suggestedActions.map((action, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleSendMessage(action)}
                                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/30 text-[11px] font-medium transition active:scale-95"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-white/10 w-fit">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span className="text-xs text-slate-400">Searching VEXIVO catalog...</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 3. Input Footer */}
                <div className="p-3 bg-[#0d121e] border-t border-white/10 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask in English, Hindi, or Hinglish..."
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400/60 transition"
                      disabled={isLoading}
                    />

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between px-1 pt-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      100% Grounded in VEXIVO Live Data
                    </span>
                    <span>Supports English & Hinglish</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VexivoAiAssistant;
