'use client';

import React from 'react';
import { TeamMember } from '@/types/registration';
import { Users, UserPlus, Trash2, Shield, UserCheck } from 'lucide-react';

interface TeamSectionProps {
  isTeam: boolean;
  onToggleTeam: (enabled: boolean) => void;
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onUpdateMemberName: (id: string, name: string) => void;
  isExternal?: boolean;
  pricePerHead?: number;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  isTeam,
  onToggleTeam,
  teamMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMemberName,
  isExternal = false,
  pricePerHead = 150,
}) => {
  const maxMembers = 4; // Maximum additional team members (total team of 5)

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
      {/* Header with Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Team Participation
              {isTeam && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300">
                  {1 + teamMembers.length} Members Total
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Forming a squad for Project Expo, Bug Hunters, or other group challenges?
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label
          htmlFor="is-team-toggle"
          className="relative inline-flex items-center cursor-pointer select-none self-start sm:self-auto"
        >
          <input
            id="is-team-toggle"
            type="checkbox"
            checked={isTeam}
            onChange={(e) => onToggleTeam(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-13 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 peer-checked:shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-slate-700"></div>
          <span className="ml-3 text-sm font-medium text-slate-200">
            Registering as a Team?
          </span>
        </label>
      </div>

      {/* Dynamic Team Fields when toggled */}
      {isTeam && (
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> Team Lead: Primary registrant specified above
            </span>
            <span className="text-pink-400 font-mono">
              ₹{pricePerHead} per attendee ({1 + teamMembers.length} × ₹{pricePerHead} = ₹{(1 + teamMembers.length) * pricePerHead})
            </span>
          </div>

          {/* List of dynamic team members */}
          {teamMembers.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
              No additional team members added yet. Click <strong>&quot;Add Team Member&quot;</strong> below to include your co-participants.
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 focus-within:border-purple-500/80 transition-colors"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold shrink-0">
                    #{idx + 2}
                  </span>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      required
                      placeholder={`Team Member #${idx + 2} Full Name`}
                      value={member.name}
                      onChange={(e) => onUpdateMemberName(member.id, e.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors"
                    title="Remove member"
                    aria-label={`Remove team member ${idx + 2}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Team Member button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onAddMember}
              disabled={teamMembers.length >= maxMembers}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                teamMembers.length >= maxMembers
                  ? 'opacity-40 cursor-not-allowed border-slate-700 text-slate-500'
                  : 'bg-purple-950/50 hover:bg-purple-900/60 border-purple-500/50 text-purple-300 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>

            <span className="text-[11px] text-slate-500">
              Max {maxMembers + 1} participants per team
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
