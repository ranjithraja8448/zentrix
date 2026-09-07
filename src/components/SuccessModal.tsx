'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Download, 
  Home, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  QrCode, 
  Calendar, 
  MapPin, 
  Cpu 
} from 'lucide-react';
import Link from 'next/link';
import { RegistrationSubmissionResult } from '@/types/registration';

interface SuccessModalProps {
  result: RegistrationSubmissionResult;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ result, onReset }) => {
  useEffect(() => {
    // Trigger celebratory cyberpunk confetti burst
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#00f0ff', '#ff007f', '#a855f7', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.4)] my-8 text-white">
        
        {/* Top Success Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.6)] mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Registration Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 bg-gradient-to-r from-cyan-300 via-white to-pink-400 bg-clip-text text-transparent">
            Welcome to SYMPOSIUM 2K26!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
            Your pass has been generated. Please keep this registration pass or screenshot handy for entry on the event day.
          </p>
        </div>

        {/* Cyber Pass Ticket Box */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#060814] border border-cyan-500/40 relative overflow-hidden shadow-inner">
          {/* Neon accent corner notches */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-cyan-500/20 rounded-full blur-lg" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-pink-500/20 rounded-full blur-lg" />

          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider">OFFICIAL PARTICIPATION PASS</span>
              <h3 className="text-base font-extrabold text-white">The Kavery Engineering College</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pass ID:</span>
              <span className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                {result.registrationId}
              </span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
            <div>
              <span className="text-slate-400">Lead Participant</span>
              <p className="text-sm font-bold text-white mt-0.5">{result.data.fullName}</p>
              <p className="text-slate-400 font-mono text-[11px]">{result.data.phone}</p>
            </div>

            <div>
              <span className="text-slate-400">College / Institution</span>
              <p className="text-sm font-bold text-cyan-300 mt-0.5">{result.data.collegeName}</p>
              <p className="text-slate-400 text-[11px]">{result.data.department}</p>
            </div>

            <div>
              <span className="text-slate-400">Registered Events</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {result.data.events.map((ev) => (
                  <span
                    key={ev}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-white"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Category & Team</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  result.data.type === 'internal'
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
                    : 'border-pink-500/40 text-pink-300 bg-pink-950/40'
                }`}>
                  {result.data.type === 'internal' ? 'Internal Student' : 'External College'}
                </span>
                {result.data.isTeam && (
                  <span className="text-[11px] text-purple-300 font-medium">
                    Team of {1 + result.data.teamMembers.length}
                  </span>
                )}
              </div>
              {result.data.teamMembers.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  Members: {result.data.teamMembers.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Ticket Footer (Date & Location) */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> 21-08-2026 (Friday) • 09:00 AM IST
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-400" /> Main Auditorium, Kavery Campus, Mecheri
            </div>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Pass</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Register Another</span>
            </button>

            <Link
              href="/"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
