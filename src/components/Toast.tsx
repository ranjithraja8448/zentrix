'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-pink-500/80 rounded-xl shadow-[0_0_25px_rgba(255,0,127,0.4)] backdrop-blur-md text-white">
        <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">Limit Exceeded</p>
          <p className="text-sm text-slate-200">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
