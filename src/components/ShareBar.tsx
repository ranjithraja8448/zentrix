'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareBarProps {
  type: 'internal' | 'external';
}

export const ShareBar: React.FC<ShareBarProps> = ({ type }) => {
  const [copied, setCopied] = useState(false);

  const isInternal = type === 'internal';
  const path = isInternal ? '/internal' : '/external';
  const label = isInternal 
    ? 'Day 1 (24 Sep) — Internal Student Link' 
    : 'Day 2 (25 Sep) — External College Link';
  const desc = isInternal 
    ? 'Share this exact link only in The Kavery Engineering College groups (Fee: ₹150).'
    : 'Share this link with other college & university students (Fee: ₹200).';

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${path}`;
    const text = isInternal
      ? `🔥 *ZENTRIX 2K26 - Day 1 Inter College Registration*\nThe Kavery Engineering College (Autonomous)\nDate: 24-09-2026 (Day 1)\nRegistration Fee: ₹150/- Per Head\n\nRegister here: ${fullUrl}`
      : `🚀 *ZENTRIX 2K26 - Day 2 External College Registration*\nThe Kavery Engineering College (Autonomous), Salem\nDate: 25-09-2026 (Day 2)\nRegistration Fee: ₹200/- Per Head\n\nRegister here: ${fullUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border backdrop-blur-md ${
      isInternal 
        ? 'bg-pink-950/30 border-pink-500/30' 
        : 'bg-cyan-950/30 border-cyan-500/30'
    }`}>
      <div className="flex items-center gap-2.5 text-center sm:text-left">
        <div className={`p-2 rounded-xl ${isInternal ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
          <Share2 className="w-4 h-4" />
        </div>
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider block ${isInternal ? 'text-pink-300' : 'text-cyan-300'}`}>
            {label}
          </span>
          <span className="text-[11px] text-slate-400">
            {desc}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0 ${
          isInternal
            ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'WhatsApp Link Copied!' : 'Copy Direct Share Link'}</span>
      </button>
    </div>
  );
};
