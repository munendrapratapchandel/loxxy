'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Player } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import { calculatePowerIndex } from '@/lib/powerIndex';
import { Crown, Medal, Trophy, ChevronRight, Swords, Sparkles, ArrowRight, User } from 'lucide-react';

interface RankingsViewProps {
  players: Player[];
}

export default function RankingsView({ players }: RankingsViewProps) {
  const [filterMode, setFilterMode] = useState<string>('overall');

  // Sorted list based on active filter
  const sorted = useMemo(() => {
    return [...players].sort((a, b) => {
      if (filterMode === 'overall') {
        const pA = a.powerIndex || calculatePowerIndex(a);
        const pB = b.powerIndex || calculatePowerIndex(b);
        return pB - pA;
      }
      if (filterMode === 'pvp') {
        return (b.skills['PvP'] || 0) - (a.skills['PvP'] || 0);
      }
      if (filterMode === 'building') {
        return (b.skills['Building'] || 0) - (a.skills['Building'] || 0);
      }
      if (filterMode === 'redstone') {
        return (b.skills['Redstone'] || 0) - (a.skills['Redstone'] || 0);
      }
      if (filterMode === 'clutching') {
        return (b.skills['Clutching'] || 0) - (a.skills['Clutching'] || 0);
      }
      // Gamemode tier rank
      const tierScore = (p: Player, mode: string) => {
        const val = p.pvpTiers[mode] || '';
        if (val === 'HT1') return 100;
        if (val === 'HT2') return 90;
        if (val === 'HT3') return 80;
        if (val === 'LT1') return 70;
        if (val === 'LT2') return 60;
        return 50;
      };
      return tierScore(b, filterMode) - tierScore(a, filterMode);
    });
  }, [players, filterMode]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const filters = [
    { id: 'overall', label: 'Overall Power Index' },
    { id: 'pvp', label: 'PvP Combat' },
    { id: 'Mace', label: 'Mace' },
    { id: 'Netpot', label: 'Netpot' },
    { id: 'Crystal', label: 'Crystal' },
    { id: 'Spear Mace', label: 'Spear Mace' },
    { id: 'UHC', label: 'UHC' },
    { id: 'Elytra Mace', label: 'Elytra Mace' },
    { id: 'building', label: 'Building Mastery' },
    { id: 'redstone', label: 'Redstone Circuitry' },
    { id: 'clutching', label: 'Clutching' },
  ];

  return (
    <div className="space-y-12">
      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl flex flex-wrap gap-2 justify-center">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterMode(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              filterMode === f.id
                ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-bold shadow-glow-sm'
                : 'bg-dark-850 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
        {/* #2 Silver (Placed on left) */}
        {top3[1] && (
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-gradient-to-b from-slate-800/30 via-dark-900 to-dark-950 border border-slate-700/60 backdrop-blur-xl flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-black font-display text-sm mb-3">
              #2
            </div>
            <div className="py-2">
              <MinecraftSkinViewer
                skinUrl={top3[1].skinUrl}
                width={150}
                height={200}
                initialAnimation="idle"
                autoRotate={true}
                enableControls={false}
                showPedestal={false}
              />
            </div>
            <h3 className="text-xl font-display font-black text-white mt-2">{top3[1].ign}</h3>
            <span className="text-xs font-mono text-slate-400">{top3[1].role}</span>
            <div className="mt-3 flex items-center gap-2">
              <TierBadge tierId={Object.values(top3[1].pvpTiers)[0] || 'HT1'} size="sm" />
              <span className="text-sm font-mono font-bold text-cyan-300">
                {(top3[1].powerIndex || calculatePowerIndex(top3[1])).toFixed(1)} LPI
              </span>
            </div>
            <Link
              href={`/roster/${encodeURIComponent(top3[1].ign)}`}
              className="mt-4 text-xs font-mono uppercase text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Profile</span> <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* #1 Gold Apex (Center, taller) */}
        {top3[0] && (
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-dark-900 to-dark-950 border-2 border-amber-500/80 shadow-[0_0_35px_rgba(251,191,36,0.25)] backdrop-blur-2xl flex flex-col items-center text-center relative -translate-y-2 hover:-translate-y-4 transition-transform">
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-amber-500 text-dark-950 font-display font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3.5 h-3.5" />
              <span>APEX CHAMPION #1</span>
            </div>
            <div className="py-2 mt-2">
              <MinecraftSkinViewer
                skinUrl={top3[0].skinUrl}
                width={180}
                height={230}
                initialAnimation="idle"
                autoRotate={true}
                enableControls={false}
                glowColor="#fbbf24"
              />
            </div>
            <h3 className="text-2xl font-display font-black text-white mt-2">{top3[0].ign}</h3>
            <span className="text-xs font-mono text-amber-300">{top3[0].role}</span>
            <div className="mt-3 flex items-center gap-2">
              <TierBadge tierId={Object.values(top3[0].pvpTiers)[0] || 'HT1'} size="md" />
              <span className="text-lg font-mono font-black text-amber-400">
                {(top3[0].powerIndex || calculatePowerIndex(top3[0])).toFixed(1)} LPI
              </span>
            </div>
            <Link
              href={`/roster/${encodeURIComponent(top3[0].ign)}`}
              className="mt-4 px-4 py-1.5 rounded-xl bg-amber-500 text-dark-950 font-mono text-xs uppercase font-bold flex items-center gap-1 hover:bg-amber-400"
            >
              <span>View Dossier</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* #3 Bronze (Placed on right) */}
        {top3[2] && (
          <div className="order-3 p-6 rounded-3xl bg-gradient-to-b from-orange-950/20 via-dark-900 to-dark-950 border border-orange-500/40 backdrop-blur-xl flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center font-black font-display text-sm mb-3">
              #3
            </div>
            <div className="py-2">
              <MinecraftSkinViewer
                skinUrl={top3[2].skinUrl}
                width={150}
                height={200}
                initialAnimation="idle"
                autoRotate={true}
                enableControls={false}
                showPedestal={false}
              />
            </div>
            <h3 className="text-xl font-display font-black text-white mt-2">{top3[2].ign}</h3>
            <span className="text-xs font-mono text-slate-400">{top3[2].role}</span>
            <div className="mt-3 flex items-center gap-2">
              <TierBadge tierId={Object.values(top3[2].pvpTiers)[0] || 'HT1'} size="sm" />
              <span className="text-sm font-mono font-bold text-cyan-300">
                {(top3[2].powerIndex || calculatePowerIndex(top3[2])).toFixed(1)} LPI
              </span>
            </div>
            <Link
              href={`/roster/${encodeURIComponent(top3[2].ign)}`}
              className="mt-4 text-xs font-mono uppercase text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Profile</span> <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-display font-black text-white">Full Squad Hierarchy</h3>
            <p className="text-xs text-slate-400">Complete performance rankings across the active roster</p>
          </div>
          <Link
            href="/compare"
            className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-mono uppercase font-bold flex items-center gap-1.5"
          >
            <span>Compare Athletes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 text-center w-14">Rank</th>
                <th className="pb-3">Athlete</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Pinnacle Tier</th>
                <th className="pb-3">PvP Skill</th>
                <th className="pb-3 text-right">Loxxy Power Index</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.map((p, idx) => {
                const rank = idx + 1;
                const pi = (p.powerIndex || calculatePowerIndex(p)).toFixed(1);
                const topT = Object.values(p.pvpTiers)[0] || 'HT1';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 text-center font-black text-white text-sm">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl || `https://mc-heads.net/avatar/${p.ign}/32`}
                          alt={p.ign}
                          className="w-8 h-8 rounded-lg bg-dark-950 p-0.5 border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white font-sans text-sm">{p.ign}</div>
                          <div className="text-[10px] text-slate-500">{p.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">{p.role}</td>
                    <td className="py-4">
                      <TierBadge tierId={topT} size="sm" />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">{p.skills['PvP'] || 90}%</span>
                        <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${p.skills['PvP'] || 90}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-black text-base text-cyan-300">
                      {pi}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/roster/${encodeURIComponent(p.ign)}`}
                        className="p-2 rounded-lg bg-dark-850 hover:bg-brand-600 text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
