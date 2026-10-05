import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Send,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  User,
  Tag,
  RefreshCw,
  Loader2,
  X,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const statusBadgeStyles = {
  OPEN: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  IN_PROGRESS: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  WAITING_FOR_USER: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CLOSED: 'bg-slate-700/40 text-slate-400 border-slate-600',
};

const priorityStyles = {
  urgent: 'text-rose-400 font-black bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20',
  high: 'text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20',
  medium: 'text-sky-300 font-medium bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20',
  low: 'text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700',
};

const AdminSupport = () => {
  const { settings, updateSettings } = useSettings();
  const [activeMainTab, setActiveMainTab] = useState('tickets'); // 'tickets' | 'channels'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');

  // Selected Ticket for Thread Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // 24/7 Channels Form State
  const [channelsForm, setChannelsForm] = useState({
    phone: '+91 80000 12345',
    email: 'support@vexivo.com',
    whatsapp: '+91 98765 43210',
    hours: '24/7 Round-the-Clock Support (Always Available)',
    address: 'Connaught Place, Central Delhi, New Delhi 110001, India',
    is24x7Active: true,
  });
  const [savingChannels, setSavingChannels] = useState(false);

  // Sync settings when available
  useEffect(() => {
    if (settings && settings.contactInfo) {
      setChannelsForm({
        phone: settings.contactInfo.phone || '+91 80000 12345',
        email: settings.contactInfo.email || 'support@vexivo.com',
        whatsapp: settings.contactInfo.whatsapp || '+91 98765 43210',
        hours: settings.contactInfo.hours || '24/7 Round-the-Clock Support (Always Available)',
        address: settings.contactInfo.address || 'Connaught Place, Central Delhi, New Delhi 110001, India',
        is24x7Active: settings.contactInfo.is24x7Active !== undefined ? settings.contactInfo.is24x7Active : true,
      });
    }
  }, [settings]);

  const showToast = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 3500);
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.support.getAdminTickets({
        status: statusFilter,
        category: categoryFilter,
        search: searchQuery,
      });
      if (res.success && res.tickets) {
        setTickets(res.tickets);
      }
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleOpenTicketThread = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
  };

  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setSendingReply(true);
      const res = await api.support.adminReply(selectedTicket._id, replyMessage.trim());
      if (res.success && res.ticket) {
        setSelectedTicket(res.ticket);
        setTickets((prev) => prev.map((t) => (t._id === res.ticket._id ? res.ticket : t)));
        setReplyMessage('');
        showToast('Reply dispatched to customer successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await api.support.updateTicketAdmin(ticketId, { status: newStatus });
      if (res.success && res.ticket) {
        setTickets((prev) => prev.map((t) => (t._id === ticketId ? res.ticket : t)));
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
        showToast(`Ticket status updated to ${newStatus}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleUpdatePriority = async (ticketId, newPriority) => {
    try {
      const res = await api.support.updateTicketAdmin(ticketId, { priority: newPriority });
      if (res.success && res.ticket) {
        setTickets((prev) => prev.map((t) => (t._id === ticketId ? res.ticket : t)));
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
        showToast(`Priority updated to ${newPriority}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to update priority');
    }
  };

  const handleDeleteTicket = async (ticketId, ticketNumber) => {
    if (!window.confirm(`Are you sure you want to delete support ticket ${ticketNumber}?`)) return;

    try {
      const res = await api.support.deleteTicketAdmin(ticketId);
      if (res.success) {
        setTickets((prev) => prev.filter((t) => t._id !== ticketId));
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(null);
        }
        showToast('Support ticket deleted successfully');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete ticket');
    }
  };

  const handleSaveChannels = async (e) => {
    e.preventDefault();
    try {
      setSavingChannels(true);
      const payload = {
        contactInfo: {
          phone: channelsForm.phone,
          email: channelsForm.email,
          whatsapp: channelsForm.whatsapp,
          hours: channelsForm.hours,
          address: channelsForm.address,
          is24x7Active: channelsForm.is24x7Active,
        },
      };

      const res = await api.settings.update(payload);
      if (res.success) {
        if (updateSettings) {
          updateSettings(res.settings);
        }
        showToast('24/7 Customer Service channels saved and live across store!');
      }
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingChannels(false);
    }
  };

  // Metric Computations
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_USER').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Headphones className="w-4 h-4" />
            <span>24/7 Customer Care &amp; Concierge Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            24*7 Customer Services Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor client inquiries, answer tickets, manage WhatsApp &amp; hotline numbers, and maintain 24/7 support live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>View Live Contact Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-300" />
          </Link>

          <button
            onClick={fetchTickets}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 flex items-center space-x-2 transition-all"
            title="Refresh Inquiries List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Tickets</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</div>
          <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Customer &amp; Guest Requests</div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Open / Pending</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{openCount}</div>
          <div className="text-[10px] text-rose-300 font-medium mt-0.5">Needs Admin Attention</div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{inProgressCount}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Active Dialogues</div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Cases Closed Successfully</div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveMainTab('tickets')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'tickets'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Inquiries &amp; Tickets ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('channels')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'channels'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>24/7 Channels &amp; Hotline Config</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: TICKETS & INQUIRIES DESK                                 */}
      {/* ================================================================ */}
      {activeMainTab === 'tickets' && (
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Status Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Inquiries' },
                { id: 'OPEN', label: 'Open' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'RESOLVED', label: 'Resolved' },
                { id: 'CLOSED', label: 'Closed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-slate-800 text-white border border-white/20'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, name, email, order..."
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setTimeout(fetchTickets, 50);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Tickets Table */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              <p className="text-xs text-slate-400">Loading customer inquiries...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Customer Inquiries Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No tickets matching your filter criteria. All 24/7 service requests are up to date.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 text-slate-400 font-bold uppercase tracking-wider border-b border-white/10 text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Ticket &amp; Customer</th>
                      <th className="py-3.5 px-4">Subject &amp; Category</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Ticket & Customer */}
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-mono font-bold text-rose-400 text-xs flex items-center space-x-1.5">
                              <span>{ticket.ticketNumber}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase font-sans">
                                {ticket.channel || 'Concierge'}
                              </span>
                            </div>
                            <div className="font-bold text-white mt-0.5">{ticket.userName}</div>
                            <div className="text-[11px] text-slate-400">
                              {ticket.userEmail} {ticket.phone ? `• ${ticket.phone}` : ''}
                            </div>
                          </div>
                        </td>

                        {/* Subject & Category */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 mb-1">
                            {ticket.category}
                          </span>
                          <p className="font-bold text-slate-200 truncate">{ticket.subject}</p>
                          <p className="text-[11px] text-slate-400 truncate line-clamp-1 mt-0.5">
                            {ticket.message}
                          </p>
                          {ticket.orderNumber && (
                            <span className="text-[10px] text-rose-300 font-mono">
                              Order #{ticket.orderNumber}
                            </span>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] uppercase ${priorityStyles[ticket.priority] || priorityStyles.medium}`}>
                            {ticket.priority || 'medium'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border focus:outline-none ${
                              statusBadgeStyles[ticket.status] || statusBadgeStyles.OPEN
                            } bg-slate-900`}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="WAITING_FOR_USER">WAITING FOR USER</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                          <div>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(ticket.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenTicketThread(ticket)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center space-x-1"
                              title="Open Ticket Thread & Reply"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket._id, ticket.ticketNumber)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: 24/7 SERVICE CHANNELS & HOTLINE CONFIG                   */}
      {/* ================================================================ */}
      {activeMainTab === 'channels' && (
        <form onSubmit={handleSaveChannels} className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-200">
          <div>
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Phone className="w-5 h-5 text-rose-400" />
              <span>Live 24/7 Customer Service Channels</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Changes made here update the Contact Page, Footer Concierge, Announcement Bar, and 24/7 Trust Strips across the entire store in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* 1. Helpline Phone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                24/7 Helpline &amp; Toll-Free Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={channelsForm.phone}
                  onChange={(e) => setChannelsForm({ ...channelsForm, phone: e.target.value })}
                  placeholder="+91 80000 12345"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Visible on header concierge, announcement bar, and contact page.
              </span>
            </div>

            {/* 2. Official Concierge Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Concierge Support Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={channelsForm.email}
                  onChange={(e) => setChannelsForm({ ...channelsForm, email: e.target.value })}
                  placeholder="concierge@vexivo.com"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email address where order inquiries and support receipts are routed.
              </span>
            </div>

            {/* 3. WhatsApp Hotline */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                WhatsApp Direct Hotline Number
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={channelsForm.whatsapp}
                  onChange={(e) => setChannelsForm({ ...channelsForm, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Enables instant WhatsApp client support chat.
              </span>
            </div>

            {/* 4. Support Hours of Operation */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Support Hours Text *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={channelsForm.hours}
                  onChange={(e) => setChannelsForm({ ...channelsForm, hours: e.target.value })}
                  placeholder="24/7 Round-the-Clock Support (Always Available)"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Highlighted across footer, trust badges, and contact page.
              </span>
            </div>

            {/* 5. Physical Registered Address */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Concierge Desk &amp; Registered Office Address
              </label>
              <input
                type="text"
                value={channelsForm.address}
                onChange={(e) => setChannelsForm({ ...channelsForm, address: e.target.value })}
                placeholder="Connaught Place, Central Delhi, New Delhi 110001, India"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* 6. Active 24/7 Toggle */}
            <div className="md:col-span-2 flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <input
                type="checkbox"
                id="is24x7Active"
                checked={channelsForm.is24x7Active}
                onChange={(e) => setChannelsForm({ ...channelsForm, is24x7Active: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-white/20 cursor-pointer"
              />
              <label htmlFor="is24x7Active" className="text-xs font-bold text-white cursor-pointer select-none">
                Enable 24/7 Concierge Live Badge on Storefront &amp; AI Shopping Assistant
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={savingChannels}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg active:scale-95 disabled:opacity-50 flex items-center space-x-2"
            >
              {savingChannels && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save &amp; Publish 24/7 Channels</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================ */}
      {/* MODAL: TICKET THREAD & ADMIN REPLY DRAWER                         */}
      {/* ================================================================ */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in text-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-rose-400 text-xs">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${statusBadgeStyles[selectedTicket.status]}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`text-[9px] uppercase ${priorityStyles[selectedTicket.priority]}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {selectedTicket.subject}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Customer: <strong className="text-white">{selectedTicket.userName}</strong> ({selectedTicket.userEmail}) {selectedTicket.phone ? `• ${selectedTicket.phone}` : ''}
                </p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="max-h-72 overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-xs">
              {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                selectedTicket.replies.map((rep, idx) => {
                  const isAdmin = rep.senderRole === 'admin';
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl ${
                        isAdmin
                          ? 'bg-rose-500/15 border border-rose-500/30 ml-4'
                          : 'bg-white/5 border border-white/10 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px]">
                        <span className={`font-bold ${isAdmin ? 'text-rose-300' : 'text-slate-300'}`}>
                          {isAdmin ? '🛡️ VEXIVO 24/7 Concierge Lead' : rep.senderName}
                        </span>
                        <span className="text-slate-500">
                          {new Date(rep.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{rep.message}</p>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 bg-white/5 rounded-xl text-slate-400">
                  {selectedTicket.message}
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Change Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                  className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="WAITING_FOR_USER">WAITING FOR USER</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Priority:</span>
                <select
                  value={selectedTicket.priority}
                  onChange={(e) => handleUpdatePriority(selectedTicket._id, e.target.value)}
                  className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendAdminReply} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Send Official 24/7 Concierge Response
                </label>
                <textarea
                  required
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to the customer..."
                  className="w-full bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Close Window
                </button>
                <button
                  type="submit"
                  disabled={sendingReply || !replyMessage.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg disabled:opacity-50 active:scale-95"
                >
                  {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
