'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings, Player } from '@/lib/types';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import TierBadge from '@/components/tier/TierBadge';
import { Swords, Trophy, MessageSquare, ChevronRight, Sparkles, Shield, Flame, Activity } from 'lucide-react';

interface HeroSectionProps {
  settings: SiteSettings;
  featuredPlayer?: Player;
}

export default function HeroSection({ settings, featuredPlayer }: HeroSectionProps) {
  const hero = settings.hero;
  const player = featuredPlayer;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>MINECRAFT COMPETITIVE CLAN • TIER 1 DIVISION</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-2">
              <h1 className="text-6xl sm:text-7xl xl:text-8xl font-display font-black tracking-tight text-white leading-none">
                <span className="relative inline-block">
                  {hero.title || 'LOXXY'}
                  <span className="absolute -inset-1 blur-2xl opacity-40 bg-gradient-to-r from-brand-500 via-cyan-400 to-pink-500 -z-10" />
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-cyan-300 to-white">
                {hero.tagline || 'Built to Compete. Designed to Dominate.'}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {hero.description ||
                'Forged in high-tier PvP arenas. Loxxy is an elite competitive Minecraft organization dominating global tournaments across Sword, Crystal, Axe, and Mace gamemodes.'}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={hero.cta1Link || '/roster'}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-display font-bold text-sm tracking-wider uppercase shadow-glow-md hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2.5 group"
              >
                <Swords className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>{hero.cta1Text || 'View Roster'}</span>
                <ChevronRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={hero.cta2Link || '/achievements'}
                className="px-6 py-3.5 rounded-2xl bg-dark-850/90 hover:bg-dark-800 text-slate-200 hover:text-white font-display font-semibold text-sm tracking-wider uppercase border border-slate-700/80 hover:border-brand-500/50 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{hero.cta2Text || 'Our Achievements'}</span>
              </Link>

              {settings.discordPageEnabled && (
                <Link
                  href={hero.cta3Link || '/discord'}
                  className="px-6 py-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-display font-semibold text-sm tracking-wider uppercase border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>{hero.cta3Text || 'Join Discord'}</span>
                </Link>
              )}
            </div>

            {/* Quick Stats Ribbon */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-display font-black text-white">42+</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Trophies</div>
              </div>
              <div className="border-x border-slate-800 px-3">
                <div className="text-xl sm:text-2xl font-display font-black text-cyan-400">HT1</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Top Tier</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-display font-black text-rose-400">98%</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Win Rate</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Minecraft Rig Showcase Stage */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Ambient Platform Backing */}
            <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-dark-900/90 via-dark-850/80 to-dark-950/90 border border-slate-700/60 backdrop-blur-2xl shadow-2xl">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    HQ COMBAT RIG
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  3D INTERACTIVE
                </span>
              </div>

              {/* 3D Skin Viewer */}
              <div className="relative flex justify-center my-2">
                <MinecraftSkinViewer
                  skinUrl={player?.skinUrl || '/skins/professorx.png'}
                  width={280}
                  height={360}
                  initialAnimation="idle"
                  autoRotate={true}
                  enableControls={true}
                  glowColor="#8b5cf6"
                />
              </div>

              {/* Player Tag Floating Box */}
              {player && (
                <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-display font-black text-white flex items-center gap-2">
                      <span>{player.ign}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-950 border border-slate-700 text-slate-400 font-mono">
                        {player.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Main: <span className="text-cyan-300">{player.mainGamemode}</span>
                    </div>
                  </div>

                  <TierBadge
                    tierId={player.pvpTiers['Sword'] || 'HT1'}
                    size="sm"
                    gamemode="SWORD"
                    showGamemode={true}
                  />
                </div>
              )}

              {/* Interactive prompt hint */}
              <div className="mt-3 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Drag to rotate • Scroll to zoom
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
