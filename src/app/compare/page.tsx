'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import TierBadge from '@/components/tier/TierBadge';
import { Player, SiteSettings } from '@/lib/types';
import { Swords, ArrowLeftRight, Trophy, Zap, Shield, Crown } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [playerAId, setPlayerAId] = useState<string>('');
  const [playerBId, setPlayerBId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/data?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPlayers(data.data.players || []);
          setSettings(data.data.settings);
          if (data.data.players.length >= 2) {
            setPlayerAId(data.data.players[0].id);
            setPlayerBId(data.data.players[1].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const playerA = players.find((p) => p.id === playerAId) || players[0];
  const playerB = players.find((p) => p.id === playerBId) || players[1] || players[0];

  const allGamemodes = ['Mace', 'Netpot', 'Crystal', 'Spear Mace', 'UHC', 'Elytra Mace'];
  const allSkills = ['PvP', 'Building', 'Redstone', 'Clutching', 'Game Sense', 'Parkour'];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings || undefined} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Head-to-Head Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            COMPARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">ATHLETES</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Side-by-side combat tier matrix, mechanics percentage differentials, and Power Index comparison.
          </p>
        </div>

        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Athlete A:</span>
            <select
              value={playerAId}
              onChange={(e) => setPlayerAId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 text-white font-display font-bold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ign} ({p.role}) - {p.mainGamemode}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Athlete B:</span>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 text-white font-display font-bold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ign} ({p.role}) - {p.mainGamemode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {playerA && playerB && (
          <div className="space-y-12">
            
            {/* 3D Rigs Head-to-Head Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Player A Stage */}
              <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-800 flex flex-col items-center text-center relative">
                <div className="py-2">
                  <MinecraftSkinViewer
                    skinUrl={playerA.skinUrl}
                    width={180}
                    height={240}
                    initialAnimation="idle"
                    autoRotate={true}
                    enableControls={false}
                    glowColor="#8b5cf6"
                  />
                </div>
                <h3 className="text-2xl font-display font-black text-white mt-2">{playerA.ign}</h3>
                <span className="text-xs font-mono text-cyan-300">{playerA.role} • {playerA.region}</span>
                <div className="mt-3 text-lg font-mono font-black text-brand-400">
                  {playerA.powerIndex?.toFixed(1) || 95.0} Power Index
                </div>
              </div>

              {/* Player B Stage */}
              <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-800 flex flex-col items-center text-center relative">
                <div className="py-2">
                  <MinecraftSkinViewer
                    skinUrl={playerB.skinUrl}
                    width={180}
                    height={240}
                    initialAnimation="idle"
                    autoRotate={true}
                    enableControls={false}
                    glowColor="#00f5ff"
                  />
                </div>
                <h3 className="text-2xl font-display font-black text-white mt-2">{playerB.ign}</h3>
                <span className="text-xs font-mono text-cyan-300">{playerB.role} • {playerB.region}</span>
                <div className="mt-3 text-lg font-mono font-black text-cyan-400">
                  {playerB.powerIndex?.toFixed(1) || 95.0} Power Index
                </div>
              </div>
            </div>

            {/* Gamemode PvP Tiers Comparison Matrix */}
            <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-rose-400" />
                <span>Gamemode Tier Matchups</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase">
                      <th className="pb-3 text-left">{playerA.ign}</th>
                      <th className="pb-3 text-center">Gamemode</th>
                      <th className="pb-3 text-right">{playerB.ign}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {allGamemodes.map((mode) => {
                      const tierA = playerA.pvpTiers[mode] || 'Unranked';
                      const tierB = playerB.pvpTiers[mode] || 'Unranked';

                      return (
                        <tr key={mode} className="hover:bg-slate-800/20">
                          <td className="py-3 text-left">
                            <TierBadge tierId={tierA} size="sm" />
                          </td>
                          <td className="py-3 text-center text-slate-300 font-bold font-sans">
                            {mode}
                          </td>
                          <td className="py-3 text-right">
                            <TierBadge tierId={tierB} size="sm" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mechanics Skill Bars Comparison */}
            <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800 backdrop-blur-xl space-y-6">
              <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Mechanics Skill Differential</span>
              </h3>

              <div className="space-y-5">
                {allSkills.map((skill) => {
                  const valA = playerA.skills[skill] || 80;
                  const valB = playerB.skills[skill] || 80;

                  return (
                    <div key={skill} className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="font-bold text-brand-300">{playerA.ign}: {valA}%</span>
                        <span className="font-sans font-bold text-white uppercase tracking-wider">{skill}</span>
                        <span className="font-bold text-cyan-300">{playerB.ign}: {valB}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 h-2.5">
                        {/* Player A bar (right-aligned) */}
                        <div className="bg-dark-950 rounded-l-full overflow-hidden flex justify-end">
                          <div
                            className="bg-brand-500 h-full rounded-l-full"
                            style={{ width: `${valA}%` }}
                          />
                        </div>
                        {/* Player B bar (left-aligned) */}
                        <div className="bg-dark-950 rounded-r-full overflow-hidden flex justify-start">
                          <div
                            className="bg-cyan-500 h-full rounded-r-full"
                            style={{ width: `${valB}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
