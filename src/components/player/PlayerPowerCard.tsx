'use client';

import React from 'react';
import Link from 'next/link';
import { Player } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import { calculatePowerIndex } from '@/lib/powerIndex';
import { Shield, Swords, Sparkles, ChevronRight, Zap, Flame, Crown } from 'lucide-react';

interface PlayerPowerCardProps {
  player: Player;
  enable3d?: boolean;
  className?: string;
}

export default function PlayerPowerCard({
  player,
  enable3d = true,
  className = '',
}: PlayerPowerCardProps) {
  const topTier = Object.values(player.pvpTiers)[0] || 'HT1';
  const powerIndex = player.powerIndex || calculatePowerIndex(player);
  const pvpSkill = player.skills['PvP'] || 90;
  const buildSkill = player.skills['Building'] || 75;
  const gameSense = player.skills['Game Sense'] || 88;

  // Tier-specific holographic styling
  const getFoilStyles = (tier: string) => {
    if (tier.startsWith('HT1')) {
      return {
        cardBorder: 'border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.35)]',
        foilOverlay: 'bg-gradient-to-br from-rose-500/15 via-purple-600/10 to-amber-500/15',
        badgeColor: 'from-rose-500 via-pink-600 to-amber-500 text-white',
        pedestalGlow: '#f43f5e',
        tag: 'PINNACLE ELITE',
      };
    }
    if (tier.startsWith('HT2')) {
      return {
        cardBorder: 'border-amber-500/80 shadow-[0_0_30px_rgba(251,191,36,0.35)]',
        foilOverlay: 'bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-yellow-500/15',
        badgeColor: 'from-amber-400 to-orange-500 text-dark-950',
        pedestalGlow: '#fbbf24',
        tag: 'MASTER DIVISION',
      };
    }
    if (tier.startsWith('HT3')) {
      return {
        cardBorder: 'border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.3)]',
        foilOverlay: 'bg-gradient-to-br from-purple-500/15 via-indigo-600/10 to-pink-500/10',
        badgeColor: 'from-purple-500 to-indigo-600 text-white',
        pedestalGlow: '#a855f7',
        tag: 'PRO BRACKET',
      };
    }
    if (tier.startsWith('LT1')) {
      return {
        cardBorder: 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
        foilOverlay: 'bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-cyan-500/10',
        badgeColor: 'from-emerald-400 to-teal-600 text-dark-950',
        pedestalGlow: '#10b981',
        tag: 'CHALLENGER',
      };
    }
    return {
      cardBorder: 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      foilOverlay: 'bg-gradient-to-br from-cyan-500/10 to-slate-900',
      badgeColor: 'from-cyan-500 to-blue-600 text-white',
      pedestalGlow: '#06b6d4',
      tag: 'CONTENDER',
    };
  };

  const foil = getFoilStyles(topTier);

  return (
    <div
      className={`group relative rounded-3xl bg-dark-900/90 border ${foil.cardBorder} overflow-hidden backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] flex flex-col justify-between ${className}`}
    >
      {/* Holographic foil ambient layer */}
      <div className={`absolute inset-0 pointer-events-none opacity-80 ${foil.foilOverlay}`} />

      {/* Subtle card grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Card Header: LOXXY Insignia & Power Index */}
      <div className="relative z-10 p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-dark-950 rounded-[7px] flex items-center justify-center">
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-xs tracking-widest text-white uppercase">
              LOXXY POWER CARD
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              {foil.tag}
            </div>
          </div>
        </div>

        {/* Loxxy Power Index Badge */}
        <div className="flex flex-col items-end">
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
            POWER INDEX
          </div>
          <div className="font-display font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-300 to-pink-400 leading-tight">
            {powerIndex.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 3D Minecraft Rig Arena Stage */}
      <div className="relative z-10 py-3 flex justify-center items-center overflow-hidden min-h-[250px]">
        {enable3d ? (
          <MinecraftSkinViewer
            skinUrl={player.skinUrl}
            width={210}
            height={260}
            initialAnimation="idle"
            autoRotate={true}
            enableControls={false}
            glowColor={foil.pedestalGlow}
          />
        ) : (
          <div className="w-32 h-44 rounded-2xl bg-dark-950 border border-slate-800 p-2 flex items-center justify-center">
            <img
              src={player.avatarUrl || `https://mc-heads.net/body/${player.ign}/160`}
              alt={player.ign}
              className="h-full object-contain pixelated"
            />
          </div>
        )}
      </div>

      {/* Player Identity & Badges */}
      <div className="relative z-10 p-5 pt-1 space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
            {player.ign}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase font-semibold">
              {player.role}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-medium">
              {player.status}
            </span>
          </div>
        </div>

        {/* Gamemode Tier Grid */}
        <div className="p-3 rounded-2xl bg-dark-950/80 border border-slate-800/80 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Gamemode Tiers</span>
            <span className="text-cyan-400">{player.mainGamemode}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(player.pvpTiers).slice(0, 6).map(([mode, tier]) => (
              <div
                key={mode}
                className="flex items-center justify-between px-2 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono"
              >
                <span className="text-[11px] text-slate-300">{mode}</span>
                <TierBadge tierId={tier} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill Mechanics Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center bg-dark-950/60 rounded-xl p-2.5 border border-slate-800/60 font-mono">
          <div>
            <div className="text-[9px] text-slate-400 uppercase">PvP</div>
            <div className="text-xs font-bold text-rose-400 mt-0.5">{pvpSkill}%</div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">Sense</div>
            <div className="text-xs font-bold text-cyan-400 mt-0.5">{gameSense}%</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Build</div>
            <div className="text-xs font-bold text-amber-400 mt-0.5">{buildSkill}%</div>
          </div>
        </div>

        {/* Action: View Profile */}
        <Link
          href={`/roster/${encodeURIComponent(player.ign)}`}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-md hover:shadow-glow-cyan transition-all"
        >
          <span>View Athlete Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
