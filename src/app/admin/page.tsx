'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Building2, 
  CreditCard, 
  Download, 
  LogOut, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  Trash2, 
  Sparkles, 
  Trophy, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  Share2,
  Phone,
  QrCode,
  UserCheck,
  Clock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { StoredRegistration, AdminStats } from '@/types/registration';
import { SYMPOSIUM_EVENTS } from '@/data/events';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<StoredRegistration[]>([]);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'pending'>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Quick Check-In State
  const [checkInInput, setCheckInInput] = useState('');
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkInFeedback, setCheckInFeedback] = useState<{
    status: 'success' | 'warning' | 'error';
    message: string;
    student?: StoredRegistration;
  } | null>(null);

  // Selected registration for modal
  const [selectedReg, setSelectedReg] = useState<StoredRegistration | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete registration ${id}?`)) return;

    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedReg(null);
        fetchRegistrations();
      }
    } catch (error) {
      alert('Failed to delete registration.');
    }
  };

  // Toggle single student check-in
  const handleToggleCheckIn = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setCheckingInId(id);
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, checkedIn: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, checkedIn: newStatus, checkedInAt: newStatus ? new Date().toISOString() : undefined }
              : r
          )
        );
        fetchRegistrations();
      }
    } catch (err) {
      console.error('Check-in error:', err);
    } finally {
      setCheckingInId(null);
    }
  };

  // Fast Barcode / QR / ID Quick Check-In
  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = checkInInput.trim().toLowerCase();
    if (!query) return;

    // Find student by ID or clean phone
    const target = registrations.find((r) => {
      const idMatch = r.id.toLowerCase() === query;
      const phoneMatch = r.phone.replace(/\D/g, '') === query.replace(/\D/g, '');
      const emailMatch = r.email.toLowerCase() === query;
      return idMatch || phoneMatch || emailMatch;
    });

    if (!target) {
      setCheckInFeedback({
        status: 'error',
        message: `No student found matching "${checkInInput}". Please verify ID or Phone.`,
      });
      return;
    }

    if (target.checkedIn) {
      const timeStr = target.checkedInAt
        ? new Date(target.checkedInAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : 'earlier';
      setCheckInFeedback({
        status: 'warning',
        message: `Already Checked In! ${target.fullName} (${target.id}) was checked in at ${timeStr}.`,
        student: target,
      });
      setCheckInInput('');
      return;
    }

    // Process check-in
    setCheckingInId(target.id);
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: target.id, checkedIn: true }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === target.id
              ? { ...r, checkedIn: true, checkedInAt: new Date().toISOString() }
              : r
          )
        );
        setCheckInFeedback({
          status: 'success',
          message: `✅ PRESENT: ${target.fullName} (${target.id}) checked in successfully!`,
          student: target,
        });
        setCheckInInput('');
        fetchRegistrations();
      }
    } catch (err) {
      setCheckInFeedback({ status: 'error', message: 'Failed to process check-in.' });
    } finally {
      setCheckingInId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyShareLink = (path: string, key: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesType = typeFilter === 'all' || reg.type === typeFilter;
    const matchesEvent = eventFilter === 'all' || reg.events?.includes(eventFilter);
    const matchesAttendance =
      attendanceFilter === 'all'
        ? true
        : attendanceFilter === 'present'
        ? reg.checkedIn === true
        : !reg.checkedIn;

    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      reg.id.toLowerCase().includes(q) ||
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.phone.toLowerCase().includes(q) ||
      reg.collegeName.toLowerCase().includes(q) ||
      (reg.transactionId && reg.transactionId.toLowerCase().includes(q));

    return matchesType && matchesEvent && matchesAttendance && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              The Kavery Engineering College
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 border border-purple-500/50 text-purple-300">
              COORDINATOR ADMIN DESK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            ZENTRIX 2K26 Registration & Live Attendance Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time participant entry tracking, payment auditing & attendance records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Export Internal Only */}
          <a
            href="/api/admin/export?type=internal"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-950/80 hover:bg-pink-900 border border-pink-500/50 text-pink-300 text-xs font-bold shadow-[0_0_15px_rgba(255,0,127,0.25)] transition"
            title="Download Day 1 Internal Students CSV with Attendance"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Internal (.csv)</span>
          </a>

          {/* Export External Only */}
          <a
            href="/api/admin/export?type=external"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.25)] transition"
            title="Download Day 2 External Delegates CSV with Attendance"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export External (.csv)</span>
          </a>

          {/* Export All */}
          <a
            href="/api/admin/export"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition"
            title="Download All Registrations CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export All (.csv)</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ⚡ ON-SPOT CHECK-IN COUNTER (BARCODE & QR SCANNER ENTRY BAR) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block font-mono">
                EVENT DAY REGISTRATION DESK
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Live Attendance Check-In Verification
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold font-mono">
              ⚡ FAST SCAN ACTIVE
            </span>
          </div>
        </div>

        {/* Scanner Input Form */}
        <form onSubmit={handleQuickCheckIn} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={checkInInput}
              onChange={(e) => setCheckInInput(e.target.value)}
              placeholder="Scan Barcode / QR Code OR Enter Pass ID (e.g. ZENTRIX-INT-1234) or Phone Number..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-cyan-500/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 font-mono transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Present / Check In</span>
          </button>
        </form>

        {/* Live Feedback Alert Banner */}
        {checkInFeedback && (
          <div className={`mt-4 p-4 rounded-2xl border flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            checkInFeedback.status === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : checkInFeedback.status === 'warning'
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
              : 'bg-red-950/80 border-red-500/60 text-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {checkInFeedback.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-bold">{checkInFeedback.message}</p>
                {checkInFeedback.student && (
                  <div className="text-xs mt-1 text-slate-300 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                    <span>College: <strong className="text-white">{checkInFeedback.student.collegeName}</strong></span>
                    <span>Dept: <strong className="text-white">{checkInFeedback.student.department}</strong></span>
                    <span>Events: <strong className="text-cyan-300">{checkInFeedback.student.events.join(', ')}</strong></span>
                    <span>Fee: <strong className="text-emerald-400">₹{checkInFeedback.student.amount}/-</strong></span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setCheckInFeedback(null)}
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SHAREABLE DIRECT LINKS CARD */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Share Separate Dedicated Registration Portals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Internal Link Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/40 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block">
                Day 1 (24 Sep) — Internal Students Only (₹150)
              </span>
              <p className="text-xs font-mono text-slate-300 truncate mt-0.5">
                /internal
              </p>
            </div>

            <button
              onClick={() => copyShareLink('/internal', 'internal')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pink-950 hover:bg-pink-900 border border-pink-500/50 text-pink-300 text-xs font-bold shrink-0 transition shadow-[0_0_10px_rgba(255,0,127,0.2)]"
            >
              {copiedLink === 'internal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'internal' ? 'Copied Link!' : 'Copy Internal Link'}</span>
            </button>
          </div>

          {/* External Link Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                Day 2 (25 Sep) — External College Delegates (₹200)
              </span>
              <p className="text-xs font-mono text-slate-300 truncate mt-0.5">
                /external
              </p>
            </div>

            <button
              onClick={() => copyShareLink('/external', 'external')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold shrink-0 transition shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              {copiedLink === 'external' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'external' ? 'Copied Link!' : 'Copy External Link'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* TOP METRICS STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registered</span>
            <div className="text-3xl font-black text-white mt-1">{stats.totalRegistrations}</div>
            <p className="text-[11px] text-slate-500 mt-1">Confirmed passes</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Checked In</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {stats.totalRegistrations > 0 ? Math.round((stats.checkedInCount / stats.totalRegistrations) * 100) : 0}%
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-300 mt-1">{stats.checkedInCount}</div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Students present at venue</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-md">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Pending Arrival</span>
            <div className="text-3xl font-black text-amber-300 mt-1">{stats.pendingCheckInCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Yet to check in</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-pink-500/40 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
            <span className="text-[11px] font-semibold text-pink-400 uppercase tracking-wider">Day 1 Internal</span>
            <div className="text-3xl font-black text-pink-300 mt-1">
              {stats.checkedInInternalCount} <span className="text-sm text-slate-400 font-normal">/ {stats.internalCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">TKEC attendance</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Day 2 External</span>
            <div className="text-3xl font-black text-cyan-300 mt-1">
              {stats.checkedInExternalCount} <span className="text-sm text-slate-400 font-normal">/ {stats.externalCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Delegates attendance</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Total Fees</span>
            <div className="text-3xl font-black text-emerald-300 mt-1">₹{stats.totalRevenue}/-</div>
            <p className="text-[11px] text-slate-500 mt-1">Internal ₹150 + Ext ₹200</p>
          </div>

        </div>
      )}

      {/* EVENT BREAKDOWN STRIP */}
      {stats && (
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Registrations Count per Event Arena
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {SYMPOSIUM_EVENTS.map((ev) => {
              const count = stats.eventsCount[ev.name] || 0;
              return (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center"
                >
                  <span className="text-xs font-bold text-white block truncate" title={ev.name}>
                    {ev.name}
                  </span>
                  <span className="text-lg font-black text-cyan-400 font-mono mt-0.5 block">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, UTR, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Distinct Type Filter Tabs */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1">
            <button
              onClick={() => setTypeFilter('internal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                typeFilter === 'internal'
                  ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                  : 'text-slate-400 hover:text-pink-300 hover:bg-pink-950/40'
              }`}
            >
              <span>Day 1: Internal</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-pink-950/80 border border-pink-500/40 font-mono">
                {stats?.internalCount || 0}
              </span>
            </button>

            <button
              onClick={() => setTypeFilter('external')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                typeFilter === 'external'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              <span>Day 2: External</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950/80 border border-cyan-500/40 font-mono">
                {stats?.externalCount || 0}
              </span>
            </button>

            <button
              onClick={() => setTypeFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All Types</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/80 border border-purple-500/40 font-mono">
                {registrations.length}
              </span>
            </button>
          </div>

          {/* Attendance Filter Tabs */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1">
            <button
              onClick={() => setAttendanceFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                attendanceFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAttendanceFilter('present')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                attendanceFilter === 'present' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Present ({stats?.checkedInCount || 0})</span>
            </button>
            <button
              onClick={() => setAttendanceFilter('pending')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                attendanceFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending ({stats?.pendingCheckInCount || 0})</span>
            </button>
          </div>

          {/* Event Filter Dropdown */}
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Events</option>
            {SYMPOSIUM_EVENTS.map((ev) => (
              <option key={ev.id} value={ev.name}>
                {ev.name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* REGISTRATIONS DATA TABLE */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Pass ID</th>
                <th className="py-3.5 px-4">Attendance Check-In</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Participant Details</th>
                <th className="py-3.5 px-4">College & Dept</th>
                <th className="py-3.5 px-4">Events</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Fees</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No registrations found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Pass ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-300">
                        <span>{reg.id}</span>
                        <button
                          onClick={() => copyToClipboard(reg.id, reg.id)}
                          className="text-slate-500 hover:text-white"
                          title="Copy ID"
                        >
                          {copiedId === reg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* ATTENDANCE CHECK-IN STATUS BUTTON */}
                    <td className="py-3.5 px-4">
                      {reg.checkedIn ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[11px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>PRESENT</span>
                          </span>
                          <button
                            onClick={() => handleToggleCheckIn(reg.id, true)}
                            disabled={checkingInId === reg.id}
                            title="Undo / Unmark Check-in"
                            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-amber-300 transition"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleCheckIn(reg.id, false)}
                          disabled={checkingInId === reg.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 text-xs font-bold transition shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{checkingInId === reg.id ? 'Saving...' : 'Mark Present'}</span>
                        </button>
                      )}
                      {reg.checkedInAt && (
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {new Date(reg.checkedInAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          reg.type === 'internal'
                            ? 'border-pink-500/50 text-pink-300 bg-pink-950/40'
                            : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40'
                        }`}
                      >
                        {reg.type === 'internal' ? 'Day 1 Internal' : 'Day 2 External'}
                      </span>
                    </td>

                    {/* Participant Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{reg.fullName}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <a
                          href={`https://wa.me/91${reg.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-400 transition inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" /> {reg.phone}
                        </a>
                      </div>
                      <div className="text-slate-500 text-[10px] truncate max-w-[150px]">
                        {reg.email}
                      </div>
                    </td>

                    {/* College & Dept */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 truncate max-w-[180px]" title={reg.collegeName}>
                        {reg.collegeName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {reg.department}
                      </div>
                    </td>

                    {/* Events */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {reg.events?.map((ev) => (
                          <span
                            key={ev}
                            className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-medium text-slate-300"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4">
                      {reg.isTeam ? (
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                            Team ({reg.totalAttendees || 1 + (reg.teamMembers?.length || 0)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Solo</span>
                      )}
                    </td>

                    {/* Payment / Fees */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className={`font-bold font-mono ${reg.type === 'internal' ? 'text-pink-400' : 'text-cyan-400'}`}>
                          ₹{reg.amount || (reg.totalAttendees || 1) * (reg.type === 'internal' ? 150 : 200)}/-
                        </span>
                        {reg.transactionId && (
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]" title={reg.transactionId}>
                            UTR: {reg.transactionId}
                          </div>
                        )}
                        {reg.paymentScreenshotUrl && (
                          <a
                            href={reg.paymentScreenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-pink-400 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <ImageIcon className="w-2.5 h-2.5" /> View Proof
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTRATION DETAIL MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedReg.type === 'internal'
                    ? 'border-pink-500/50 text-pink-300 bg-pink-950/40'
                    : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40'
                }`}>
                  {selectedReg.type === 'internal' ? 'Day 1 Internal (₹150)' : 'Day 2 External (₹200)'}
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {selectedReg.id}
                </span>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Attendance Status inside Modal */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              selectedReg.checkedIn
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}>
              <div className="flex items-center gap-2 text-xs">
                {selectedReg.checkedIn ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  Attendance: <strong>{selectedReg.checkedIn ? 'PRESENT AT CAMPUS' : 'PENDING ARRIVAL'}</strong>
                </span>
              </div>

              <button
                onClick={() => handleToggleCheckIn(selectedReg.id, selectedReg.checkedIn ?? false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedReg.checkedIn
                    ? 'bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedReg.checkedIn ? 'Mark Absent' : 'Mark Present'}
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Full Name</span>
                <span className="font-bold text-white">{selectedReg.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Phone</span>
                <a href={`tel:${selectedReg.phone}`} className="font-bold text-cyan-300 hover:underline">
                  {selectedReg.phone}
                </a>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-200">{selectedReg.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">College</span>
                <span className="font-bold text-white text-right max-w-[260px]">{selectedReg.collegeName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Department</span>
                <span className="font-medium text-slate-200">{selectedReg.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Events (1 Tech + 1 Non-Tech)</span>
                <span className="font-bold text-pink-300 text-right">{selectedReg.events?.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Total Attendees</span>
                <span className="font-bold text-white">{selectedReg.totalAttendees} Person(s)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-black text-emerald-400 font-mono">₹{selectedReg.amount}/-</span>
              </div>
              {selectedReg.transactionId && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">UPI / UTR Transaction ID</span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedReg.transactionId}</span>
                </div>
              )}
            </div>

            {/* Payment Screenshot */}
            {selectedReg.paymentScreenshotUrl && (
              <div className="mt-3">
                <span className="text-xs text-slate-400 block mb-1.5">Payment Screenshot Proof:</span>
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 flex items-center justify-center bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedReg.paymentScreenshotUrl}
                    alt="Payment Proof"
                    className="max-h-48 object-contain"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
