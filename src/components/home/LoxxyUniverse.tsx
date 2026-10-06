'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@/lib/types';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import PlayerPowerCard from '@/components/player/PlayerPowerCard';
import TierBadge from '@/components/tier/TierBadge';
import { Swords, Crown, Sparkles, Orbit, Compass, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface LoxxyUniverseProps {
  players: Player[];
}

export default function LoxxyUniverse({ players }: LoxxyUniverseProps) {
  const featured = players.slice(0, 4);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(featured[0] || players[0]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 15, y: y * 15 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-28 bg-dark-950 overflow-hidden border-t border-slate-900"
    >
      {/* Dynamic 3D depth background nebula */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`
        }}
      >
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>Interactive 3D Team Arena</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white">
            THE LOXXY <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">UNIVERSE</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enter the competitive inner circle. Interact with 3D combat skins orbiting the central Loxxy core, preview individual Power Cards, and inspect verified combat tiers in real time.
          </p>
        </div>

        {/* Orbit Grid Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 3D Squad Constellation Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800 backdrop-blur-md flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Select Athlete to Spotlight:
              </span>
              <span className="text-cyan-400">360° Real-Time Rigs</span>
            </div>

            {/* Squad Grid Rigs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featured.map((p) => {
                const isSelected = selectedPlayer.id === p.id;
                const topTier = Object.values(p.pvpTiers)[0] || 'HT1';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-brand-900/50 to-dark-900 border-cyan-400 shadow-glow-cyan/40 scale-105'
                        : 'bg-dark-900/70 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
                    }`}
                  >
                    {/* Top Tier Tag */}
                    <div className="w-full flex items-center justify-between mb-1">
                      <TierBadge tierId={topTier} size="sm" />
                      <span className="text-[10px] font-mono text-slate-500">
                        {p.powerIndex || 95}
                      </span>
                    </div>

                    {/* Miniature 3D Skin Rig */}
                    <div className="py-1">
                      <MinecraftSkinViewer
                        skinUrl={p.skinUrl}
                        width={110}
                        height={140}
                        initialAnimation="idle"
                        autoRotate={true}
                        enableControls={false}
                        showPedestal={false}
                      />
                    </div>

                    {/* Athlete Name */}
                    <div className="w-full text-center mt-1 pt-2 border-t border-slate-800/80">
                      <div className={`text-xs font-display font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {p.ign}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {p.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Loxxy Core Insignia Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/60 via-dark-900 to-cyan-950/60 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 p-[1.5px] shrink-0">
                  <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                    <Swords className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold text-white">Loxxy High-Tier Core</h4>
                  <p className="text-xs text-slate-400">
                    Calculated Power Index & automated 3D model synchronization
                  </p>
                </div>
              </div>

              <Link
                href="/rankings"
                className="shrink-0 px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Rankings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Competitive Power Card Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm">
              <PlayerPowerCard player={selectedPlayer} enable3d={true} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
