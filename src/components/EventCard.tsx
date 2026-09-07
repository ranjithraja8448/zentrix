'use client';

import React from 'react';
import { EventItem } from '@/types/registration';
import { 
  Rocket, 
  Cpu, 
  Bug, 
  Sparkles, 
  Film, 
  Smile, 
  Search, 
  PlaySquare, 
  Check, 
  Lock 
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  isSelected: boolean;
  isDisabled: boolean; // True if 2 events are selected and this isn't one
  onToggle: (eventId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Bug: <Bug className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  PlaySquare: <PlaySquare className="w-5 h-5" />,
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected,
  isDisabled,
  onToggle,
}) => {
  const icon = iconMap[event.iconName] || <Sparkles className="w-5 h-5" />;

  const handleClick = () => {
    onToggle(event.id);
  };

  return (
    <div
      onClick={handleClick}
      id={`event-card-${event.id}`}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 select-none ${
        isSelected
          ? 'bg-slate-900/90 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.35)] scale-[1.02]'
          : isDisabled
          ? 'bg-slate-900/40 border border-slate-800/80 opacity-65 hover:border-pink-500/50 hover:opacity-90'
          : 'bg-slate-900/60 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/60 hover:shadow-[0_0_18px_rgba(0,240,255,0.15)]'
      }`}
    >
      {/* Top row: Category tag & Checkbox */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${event.badgeColor}`}
        >
          {event.category}
        </span>

        <div
          className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all ${
            isSelected
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.8)] font-bold'
              : 'border border-slate-600 bg-slate-800/80 group-hover:border-cyan-400'
          }`}
        >
          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
          {!isSelected && isDisabled && <Lock className="w-3 h-3 text-slate-500" />}
        </div>
      </div>

      {/* Main Content: Icon and Name */}
      <div className="flex items-start gap-3 my-2">
        <div
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            isSelected
              ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40'
          }`}
        >
          {icon}
        </div>

        <div>
          <h4
            className={`text-base font-bold transition-colors ${
              isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'
            }`}
          >
            {event.name}
          </h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Selection state banner indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        {isSelected ? (
          <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Selected ({event.category})
          </span>
        ) : isDisabled ? (
          <span className="text-pink-400/90 font-medium flex items-center gap-1">
            <Lock className="w-3 h-3" /> Slot filled (Click to swap)
          </span>
        ) : (
          <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">
            Select {event.category} Event
          </span>
        )}
      </div>
    </div>
  );
};
