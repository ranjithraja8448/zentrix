'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Users, 
  Trophy, 
  Award, 
  MapPin, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Flame,
  CreditCard
} from 'lucide-react';
import { SYMPOSIUM_EVENTS } from '@/data/events';

export default function Home() {
  // Countdown Timer to Day 1: September 24, 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-24T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden flex flex-col items-center">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 flex flex-col items-center text-center">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            THE KAVERY ENGINEERING COLLEGE (AUTONOMOUS)
          </span>
          <span className="px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold uppercase tracking-wider">
            DEPT OF CSE • IT • AI&DS PRESENTS
          </span>
        </div>

        {/* Grand Title: ZENTRIX 2K26 */}
        <div className="relative my-3">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            ZENTRIX
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 neon-text-magenta">
              2K26
            </span>
          </h1>
          
          <div className="h-1 w-48 sm:w-80 mx-auto mt-4 rounded-full bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_20px_#ff007f]" />
        </div>

        {/* Subtitle & Motto */}
        <p className="mt-4 text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase font-semibold">
          A National Level Technical Symposium • Code • Create • Conquer
        </p>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
          &quot;Let&apos;s Build the Future Together!&quot; Join premier coders, creators, and innovators across two power-packed days of technical & non-technical battles.
        </p>

        {/* Countdown Timer to Day 1 (24 Sep 2026) */}
        <div className="mt-8 flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 mb-2">Countdown to Day 1 Kickoff (24-09-2026)</span>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md w-full">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md"
              >
                <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TWO DEDICATED DAY REGISTRATION CARDS */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* DAY 1: Inter College (Internal) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-pink-950/40 to-slate-950 border-2 border-pink-500/60 shadow-[0_0_30px_rgba(255,0,127,0.2)] flex flex-col justify-between hover:border-pink-400 hover:shadow-[0_0_40px_rgba(255,0,127,0.35)] transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
                  DAY 1 • INTER COLLEGE
                </span>
                <span className="text-xl font-black text-pink-400 font-mono">₹150/-</span>
              </div>

              <h2 className="text-2xl font-black text-white group-hover:text-pink-300 transition-colors">
                24 September 2026
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Exclusively for students of <strong>The Kavery Engineering College</strong>.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Pick 1 Technical & 1 Non-Technical Event
                </p>
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Solo or Team Squad Participation
                </p>
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Fee: ₹150/- Per Head (Includes kit & pass)
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/internal"
                id="btn-internal-registration"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Register for Day 1 (Internal)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* DAY 2: External College */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 border-2 border-cyan-500/60 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(0,240,255,0.35)] transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  DAY 2 • EXTERNAL COLLEGE
                </span>
                <span className="text-xl font-black text-cyan-400 font-mono">₹200/-</span>
              </div>

              <h2 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                25 September 2026
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                For students from other <strong>Colleges & Universities</strong> across India.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Pick 1 Technical & 1 Non-Technical Event
                </p>
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Food, Delegate Kit & Certificates included
                </p>
                <p className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Fee: ₹200/- Per Head via UPI verification
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/external"
                id="btn-external-registration"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Register for Day 2 (External)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* OFFICIAL POSTER & ARENAS SHOWCASE SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-800/80">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
          
          {/* Left: Official Poster Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative p-3 rounded-3xl bg-slate-900 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zentrix-poster.jpg"
                alt="Official ZENTRIX 2K26 Poster"
                className="w-full max-w-xs h-auto rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="mt-3 text-center">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Official Event Poster
                </span>
              </div>
            </div>
          </div>

          {/* Right: Key Event Details & Rules */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" /> Competition Guidelines
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Event Structure: 1 Technical + 1 Non-Technical
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              To give every engineer the optimal competitive platform, each participant is eligible to compete in exactly <strong>one technical arena</strong> and <strong>one non-technical arena</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  💻 Technical Arenas (Pick 1)
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• <strong>Startup Spark</strong> (Idea Pitching)</li>
                  <li>• <strong>Project Expo</strong> (Working Prototypes)</li>
                  <li>• <strong>Bug Hunters</strong> (Code Debugging)</li>
                  <li>• <strong>Prompt Master</strong> (Generative AI)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/40">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">
                  🎭 Non-Technical Arenas (Pick 1)
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• <strong>Cinespark</strong> (Short Film)</li>
                  <li>• <strong>Meme Creation</strong> (Humor & Design)</li>
                  <li>• <strong>Logo Hunting</strong> (Visual Scavenger)</li>
                  <li>• <strong>Vedio Quiz</strong> (Multimedia Trivia)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>The Kavery Engineering College, Mecheri, Salem District, Tamil Nadu</span>
              </div>
              <Link href="/admin" className="text-purple-400 hover:underline font-semibold">
                Admin Portal →
              </Link>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
