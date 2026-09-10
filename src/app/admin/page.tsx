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
  Phone
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
  const [eventFilter, setEventFilter] = useState<string>('all');

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
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      reg.id.toLowerCase().includes(q) ||
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.phone.toLowerCase().includes(q) ||
      reg.collegeName.toLowerCase().includes(q) ||
      (reg.transactionId && reg.transactionId.toLowerCase().includes(q));

    return matchesType && matchesEvent && matchesSearch;
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
              ADMIN DESK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Symposium 2K26 Registration Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Database location: <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">registration web/data/registrations.json</code>
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
            title="Download Day 1 Internal Students CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Internal (.csv)</span>
          </a>

          {/* Export External Only */}
          <a
            href="/api/admin/export?type=external"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.25)] transition"
            title="Download Day 2 External Delegates CSV"
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registrations</span>
            <div className="text-3xl font-black text-white mt-1">{stats.totalRegistrations}</div>
            <p className="text-[11px] text-slate-500 mt-1">Distinct registration passes</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Total Attendees</span>
            <div className="text-3xl font-black text-purple-300 mt-1">{stats.totalParticipants}</div>
            <p className="text-[11px] text-slate-500 mt-1">Including team members</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Internal Students</span>
            <div className="text-3xl font-black text-cyan-300 mt-1">{stats.internalCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">TKEC participants</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-pink-500/40 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
            <span className="text-[11px] font-semibold text-pink-400 uppercase tracking-wider">External Colleges</span>
            <div className="text-3xl font-black text-pink-300 mt-1">{stats.externalCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">National delegates</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Total Fees Collected</span>
            <div className="text-3xl font-black text-emerald-300 mt-1">₹{stats.totalRevenue}/-</div>
            <p className="text-[11px] text-slate-500 mt-1">₹200 per external head</p>
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                typeFilter === 'internal'
                  ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                  : 'text-slate-400 hover:text-pink-300 hover:bg-pink-950/40'
              }`}
            >
              <span>Day 1: Internal (24 Sep)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-pink-950/80 border border-pink-500/40 font-mono">
                {stats?.internalCount || 0}
              </span>
            </button>

            <button
              onClick={() => setTypeFilter('external')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                typeFilter === 'external'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              <span>Day 2: External (25 Sep)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950/80 border border-cyan-500/40 font-mono">
                {stats?.externalCount || 0}
              </span>
            </button>

            <button
              onClick={() => setTypeFilter('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                typeFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/80 border border-purple-500/40 font-mono">
                {registrations.length}
              </span>
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
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Participant Details</th>
                <th className="py-3.5 px-4">College & Dept</th>
                <th className="py-3.5 px-4">Events</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Fees / Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
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

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          reg.type === 'internal'
                            ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40'
                            : 'border-pink-500/50 text-pink-300 bg-pink-950/40'
                        }`}
                      >
                        {reg.type === 'internal' ? 'Internal' : 'External'}
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
                      {reg.type === 'internal' ? (
                        <span className="text-xs text-slate-400 font-mono">Free</span>
                      ) : (
                        <div>
                          <span className="font-bold text-emerald-400 font-mono">
                            ₹{reg.amount || (reg.totalAttendees || 1) * 200}/-
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
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 transition mr-2"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 border border-slate-700 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL DETAILS MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-400/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.3)] my-8 text-white">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Registration Verification Desk
                </span>
                <h3 className="text-xl font-black text-white">{selectedReg.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Pass ID:</span>
                  <p className="font-mono font-bold text-cyan-300 mt-0.5">{selectedReg.id}</p>
                </div>
                <div>
                  <span className="text-slate-400">College:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedReg.collegeName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="text-white mt-0.5">{selectedReg.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">WhatsApp Phone:</span>
                  <p className="text-emerald-400 font-mono mt-0.5">{selectedReg.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <p className="text-white mt-0.5">{selectedReg.department}</p>
                </div>
                <div>
                  <span className="text-slate-400">Total Participants:</span>
                  <p className="text-purple-300 font-bold mt-0.5">{selectedReg.totalAttendees} members</p>
                </div>
              </div>

              {/* Team Members List */}
              {selectedReg.isTeam && selectedReg.teamMembers && selectedReg.teamMembers.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider block mb-1.5">
                    Team Members:
                  </span>
                  <ul className="space-y-1">
                    {selectedReg.teamMembers.map((m, i) => (
                      <li key={i} className="text-slate-300 flex items-center gap-1.5">
                        <span className="text-purple-400 font-bold">#{i + 2}</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Events list */}
              <div>
                <span className="text-slate-400 block mb-1.5">Registered Events:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedReg.events?.map((ev) => (
                    <span
                      key={ev}
                      className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-medium"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment Proof Section if External */}
              {selectedReg.type === 'external' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/30 space-y-2">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                    Payment Verification
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fee Amount:</span>
                    <strong className="text-white font-mono">₹{selectedReg.amount}/-</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transaction ID / UTR:</span>
                    <strong className="text-cyan-300 font-mono">{selectedReg.transactionId || 'N/A'}</strong>
                  </div>

                  {selectedReg.paymentScreenshotUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-2">Uploaded Payment Screenshot:</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedReg.paymentScreenshotUrl}
                        alt="Payment screenshot"
                        className="max-h-60 rounded-lg border border-slate-700 object-contain mx-auto"
                      />
                      <div className="text-center mt-2">
                        <a
                          href={selectedReg.paymentScreenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-pink-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Open in full size
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
