import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  User,
  Calendar,
  X,
  Check,
  Loader2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '../../services/api';

const STATUS_BADGES = {
  PENDING_VERIFICATION: {
    label: 'Pending Verification',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approved',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  ACTIVE: {
    label: 'Active Fleet',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dot: 'bg-rose-400',
    icon: AlertCircle,
  },
  SUSPENDED: {
    label: 'Suspended',
    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dot: 'bg-rose-400',
    icon: Ban,
  },
};

const AdminDeliveryApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectModalApp, setRejectModalApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Driving license / Aadhaar verification check could not be completed.');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.adminLogistics.getApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch delivery partner applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleUpdateStatus = async (partnerId, newStatus, reason = '') => {
    try {
      setActionLoadingId(partnerId);
      const res = await api.adminLogistics.updateApplicationStatus(partnerId, {
        status: newStatus,
        rejectionReason: reason,
      });

      if (res.success) {
        showToast(`Application status updated to "${newStatus}"!`);
        setApplications((prev) =>
          prev.map((app) => (app._id === partnerId ? { ...app, deliveryProfile: res.partner.deliveryProfile } : app))
        );
        if (selectedApp?._id === partnerId) {
          setSelectedApp((prev) => ({ ...prev, deliveryProfile: res.partner.deliveryProfile }));
        }
        setRejectModalApp(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update application status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const prof = app.deliveryProfile || {};
    const status = prof.status || (prof.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION');

    if (statusFilter !== 'all') {
      if (statusFilter === 'ACTIVE') {
        if (status !== 'ACTIVE' && status !== 'APPROVED') return false;
      } else if (status !== statusFilter) {
        return false;
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (app.name || '').toLowerCase().includes(q);
      const matchEmail = (app.email || '').toLowerCase().includes(q);
      const matchPhone = (app.phone || '').toLowerCase().includes(q);
      const matchCity = (prof.city || '').toLowerCase().includes(q);
      const matchVehicle = (prof.vehicleNumber || '').toLowerCase().includes(q);
      const matchAadhaar = (prof.aadhaarNumber || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchCity || matchVehicle || matchAadhaar;
    }

    return true;
  });

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(
    (a) => (a.deliveryProfile?.status || 'PENDING_VERIFICATION') === 'PENDING_VERIFICATION' && !a.deliveryProfile?.isApproved
  ).length;
  const activeCount = applications.filter(
    (a) => a.deliveryProfile?.status === 'ACTIVE' || a.deliveryProfile?.status === 'APPROVED' || a.deliveryProfile?.isApproved
  ).length;
  const rejectedCount = applications.filter((a) => a.deliveryProfile?.status === 'REJECTED').length;
  const suspendedCount = applications.filter((a) => a.deliveryProfile?.status === 'SUSPENDED').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Fleet Logistics Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Delivery Partner Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verify rider government KYC documents, approve fleet accounts, and manage active logistics clearance.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Refresh Fleet'}</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="admin-card p-4 rounded-2xl border border-white/10 bg-slate-900/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Applications</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">{totalCount}</span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
              <Truck className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Pending KYC Review</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Active On-Road Fleet</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{activeCount}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">Rejected / Suspended</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-rose-400 font-mono">{rejectedCount + suspendedCount}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Ban className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-card p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'PENDING_VERIFICATION', label: `Pending (${pendingCount})` },
              { id: 'ACTIVE', label: `Active (${activeCount})` },
              { id: 'REJECTED', label: `Rejected (${rejectedCount})` },
              { id: 'SUSPENDED', label: `Suspended (${suspendedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search rider, phone, vehicle, Aadhaar..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading delivery partner applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="admin-card rounded-3xl border border-white/10 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No delivery partner applications found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? `No records matched search "${searchTerm}".`
              : 'There are currently no partner applications matching the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => {
            const prof = app.deliveryProfile || {};
            const rawStatus = prof.status || (prof.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION');
            const statusConfig = STATUS_BADGES[rawStatus] || STATUS_BADGES.PENDING_VERIFICATION;
            const StatusIcon = statusConfig.icon;
            const isActing = actionLoadingId === app._id;

            return (
              <div
                key={app._id}
                className="admin-card rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Partner Identity */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="text-sm font-bold text-white">{app.name}</h3>
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          <span>{statusConfig.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: #{String(app._id).slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300 font-medium">{app.phone || 'N/A'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300">{app.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300">{prof.city || 'Jaipur'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-end lg:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors flex items-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Full KYC</span>
                    </button>

                    {rawStatus === 'PENDING_VERIFICATION' && (
                      <>
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => handleUpdateStatus(app._id, 'ACTIVE')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                        >
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          <span>Approve & Activate</span>
                        </button>
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => setRejectModalApp(app)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {(rawStatus === 'ACTIVE' || rawStatus === 'APPROVED') && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleUpdateStatus(app._id, 'SUSPENDED', 'Account suspended by administrator.')}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Partner</span>
                      </button>
                    )}

                    {(rawStatus === 'REJECTED' || rawStatus === 'SUSPENDED') && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleUpdateStatus(app._id, 'ACTIVE')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reactivate / Approve</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Vehicle Information</span>
                    <span className="font-semibold text-white">
                      {prof.vehicleType || 'Bike'} ({prof.vehicleNumber || 'N/A'})
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Driving License</span>
                    <span className="font-mono text-slate-200">{prof.licenseNumber || 'Not provided'}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Government KYC</span>
                    <span className="font-mono text-slate-200">
                      PAN: {prof.panNumber || 'N/A'} • AADHAAR: {prof.aadhaarNumber ? `••••${prof.aadhaarNumber.slice(-4)}` : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Applied At</span>
                    <span className="text-slate-300">
                      {new Date(prof.appliedAt || app.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Rejection / Suspension Notice if any */}
                {prof.rejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center space-x-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                    <span>
                      <strong className="text-rose-400">Admin Notice:</strong> {prof.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: FULL KYC & APPLICANT DETAILS                    */}
      {/* ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-scale-up text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedApp.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    KYC & Delivery Fleet Clearance Dossier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Personal Details */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Applicant Contact
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Mobile Number:</span>
                    <span className="font-semibold text-white">{selectedApp.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email Address:</span>
                    <span className="font-semibold text-white">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Operating City:</span>
                    <span className="font-semibold text-white">
                      {selectedApp.deliveryProfile?.city || 'Jaipur'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Emergency Contact:</span>
                    <span className="font-semibold text-white">
                      {selectedApp.deliveryProfile?.emergencyContact || 'None provided'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Residential Address:</span>
                    <span className="font-semibold text-white">
                      {selectedApp.deliveryProfile?.address || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle & Driving License */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Vehicle & License Verification
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Vehicle Type:</span>
                    <span className="font-semibold text-white">
                      {selectedApp.deliveryProfile?.vehicleType || 'Two-Wheeler'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Registration Plate:</span>
                    <span className="font-mono font-bold text-white uppercase">
                      {selectedApp.deliveryProfile?.vehicleNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Driving License Number:</span>
                    <span className="font-mono font-bold text-white uppercase">
                      {selectedApp.deliveryProfile?.licenseNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Zones */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Preferred Delivery Zones
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedApp.deliveryProfile?.serviceZones || ['Jaipur Central']).map((z, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>

              {/* Government Identity Proofs */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Government Tax & Identity Proofs
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Aadhaar Number:</span>
                    <span className="font-mono font-bold text-white">
                      {selectedApp.deliveryProfile?.aadhaarNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">PAN Card Number:</span>
                    <span className="font-mono font-bold text-white uppercase">
                      {selectedApp.deliveryProfile?.panNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
              >
                Close
              </button>

              {selectedApp.deliveryProfile?.status !== 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedApp._id, 'ACTIVE')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
                >
                  Approve Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REJECT APPLICATION WITH REASON                  */}
      {/* ======================================================== */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5 text-rose-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-base font-bold text-white">Reject Application</h3>
              </div>
              <button
                onClick={() => setRejectModalApp(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                You are rejecting the delivery partner application for{' '}
                <strong className="text-white">{rejectModalApp.name}</strong>. Please provide a clear explanation for the rider.
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Driving license expired or Aadhaar details mismatch."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Driving license verification failed',
                    'Invalid or unreadable Aadhaar card',
                    'Operating area currently at full capacity',
                    'Vehicle documents expired',
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRejectModalApp(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(rejectModalApp._id, 'REJECTED', rejectionReason)}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/20"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryApplications;
