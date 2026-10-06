'use client';

import React from 'react';
import { Shield, Sparkles, Zap, Flame, Crown, Swords, Crosshair, Award } from 'lucide-react';

interface TierBadgeProps {
  tierId: string;
  size?: 'sm' | 'md' | 'lg';
  gamemode?: string;
  showGamemode?: boolean;
  className?: string;
}

export default function TierBadge({
  tierId,
  size = 'md',
  gamemode,
  showGamemode = false,
  className = '',
}: TierBadgeProps) {
  const normTier = (tierId || 'LT5').toUpperCase().trim();

  // Distinct visual styling configurations for each competitive tier
  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'HT1':
        return {
          label: 'HT1',
          title: 'ELITE',
          border: 'border-rose-500/80',
          bg: 'bg-gradient-to-r from-rose-950/70 via-purple-900/60 to-dark-900',
          text: 'text-rose-300 font-extrabold',
          badgeText: 'text-rose-200',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.45)]',
          badgeBg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500',
          accentColor: '#f43f5e',
          icon: Crown,
          animatedBorder: true,
        };
      case 'HT2':
        return {
          label: 'HT2',
          title: 'MASTER',
          border: 'border-amber-500/70',
          bg: 'bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-dark-900',
          text: 'text-amber-300 font-bold',
          badgeText: 'text-amber-100',
          glow: 'shadow-[0_0_18px_rgba(245,158,11,0.4)]',
          badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600',
          accentColor: '#fbbf24',
          icon: Flame,
          animatedBorder: false,
        };
      case 'HT3':
        return {
          label: 'HT3',
          title: 'PRO',
          border: 'border-purple-500/60',
          bg: 'bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-dark-900',
          text: 'text-purple-300 font-bold',
          badgeText: 'text-purple-100',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
          badgeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
          accentColor: '#c084fc',
          icon: Zap,
          animatedBorder: false,
        };
      case 'HT4':
        return {
          label: 'HT4',
          title: 'VETERAN',
          border: 'border-blue-500/60',
          bg: 'bg-gradient-to-r from-blue-950/50 to-dark-900',
          text: 'text-blue-300 font-semibold',
          badgeText: 'text-blue-100',
          glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
          badgeBg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
          accentColor: '#60a5fa',
          icon: Shield,
          animatedBorder: false,
        };
      case 'HT5':
        return {
          label: 'HT5',
          title: 'SPECIALIST',
          border: 'border-cyan-500/50',
          bg: 'bg-gradient-to-r from-cyan-950/50 to-dark-900',
          text: 'text-cyan-300 font-semibold',
          badgeText: 'text-cyan-100',
          glow: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
          badgeBg: 'bg-gradient-to-r from-cyan-600 to-teal-600',
          accentColor: '#22d3ee',
          icon: Crosshair,
          animatedBorder: false,
        };
      case 'LT1':
        return {
          label: 'LT1',
          title: 'CHALLENGER',
          border: 'border-emerald-500/65',
          bg: 'bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-dark-900',
          text: 'text-emerald-300 font-bold',
          badgeText: 'text-emerald-100',
          glow: 'shadow-[0_0_16px_rgba(16,185,129,0.35)]',
          badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          accentColor: '#34d399',
          icon: Sparkles,
          animatedBorder: false,
        };
      case 'LT2':
        return {
          label: 'LT2',
          title: 'CONTENDER',
          border: 'border-sky-500/55',
          bg: 'bg-gradient-to-r from-sky-950/40 to-dark-900',
          text: 'text-sky-300 font-semibold',
          badgeText: 'text-sky-100',
          glow: 'shadow-[0_0_12px_rgba(14,165,233,0.3)]',
          badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600',
          accentColor: '#38bdf8',
          icon: Swords,
          animatedBorder: false,
        };
      case 'LT3':
        return {
          label: 'LT3',
          title: 'WARRIOR',
          border: 'border-indigo-500/40',
          bg: 'bg-gradient-to-r from-indigo-950/40 to-dark-900',
          text: 'text-indigo-300 font-medium',
          badgeText: 'text-indigo-100',
          glow: 'shadow-[0_0_10px_rgba(99,102,241,0.25)]',
          badgeBg: 'bg-gradient-to-r from-indigo-500 to-violet-600',
          accentColor: '#818cf8',
          icon: Shield,
          animatedBorder: false,
        };
      case 'LT4':
        return {
          label: 'LT4',
          title: 'CADET',
          border: 'border-violet-500/35',
          bg: 'bg-gradient-to-r from-violet-950/30 to-dark-900',
          text: 'text-violet-300 font-medium',
          badgeText: 'text-violet-100',
          glow: 'shadow-[0_0_8px_rgba(139,92,246,0.2)]',
          badgeBg: 'bg-gradient-to-r from-violet-500 to-purple-600',
          accentColor: '#a78bfa',
          icon: Award,
          animatedBorder: false,
        };
      case 'LT5':
      default:
        return {
          label: normTier,
          title: 'ROOKIE',
          border: 'border-slate-600/40',
          bg: 'bg-dark-850/60',
          text: 'text-slate-400 font-medium',
          badgeText: 'text-slate-300',
          glow: 'shadow-none',
          badgeBg: 'bg-slate-700',
          accentColor: '#94a3b8',
          icon: Shield,
          animatedBorder: false,
        };
    }
  };

  const config = getTierConfig(normTier);
  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${config.border} ${config.bg} ${config.glow} transition-all duration-300 ${className}`}
      >
        <span className={`text-[11px] font-mono tracking-wider ${config.text}`}>
          {config.label}
        </span>
        {showGamemode && gamemode && (
          <span className="text-[10px] text-slate-400 font-sans border-l border-slate-700/60 pl-1.5">
            {gamemode}
          </span>
        )}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`relative group overflow-hidden rounded-xl border ${config.border} ${config.bg} ${config.glow} p-3.5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${className}`}
      >
        {config.animatedBorder && (
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 animate-pulse pointer-events-none" />
        )}
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${config.badgeBg} text-white shadow-md flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              {showGamemode && gamemode && (
                <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-mono">
                  {gamemode}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-base font-black tracking-wider font-mono ${config.text}`}>
                  {config.label}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-dark-950/70 border border-slate-700/50 text-slate-300 font-mono uppercase tracking-widest text-[9px]">
                  {config.title}
                </span>
              </div>
            </div>
          </div>
          {normTier === 'HT1' && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PINNACLE
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'md' size
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ${config.border} ${config.bg} ${config.glow} backdrop-blur-sm transition-all duration-300 ${className}`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center text-white ${config.badgeBg} shadow-sm`}>
        <Icon className="w-3 h-3" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xs font-mono font-bold tracking-wider ${config.text}`}>
          {config.label}
        </span>
        <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-medium">
          {config.title}
        </span>
      </div>
      {showGamemode && gamemode && (
        <span className="text-xs text-slate-300 border-l border-slate-700/80 pl-2 font-medium">
          {gamemode}
        </span>
      )}
    </div>
  );
}
