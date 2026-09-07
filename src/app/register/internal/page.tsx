import React from 'react';
import Link from 'next/link';
import { RegistrationForm } from '@/components/RegistrationForm';
import { ShareBar } from '@/components/ShareBar';
import { ChevronLeft, Building2, Calendar, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Day 1 Internal Registration | ZENTRIX 2K26 - The Kavery Engineering College',
  description: 'Day 1 Inter College registration form for students of The Kavery Engineering College for Zentrix 2K26 on 24-09-2026.',
};

export default function InternalRegistrationPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow accents */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb (Back to Home only - no external link) */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-pink-300 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Zentrix Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 font-bold font-mono">
              DAY 1 • 24-09-2026
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-pink-400" />
            <span>The Kavery Engineering College (Autonomous) • Inter College Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ZENTRIX 2K26 — Day 1 Internal Registration
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Exclusive registration for current students of <strong>The Kavery Engineering College</strong>. Organized by Dept of CSE, IT, AI&DS. Registration Fee: <strong>₹150/- Per Head</strong>.
          </p>
        </div>

        {/* Direct Link Share Helper for Internal WhatsApp groups */}
        <ShareBar type="internal" />

        {/* Reusable Form rendered for Internal (₹150, Day 1) */}
        <RegistrationForm type="internal" />

      </div>
    </div>
  );
}
