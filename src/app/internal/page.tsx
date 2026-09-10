'use client';

import React, { useState, useEffect } from 'react';
import { RegistrationForm } from '@/components/RegistrationForm';
import { ShareBar } from '@/components/ShareBar';
import { 
  Calendar, 
  Sparkles, 
  Building2, 
  MapPin, 
  Trophy, 
  Cpu, 
  CheckCircle2,
  ShieldCheck,
  Award,
  Flame,
  CreditCard
} from 'lucide-react';

export default function InternalPortalPage() {
  // Countdown to Day 1: 24 September 2026
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-09-24T09:00:00+05:30').getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      
      {/* Ambient Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* DEDICATED HERO SECTION (DAY 1 - INTERNAL ONLY) */}
      <div className="text-center relative z-10 space-y-4">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,127,0.3)] animate-pulse">
          <Building2 className="w-4 h-4 text-pink-400" />
          <span>The Kavery Engineering College (Autonomous) • Day 1 Portal</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          ZENTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 neon-text-magenta">2K26</span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-pink-400 mt-2">
            Inter College Registration (Day 1)
          </span>
        </h1>

        <p className="text-xs sm:text-sm font-mono tracking-widest text-pink-300 uppercase">
          Dept of CSE • IT • AI&DS Presents • Code • Create • Conquer
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Exclusive registration portal for all students of <strong>The Kavery Engineering College</strong>. Compete in 1 Technical and 1 Non-Technical arena.
        </p>

        {/* Date & Fee Highlight Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pink-950/70 border border-pink-500/50 text-white shadow-[0_0_15px_rgba(255,0,127,0.25)]">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span className="text-xs uppercase text-slate-300">Event Date:</span>
            <strong className="text-base font-black font-mono text-pink-300">24 September 2026</strong>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-md">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase text-slate-300">Registration Fee:</span>
            <strong className="text-base font-black font-mono text-cyan-300">₹150/- Per Head</strong>
          </div>
        </div>

        {/* Live Countdown Grid to 24-09-2026 */}
        <div className="pt-4 flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">Time Remaining Until Day 1</span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs w-full">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((t) => (
              <div key={t.label} className="p-2.5 rounded-xl bg-slate-900/90 border border-pink-500/30 text-center">
                <span className="text-xl sm:text-2xl font-black font-mono text-pink-300">
                  {String(t.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 block mt-0.5">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WHATSAPP SHARE BAR FOR INTERNAL */}
      <div className="max-w-4xl mx-auto">
        <ShareBar type="internal" />
      </div>

      {/* REGISTRATION FORM (INTERNAL ₹150) */}
      <div className="relative z-10">
        <RegistrationForm type="internal" />
      </div>

    </div>
  );
}
