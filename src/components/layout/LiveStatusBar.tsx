'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { Activity, Users, Gamepad2, MessageSquare, Zap } from 'lucide-react';

interface LiveStatusBarProps {
  settings: SiteSettings;
}

export default function LiveStatusBar({ settings }: LiveStatusBarProps) {
  const live = settings.liveStatus;
  if (!live || !live.enabled) return null;

  return (
    <div className="w-full bg-dark-900/90 border-b border-slate-800/80 px-4 py-2 backdrop-blur-md relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Left: Indicator title */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold uppercase tracking-wider text-white">LOXXY LIVE STATUS</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{live.currentActivity || 'Competitive Arena Training'}</span>
        </div>

        {/* Right: Metrics pills */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-white">{live.membersOnline}</strong> Online</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-white">{live.playersInGame}</strong> In Match</span>
          </div>

          {live.discordOnline && (
            <div className="flex items-center gap-1.5 text-indigo-300 hidden md:flex">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discord Guild Active</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
