'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Calendar, ShieldCheck, ArrowLeft, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isInternalPage = pathname?.startsWith('/internal') || pathname?.startsWith('/register/internal');
  const isExternalPage = pathname?.startsWith('/external') || pathname?.startsWith('/register/external');
  const logoHref = isInternalPage ? '/internal' : isExternalPage ? '/external' : '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060814]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link href={logoHref} className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.4)] transition-all duration-300">
              <Cpu className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  The Kavery (Autonomous)
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  CSE • IT • AI&DS
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 bg-clip-text text-transparent group-hover:opacity-95">
                ZENTRIX 2K26
              </span>
            </div>
          </Link>

          {/* Context-aware Navigation */}
          {isInternalPage ? (
            /* Locked to Internal Portal - strictly no external link shown */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/50 text-xs text-pink-300 shadow-[0_0_15px_rgba(255,0,127,0.25)]">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>DAY 1: <strong className="text-white font-mono">24-09-2026</strong> (TKEC Inter College)</span>
              </div>
            </div>
          ) : isExternalPage ? (
            /* Locked to External Portal - strictly no internal link shown */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/50 text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>DAY 2: <strong className="text-white font-mono">25-09-2026</strong> (External College)</span>
              </div>
            </div>
          ) : (
            /* Home & Admin pages */
            <nav className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Day 1: <strong className="text-pink-300">24 Sep</strong> | Day 2: <strong className="text-cyan-300">25 Sep</strong></span>
              </div>
              <Link
                href="/"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Home
              </Link>
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase border transition-all ${
                  pathname?.startsWith('/admin')
                    ? 'text-purple-300 bg-purple-950/80 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 border-slate-800'
                }`}
              >
                <span>Admin Desk</span>
              </Link>
            </nav>
          )}

        </div>
      </div>
      {/* Dynamic top gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/60 via-pink-500/60 to-transparent" />
    </header>
  );
};
