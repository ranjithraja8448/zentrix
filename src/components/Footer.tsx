'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Award, Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isInternalPage = pathname?.startsWith('/internal') || pathname?.startsWith('/register/internal');
  const isExternalPage = pathname?.startsWith('/external') || pathname?.startsWith('/register/external');

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#04060e] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: College Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  The Kavery Engineering College
                </h3>
                <p className="text-xs text-cyan-400 font-mono tracking-wider">Approved by AICTE, Affiliated to Anna University</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Join the pinnacle of engineering innovation at <strong>ZENTRIX 2K26</strong>. Compete with the brightest tech minds across top colleges and demonstrate technological brilliance.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> ISO Certified Campus
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <Award className="w-4 h-4" /> Accredited Institution
              </span>
            </div>
          </div>

          {/* Col 2: Event Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {isInternalPage ? (
                <>
                  <li>
                    <Link href="/internal" className="text-pink-300 font-bold hover:text-white transition-colors">
                      Day 1 Inter College Registration
                    </Link>
                  </li>
                  <li>
                    <span className="text-xs px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/40 block">
                      Event Date: 24-09-2026 (Fee: ₹150)
                    </span>
                  </li>
                </>
              ) : isExternalPage ? (
                <>
                  <li>
                    <Link href="/external" className="text-cyan-300 font-bold hover:text-white transition-colors">
                      Day 2 External College Registration
                    </Link>
                  </li>
                  <li>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 block">
                      Event Date: 25-09-2026 (Fee: ₹200)
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/" className="hover:text-cyan-300 transition-colors">
                      Symposium Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/internal" className="hover:text-pink-300 transition-colors">
                      Day 1: Internal College (24 Sep)
                    </Link>
                  </li>
                  <li>
                    <Link href="/external" className="hover:text-cyan-300 transition-colors">
                      Day 2: External College (25 Sep)
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Coordinator Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-pink-400">
              Contact & Venue
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>The Kavery Engineering College (Autonomous), M.Kalipatti, Mecheri, Salem - 636453, Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+917904708317" className="hover:text-cyan-300 transition-colors">
                  Dept of CSE, IT, AI&DS Helpdesk: +91 7904708317
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:zentrix2k2six@gmail.com" className="hover:text-cyan-300 transition-colors">
                  zentrix2k2six@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 The Kavery Engineering College (Autonomous). All rights reserved.</p>
          <p className="font-mono text-cyan-400/80">ZENTRIX 2K26 • 24 & 25 September 2026</p>
        </div>
      </div>
    </footer>
  );
};
