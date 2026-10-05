import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Settings,
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  Eye,
  RefreshCw,
  Send,
  X,
  ExternalLink,
  ShieldCheck,
  Tag,
  Zap,
} from 'lucide-react';
import api from '../../services/api';

const KNOWLEDGE_CATEGORIES = [
  'General',
  'About',
  'Shipping',
  'Returns',
  'Refunds',
  'Cancellation',
  'Payments',
  'Exchange',
  'Orders',
  'Products',
  'Offers',
  'Contact',
  'Store',
  'Other',
];

const AdminAiAssistant = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'settings' | 'knowledge' | 'faqs' | 'conversations' | 'unanswered'
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Analytics State
  const [analytics, setAnalytics] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    enabled: true,
    assistantName: 'VEXIVO AI',
    avatarUrl: '',
    welcomeMessage: '',
    fallbackMessage: '',
    suggestedQuestions: [],
    productResultLimit: 6,
    languagePreference: 'multi',
    temperature: 0.3,
  });
  const [newSuggestedQuestion, setNewSuggestedQuestion] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Knowledge Base State
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [knowledgeCategory, setKnowledgeCategory] = useState('All');
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [knowledgeForm, setKnowledgeForm] = useState({
    title: '',
    category: 'General',
    content: '',
    status: 'active',
    priority: 0,
    tags: '',
  });

  // FAQs State
  const [faqsList, setFaqsList] = useState([]);
  const [faqCategory, setFaqCategory] = useState('All');
  const [editingFaq, setEditingFaq] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    status: 'active',
    displayOrder: 0,
  });

  // Conversations State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  // Unanswered Questions State
  const [unansweredList, setUnansweredList] = useState([]);
  const [resolvingQuestion, setResolvingQuestion] = useState(null);
  const [resolveAnswer, setResolveAnswer] = useState('');
  const [resolveCategory, setResolveCategory] = useState('General');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const res = await api.adminAi.getAnalytics();
        if (res.success) setAnalytics(res.analytics);
      } else if (activeTab === 'settings') {
        const res = await api.adminAi.getSettings();
        if (res.success && res.settings) setSettings(res.settings);
      } else if (activeTab === 'knowledge') {
        fetchKnowledge();
      } else if (activeTab === 'faqs') {
        fetchFaqs();
      } else if (activeTab === 'conversations') {
        const res = await api.adminAi.getConversations();
        if (res.success) setConversations(res.conversations || []);
      } else if (activeTab === 'unanswered') {
        const res = await api.adminAi.getUnanswered();
        if (res.success) setUnansweredList(res.questions || []);
      }
    } catch (err) {
      console.error('[Admin AI Load Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Knowledge Articles
  const fetchKnowledge = async () => {
    try {
      const res = await api.adminAi.getKnowledge({
        category: knowledgeCategory,
        search: knowledgeSearch,
      });
      if (res.success) setKnowledgeList(res.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      const res = await api.adminAi.getFaqs({ category: faqCategory });
      if (res.success) setFaqsList(res.faqs || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.adminAi.updateSettings(settings);
      if (res.success) {
        showToast('AI Settings updated successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Add Suggested Question
  const handleAddSuggestedQuestion = () => {
    if (!newSuggestedQuestion.trim()) return;
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: [...(prev.suggestedQuestions || []), newSuggestedQuestion.trim()],
    }));
    setNewSuggestedQuestion('');
  };

  // Remove Suggested Question
  const handleRemoveSuggestedQuestion = (index) => {
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: prev.suggestedQuestions.filter((_, i) => i !== index),
    }));
  };

  // Save Knowledge Article (Create or Update)
  const handleSaveKnowledge = async (e) => {
    e.preventDefault();
    try {
      if (editingKnowledge) {
        const res = await api.adminAi.updateKnowledge(editingKnowledge._id, knowledgeForm);
        if (res.success) {
          showToast('Knowledge article updated!');
          setIsKnowledgeModalOpen(false);
          fetchKnowledge();
        }
      } else {
        const res = await api.adminAi.createKnowledge(knowledgeForm);
        if (res.success) {
          showToast('New knowledge article published!');
          setIsKnowledgeModalOpen(false);
          fetchKnowledge();
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving knowledge article');
    }
  };

  // Delete Knowledge Article
  const handleDeleteKnowledge = async (id) => {
    if (!window.confirm('Delete this knowledge entry permanently?')) return;
    try {
      const res = await api.adminAi.deleteKnowledge(id);
      if (res.success) {
        showToast('Knowledge entry deleted');
        fetchKnowledge();
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  // Save FAQ (Create or Update)
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const res = await api.adminAi.updateFaq(editingFaq._id, faqForm);
        if (res.success) {
          showToast('FAQ updated!');
          setIsFaqModalOpen(false);
          fetchFaqs();
        }
      } else {
        const res = await api.adminAi.createFaq(faqForm);
        if (res.success) {
          showToast('New FAQ created!');
          setIsFaqModalOpen(false);
          fetchFaqs();
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving FAQ');
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      const res = await api.adminAi.deleteFaq(id);
      if (res.success) {
        showToast('FAQ removed');
        fetchFaqs();
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  // View Full Conversation Thread
  const handleViewConversation = async (conv) => {
    setSelectedConversation(conv);
    setIsConversationModalOpen(true);
    setLoadingThread(true);
    try {
      const res = await api.adminAi.getConversationById(conv._id);
      if (res.success) {
        setConversationMessages(res.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThread(false);
    }
  };

  // Resolve Unanswered Question
  const handleResolveQuestion = async (e) => {
    e.preventDefault();
    if (!resolveAnswer.trim()) return;
    try {
      const res = await api.adminAi.resolveUnanswered(resolvingQuestion._id, {
        adminAnswer: resolveAnswer.trim(),
        createAsKnowledge: true,
        category: resolveCategory,
      });
      if (res.success) {
        showToast('Question resolved and added to Knowledge Base!');
        setIsResolveModalOpen(false);
        setResolvingQuestion(null);
        setResolveAnswer('');
        loadAllData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to resolve question');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="admin-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0e1422] via-[#111728] to-[#151c30] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  VEXIVO AI Customer Care Control
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  MASTER SUITE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure 24x7 AI Customer Care, train verified knowledge articles, monitor analytics, and manage FAQs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-white/10 pt-4">
          {[
            { id: 'analytics', label: 'AI Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Assistant Settings', icon: Settings },
            { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
            { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
            { id: 'conversations', label: 'AI Conversations', icon: MessageSquare },
            { id: 'unanswered', label: 'Unanswered Queries', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: AI ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="admin-card p-5 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Conversations</span>
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {analytics?.totalConversations || 0}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Unique customer chat sessions</p>
            </div>

            <div className="admin-card p-5 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Catalog Searches</span>
                <Search className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {analytics?.productSearches || 0}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Real-time database queries</p>
            </div>

            <div className="admin-card p-5 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">In-Chat Cart Adds</span>
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {analytics?.cartAdditions || 0}
              </div>
              <p className="text-[10px] text-emerald-400 font-medium mt-1">
                Conversion Rate: {analytics?.conversionRate || '0%'}
              </p>
            </div>

            <div className="admin-card p-5 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Pending Unanswered</span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {analytics?.unansweredCount || 0}
              </div>
              <p className="text-[10px] text-rose-400 font-medium mt-1">Needs admin training</p>
            </div>
          </div>

          {/* Tables & Deep Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Frequent Customer Questions */}
            <div className="admin-card p-6 rounded-3xl border border-white/10 bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Most Frequent Unanswered Questions
                </h3>
                <span className="text-[10px] text-slate-400">Auto-logged</span>
              </div>

              {analytics?.topQueries && analytics.topQueries.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topQueries.map((q) => (
                    <div
                      key={q._id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{q.question}</p>
                        <span className="text-[10px] text-slate-400">Category: {q.category}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Asked {q.frequency}x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No unanswered queries recorded yet!</p>
              )}
            </div>

            {/* Top Recommended Products */}
            <div className="admin-card p-6 rounded-3xl border border-white/10 bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Top AI Catalog Recommendations
                </h3>
                <span className="text-[10px] text-slate-400">Live Inventory</span>
              </div>

              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-amber-400">⭐ {p.rating || 4.8}/5</span>
                        </div>
                      </div>
                      <span className="font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No products logged yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ASSISTANT SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="admin-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/90 space-y-6">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">General AI Behavior & Persona</h3>
                <p className="text-xs text-slate-400">Configure assistant name, status, and messaging prompts.</p>
              </div>

              {/* Enable / Disable Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-xs font-bold text-slate-300">
                  {settings.enabled ? 'AI Enabled' : 'AI Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Assistant Name</label>
                <input
                  type="text"
                  value={settings.assistantName}
                  onChange={(e) => setSettings({ ...settings, assistantName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Product Recommendations Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.productResultLimit}
                  onChange={(e) => setSettings({ ...settings, productResultLimit: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Welcome Greeting Message</label>
              <textarea
                rows="3"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Fallback Response Message</label>
              <textarea
                rows="2"
                value={settings.fallbackMessage}
                onChange={(e) => setSettings({ ...settings, fallbackMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Suggested Quick Question Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Suggested Quick Questions / Chips
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.suggestedQuestions?.map((q, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium"
                  >
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSuggestedQuestion(idx)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 💎 Matching Jewellery"
                  value={newSuggestedQuestion}
                  onChange={(e) => setNewSuggestedQuestion(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSuggestedQuestion}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save AI Configuration</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: KNOWLEDGE BASE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search articles by title, tags, content..."
                value={knowledgeSearch}
                onChange={(e) => setKnowledgeSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchKnowledge()}
                className="w-full px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={fetchKnowledge}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={knowledgeCategory}
                onChange={(e) => {
                  setKnowledgeCategory(e.target.value);
                  setTimeout(fetchKnowledge, 50);
                }}
                className="px-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs"
              >
                <option value="All">All Categories</option>
                {KNOWLEDGE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingKnowledge(null);
                  setKnowledgeForm({
                    title: '',
                    category: 'General',
                    content: '',
                    status: 'active',
                    priority: 5,
                    tags: '',
                  });
                  setIsKnowledgeModalOpen(true);
                }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition"
              >
                <Plus className="w-4 h-4" /> Add Article
              </button>
            </div>
          </div>

          {/* Articles Table */}
          <div className="admin-card rounded-3xl border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-4">Title & Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {knowledgeList.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition">
                      <td className="p-4 max-w-sm">
                        <p className="font-bold text-white text-sm">{item.title}</p>
                        <p className="text-slate-400 line-clamp-2 mt-1">{item.content}</p>
                        {item.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-amber-300/80"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-amber-400">{item.category}</td>
                      <td className="p-4 font-bold text-white">{item.priority}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingKnowledge(item);
                              setKnowledgeForm({
                                title: item.title,
                                category: item.category,
                                content: item.content,
                                status: item.status,
                                priority: item.priority,
                                tags: item.tags?.join(', ') || '',
                              });
                              setIsKnowledgeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteKnowledge(item._id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {knowledgeList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400">
                        No knowledge articles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: FAQS MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({
                  question: '',
                  answer: '',
                  category: 'General',
                  status: 'active',
                  displayOrder: 0,
                });
                setIsFaqModalOpen(true);
              }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqsList.map((faq) => (
              <div
                key={faq._id}
                className="admin-card p-5 rounded-3xl border border-white/10 bg-slate-900/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                        faq.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {faq.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({
                        question: faq.question,
                        answer: faq.answer,
                        category: faq.category,
                        status: faq.status,
                        displayOrder: faq.displayOrder || 0,
                      });
                      setIsFaqModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: CONVERSATIONS LOG */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'conversations' && (
        <div className="admin-card rounded-3xl border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Last Message</th>
                  <th className="p-4">Messages</th>
                  <th className="p-4">Cart Adds</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {conversations.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition">
                    <td className="p-4 font-semibold text-white">
                      {c.userName || c.userEmail || 'Guest Shopper'}
                      <div className="text-[10px] text-slate-400 font-mono">{c.sessionId.slice(0, 14)}...</div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300">{c.lastMessage}</td>
                    <td className="p-4 font-bold text-white">{c.messagesCount}</td>
                    <td className="p-4 font-bold text-emerald-400">{c.cartAdditionsCount || 0}</td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(c.lastMessageAt || c.updatedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewConversation(c)}
                        className="px-3 py-1 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 text-xs font-bold transition"
                      >
                        View Thread
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: UNANSWERED QUESTIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'unanswered' && (
        <div className="space-y-4">
          <div className="admin-card rounded-3xl border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-4">Customer Query</th>
                    <th className="p-4">Frequency</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Train / Resolve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {unansweredList.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-bold text-white">{item.question}</td>
                      <td className="p-4 font-extrabold text-amber-400">{item.frequency}x</td>
                      <td className="p-4 text-slate-300">{item.category}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {item.status !== 'resolved' ? (
                          <button
                            onClick={() => {
                              setResolvingQuestion(item);
                              setResolveAnswer('');
                              setResolveCategory(item.category || 'General');
                              setIsResolveModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition"
                          >
                            Answer & Add Knowledge
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold">Trained in Knowledge Base</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {unansweredList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400">
                        Zero pending unanswered questions!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: KNOWLEDGE ARTICLE EDITOR */}
      {/* ------------------------------------------------------------- */}
      {isKnowledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingKnowledge ? 'Edit Knowledge Article' : 'Add Knowledge Article'}
              </h3>
              <button
                onClick={() => setIsKnowledgeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKnowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={knowledgeForm.title}
                  onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                  placeholder="e.g. Express Metro Shipping Policy"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={knowledgeForm.category}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs"
                  >
                    {KNOWLEDGE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={knowledgeForm.priority}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Content</label>
                <textarea
                  rows="6"
                  required
                  value={knowledgeForm.content}
                  onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                  placeholder="Enter detailed facts, policies, and accurate VEXIVO business terms..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Search Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={knowledgeForm.tags}
                  onChange={(e) => setKnowledgeForm({ ...knowledgeForm, tags: e.target.value })}
                  placeholder="shipping, metro, bluedart, speed, courier"
                  className="w-full px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsKnowledgeModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: FAQ EDITOR */}
      {/* ------------------------------------------------------------- */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Do you accept Cash on Delivery?"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Enter the official verified answer..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs"
                  >
                    {KNOWLEDGE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={faqForm.displayOrder}
                    onChange={(e) => setFaqForm({ ...faqForm, displayOrder: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: UNANSWERED QUERY RESOLVER */}
      {/* ------------------------------------------------------------- */}
      {isResolveModalOpen && resolvingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Train AI with Verified Answer
              </h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Customer Asked:</span>
              <p className="text-sm font-semibold text-white mt-1">"{resolvingQuestion.question}"</p>
            </div>

            <form onSubmit={handleResolveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verified VEXIVO Official Answer
                </label>
                <textarea
                  rows="4"
                  required
                  value={resolveAnswer}
                  onChange={(e) => setResolveAnswer(e.target.value)}
                  placeholder="Provide the accurate answer. This will immediately become part of the live knowledge base for the AI!"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Knowledge Category</label>
                <select
                  value={resolveCategory}
                  onChange={(e) => setResolveCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs"
                >
                  {KNOWLEDGE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Publish to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CONVERSATION THREAD VIEWER */}
      {/* ------------------------------------------------------------- */}
      {isConversationModalOpen && selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Conversation: {selectedConversation.userName || selectedConversation.userEmail || 'Guest'}
                </h3>
                <span className="text-[10px] text-slate-400">
                  Session ID: {selectedConversation.sessionId}
                </span>
              </div>
              <button
                onClick={() => setIsConversationModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {loadingThread ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                </div>
              ) : (
                conversationMessages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        {isUser ? 'Customer' : 'AI Assistant'}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                          isUser
                            ? 'bg-amber-600 text-white rounded-br-none'
                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>

                      {/* Products preview if recommended */}
                      {m.productsShown?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {m.productsShown.map((p) => (
                            <div
                              key={p._id || p}
                              className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] text-amber-300 font-medium"
                            >
                              🏷️ {p.name || p}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAiAssistant;
