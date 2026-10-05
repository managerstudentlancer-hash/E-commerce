import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  Store,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Key,
  Check,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    shortLabel: 'Admin',
    icon: ShieldCheck,
    badgeClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dotClass: 'bg-rose-400',
    description: 'Full master access to control panel, inventory, settings, pricing, and system accounts.',
  },
  seller: {
    label: 'Marketplace Seller',
    shortLabel: 'Seller',
    icon: Store,
    badgeClass: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    dotClass: 'bg-amber-400',
    description: 'Merchant portal access to manage shop listings, boutique products, and view INR sales payouts.',
  },
  customer: {
    label: 'Customer / Buyer',
    shortLabel: 'Customer',
    icon: UserCheck,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    description: 'Standard shopper account to browse catalog, place orders, write reviews, and track shipments.',
  },
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'admin' | 'seller' | 'customer'
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Role Assignment Modal State
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete User Confirmation Modal State
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  const fetchUsers = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.admin.getUsers();
      if (res.success) {
        setUsers(res.users || []);
        if (isManualRefresh) showToast('User list refreshed successfully.');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      showToast(err.message || 'Failed to load user accounts', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Open Role Modal
  const openRoleModal = (targetUser) => {
    setRoleModalUser(targetUser);
    setSelectedRole(targetUser.role || 'customer');
  };

  // Handle Role Update
  const handleSaveRole = async () => {
    if (!roleModalUser) return;

    if (roleModalUser._id === currentUser?._id && selectedRole !== 'admin') {
      showToast('You cannot revoke your own administrator clearance.', 'error');
      return;
    }

    setIsUpdatingRole(true);
    try {
      const res = await api.admin.updateUserRole(roleModalUser._id, selectedRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === roleModalUser._id ? { ...u, role: selectedRole } : u))
        );
        showToast(
          `Security clearance for ${roleModalUser.name} updated to ${ROLE_CONFIG[selectedRole]?.label || selectedRole}.`
        );
        setRoleModalUser(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Handle Delete User
  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return;

    if (deleteModalUser._id === currentUser?._id) {
      showToast('You cannot delete your own account.', 'error');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await api.admin.deleteUser(deleteModalUser._id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteModalUser._id));
        showToast(`Account for ${deleteModalUser.name} has been removed permanently.`);
        setDeleteModalUser(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user account', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Counts
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const sellerCount = users.filter((u) => u.role === 'seller').length;
  const customerCount = users.filter((u) => !u.role || u.role === 'customer').length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const userRole = u.role || 'customer';
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      userRole.toLowerCase().includes(term);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage.text && (
        <div className="fixed top-6 right-6 z-50 animate-slide-left">
          <div
            className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border font-bold text-xs ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/30'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Key className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              User &amp; Role Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control platform authentication, assign security clearance, manage vendors, and regulate customer accounts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing || loading}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Analytics / Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Accounts */}
        <div className="admin-card p-4 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-white">{users.length}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Registered identities</p>
          </div>
        </div>

        {/* Administrators */}
        <div className="admin-card p-4 rounded-2xl border border-rose-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-300/80 uppercase tracking-wider">
              Administrators
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-rose-400">{adminCount}</p>
            <p className="text-[10px] text-rose-300/60 font-medium mt-0.5">Full Master Access</p>
          </div>
        </div>

        {/* Sellers */}
        <div className="admin-card p-4 rounded-2xl border border-amber-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider">
              Sellers / Vendors
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{sellerCount}</p>
            <p className="text-[10px] text-amber-300/60 font-medium mt-0.5">Merchant Hub Clearance</p>
          </div>
        </div>

        {/* Customers */}
        <div className="admin-card p-4 rounded-2xl border border-emerald-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider">
              Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{customerCount}</p>
            <p className="text-[10px] text-emerald-300/60 font-medium mt-0.5">Active Buyers</p>
          </div>
        </div>
      </div>

      {/* Search Bar & Role Filter Tabs */}
      <div className="admin-card p-4 rounded-2xl border border-white/10 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 bg-slate-900/80 rounded-xl border border-white/10 flex items-center px-3.5 py-2.5 focus-within:border-cyan-400/50 transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[11px] text-slate-400 hover:text-white font-bold ml-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                roleFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All</span>
              <span className="text-[10px] opacity-75">({users.length})</span>
            </button>

            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                roleFilter === 'admin'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Admins</span>
              <span className="text-[10px] opacity-75">({adminCount})</span>
            </button>

            <button
              onClick={() => setRoleFilter('seller')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                roleFilter === 'seller'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Sellers</span>
              <span className="text-[10px] opacity-75">({sellerCount})</span>
            </button>

            <button
              onClick={() => setRoleFilter('customer')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                roleFilter === 'customer'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Customers</span>
              <span className="text-[10px] opacity-75">({customerCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users & Roles Table */}
      <div className="admin-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-bold text-slate-400">Loading accounts &amp; permissions...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">No user accounts found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No users match your search query or selected role filter. Try clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Security Role</th>
                  <th className="py-4 px-4">Registration Date</th>
                  <th className="py-4 px-6 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredUsers.map((u) => {
                  const roleKey = u.role || 'customer';
                  const roleCfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.customer;
                  const RoleIcon = roleCfg.icon;
                  const isCurrent = u._id === currentUser?._id;

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* User Account & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 border shadow-md ${
                              roleKey === 'admin'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10'
                                : roleKey === 'seller'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-amber-500/10'
                                : 'bg-slate-800 text-cyan-300 border-white/10'
                            }`}
                          >
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-white text-xs truncate">
                                {u.name || 'Unnamed User'}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {u.phone ? (
                          <div className="flex items-center space-x-1.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${roleCfg.badgeClass}`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          <span>{roleCfg.shortLabel}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-slate-400 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openRoleModal(u)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-cyan-400 font-bold text-[11px] transition-all active:scale-95 shadow-xs"
                            title="Assign or update role"
                          >
                            <Key className="w-3 h-3" />
                            <span>Assign Role</span>
                          </button>

                          <button
                            onClick={() => setDeleteModalUser(u)}
                            disabled={isCurrent}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
                            title={isCurrent ? 'Cannot delete own account' : 'Delete user account'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ======================================================== */}
      {/* ROLE ASSIGNMENT MODAL                                     */}
      {/* ======================================================== */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={() => !isUpdatingRole && setRoleModalUser(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-[#0C111D] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Assign Security Role</h3>
                  <p className="text-[11px] text-slate-400">
                    Modify permissions and access clearance for this identity.
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isUpdatingRole && setRoleModalUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-300 font-black text-sm flex items-center justify-center border border-white/10">
                {roleModalUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{roleModalUser.name}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{roleModalUser.email}</p>
              </div>
            </div>

            {/* Role Options */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Clearance Level:
              </label>

              {Object.entries(ROLE_CONFIG).map(([roleKey, cfg]) => {
                const Icon = cfg.icon;
                const isSelected = selectedRole === roleKey;

                return (
                  <div
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                      isSelected
                        ? `${cfg.badgeClass} bg-white/[0.06] shadow-lg`
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-extrabold text-xs text-white tracking-wide">
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Self-Demotion Alert */}
            {roleModalUser._id === currentUser?._id && selectedRole !== 'admin' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>You cannot revoke your own administrator clearance.</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                disabled={isUpdatingRole}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={
                  isUpdatingRole ||
                  (roleModalUser._id === currentUser?._id && selectedRole !== 'admin')
                }
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-40"
              >
                {isUpdatingRole ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Role</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE ACCOUNT CONFIRMATION MODAL                        */}
      {/* ======================================================== */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={() => !isDeleting && setDeleteModalUser(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-md bg-[#0C111D] border border-rose-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">Delete User Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently remove{' '}
                <span className="font-bold text-white">{deleteModalUser.name}</span> (
                <span className="font-mono text-slate-300">{deleteModalUser.email}</span>)? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-40"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
