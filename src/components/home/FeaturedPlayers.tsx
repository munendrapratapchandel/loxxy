'use client';

import React from 'react';
import Link from 'next/link';
import { Player } from '@/lib/types';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import TierBadge from '@/components/tier/TierBadge';
import { ArrowRight, ChevronRight, Shield, Zap, Sparkles } from 'lucide-react';

interface FeaturedPlayersProps {
  players: Player[];
}

export default function FeaturedPlayers({ players }: FeaturedPlayersProps) {
  const featured = players.filter(p => p.featured);
  const displayPlayers = featured.length > 0 ? featured : players.slice(0, 3);

  return (
    <section className="relative py-24 bg-dark-950 overflow-hidden border-t border-slate-900">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Elite Roster Athletes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
              FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">PLAYERS</span>
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-xl">
              Equipped with high-tier PvP badges, custom 3D Minecraft rigs, and competitive combat mastery across sword, crystal, axe, and mace gamemodes.
            </p>
          </div>

          <Link
            href="/roster"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 hover:border-cyan-400/80 text-sm font-semibold text-slate-200 hover:text-white transition-all group shadow-sm"
          >
            <span>Explore Full Team</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPlayers.map((player) => {
            // Find top tier badge
            const mainMode = player.mainGamemode.split(' ')[0] || 'Sword';
            const topTier = player.pvpTiers[mainMode] || Object.values(player.pvpTiers)[0] || 'HT1';
            const pvpSkill = player.skills['PvP'] || 95;
            const buildSkill = player.skills['Building'] || 80;
            const redstoneSkill = player.skills['Redstone'] || 70;

            return (
              <div
                key={player.id}
                className="group relative rounded-3xl bg-dark-900/60 border border-slate-800/80 hover:border-brand-500/60 backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-md flex flex-col justify-between"
              >
                {/* Arena Header Tag */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    LOXXY ARENA
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 font-mono font-medium">
                    {player.role}
                  </span>
                </div>

                {/* 3D Minecraft Skin Rig Stage */}
                <div className="relative py-2 flex justify-center items-center overflow-hidden">
                  <MinecraftSkinViewer
                    skinUrl={player.skinUrl}
                    width={220}
                    height={280}
                    initialAnimation="idle"
                    autoRotate={true}
                    enableControls={false}
                    glowColor={topTier.startsWith('HT1') ? '#f43f5e' : topTier.startsWith('HT2') ? '#fbbf24' : '#8b5cf6'}
                  />
                </div>

                {/* Player Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                    {player.ign}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {player.name !== player.ign ? `${player.name} • ` : ''}{player.region}
                  </p>

                  {/* Primary Gamemode Tier Badge */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <TierBadge tierId={topTier} size="md" gamemode={player.mainGamemode} showGamemode={true} />
                  </div>

                  {/* Skill Stats Bar Row */}
                  <div className="mt-6 grid grid-cols-3 gap-2 bg-dark-950/70 rounded-2xl p-3 border border-slate-800/60">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">PvP</div>
                      <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">{pvpSkill}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pvpSkill}%` }} />
                      </div>
                    </div>
                    <div className="text-center border-x border-slate-800/60 px-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Build</div>
                      <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">{buildSkill}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${buildSkill}%` }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Redstone</div>
                      <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{redstoneSkill}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${redstoneSkill}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* View Profile Action */}
                  <Link
                    href={`/roster/${encodeURIComponent(player.ign)}`}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 hover:bg-gradient-to-r hover:from-brand-600 hover:to-cyan-600 text-xs uppercase tracking-wider font-bold text-slate-200 hover:text-white transition-all duration-300 border border-slate-700/60 hover:border-transparent group-hover:shadow-glow-sm"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
