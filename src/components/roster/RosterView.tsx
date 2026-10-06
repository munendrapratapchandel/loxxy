'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Player, GamemodeDefinition, TierDefinition } from '@/lib/types';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import TierBadge from '@/components/tier/TierBadge';
import { Search, Filter, Shield, Swords, Sparkles, ChevronRight, User, ArrowUpDown } from 'lucide-react';

interface RosterViewProps {
  players: Player[];
  gamemodes: GamemodeDefinition[];
  tiers: TierDefinition[];
}

export default function RosterView({ players, gamemodes, tiers }: RosterViewProps) {
  const [selectedGamemode, setSelectedGamemode] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'tier' | 'pvp' | 'date'>('tier');
  const [show3dPreview, setShow3dPreview] = useState<boolean>(true);

  // Filter and sort logic
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Search filter
      const matchesSearch =
        player.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.mainGamemode.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Gamemode filter
      if (selectedGamemode !== 'all') {
        const hasGamemodeTier = Object.keys(player.pvpTiers).some(
          (mode) => mode.toLowerCase().includes(selectedGamemode.toLowerCase())
        );
        const isMainGamemode = player.mainGamemode.toLowerCase().includes(selectedGamemode.toLowerCase());
        if (!hasGamemodeTier && !isMainGamemode) return false;
      }

      // Tier filter
      if (selectedTier !== 'all') {
        const hasTier = Object.values(player.pvpTiers).some(
          (t) => t.toUpperCase() === selectedTier.toUpperCase()
        );
        if (!hasTier) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'pvp') {
        return (b.skills['PvP'] || 0) - (a.skills['PvP'] || 0);
      }
      if (sortBy === 'date') {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      }
      // Default: sort by top tier priority
      const tierRank = (p: Player) => {
        const values = Object.values(p.pvpTiers);
        if (values.includes('HT1')) return 10;
        if (values.includes('HT2')) return 9;
        if (values.includes('HT3')) return 8;
        if (values.includes('HT4')) return 7;
        if (values.includes('HT5')) return 6;
        if (values.includes('LT1')) return 5;
        if (values.includes('LT2')) return 4;
        return 1;
      };
      return tierRank(b) - tierRank(a);
    });
  }, [players, selectedGamemode, selectedTier, searchQuery, sortBy]);

  const gamemodeFilters = [
    { id: 'all', label: 'All Modes' },
    { id: 'sword', label: 'Sword' },
    { id: 'axe', label: 'Axe' },
    { id: 'crystal', label: 'Crystal' },
    { id: 'mace', label: 'Mace' },
    { id: 'uhc', label: 'UHC' },
    { id: 'bedwars', label: 'Bedwars' },
    { id: 'building', label: 'Building' },
    { id: 'redstone', label: 'Redstone' },
  ];

  const tierFilters = ['all', 'HT1', 'HT2', 'HT3', 'LT1', 'LT2'];

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Filters */}
      <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
        
        {/* Top Search + Sort Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IGN, name, role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400/80 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-dark-850 px-3 py-2 rounded-xl border border-slate-700/80 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="tier" className="bg-dark-900 text-white">Top Tier Priority</option>
                <option value="pvp" className="bg-dark-900 text-white">PvP Mastery %</option>
                <option value="date" className="bg-dark-900 text-white">Join Date</option>
              </select>
            </div>

            {/* 3D Model Toggle */}
            <button
              onClick={() => setShow3dPreview(!show3dPreview)}
              className={`px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                show3dPreview
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-glow-sm'
                  : 'bg-dark-850 text-slate-400 border-slate-700/80'
              }`}
            >
              {show3dPreview ? '3D Models: ON' : '3D Models: OFF'}
            </button>
          </div>
        </div>

        {/* Gamemode Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            Gamemode Focus:
          </div>
          <div className="flex flex-wrap gap-2">
            {gamemodeFilters.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedGamemode(mode.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                  selectedGamemode === mode.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan/20 font-bold'
                    : 'bg-dark-850 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Badges Filter */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            PvP Tier Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {tierFilters.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${
                  selectedTier === tier
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-glow-ruby/20'
                    : 'bg-dark-850 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {tier === 'all' ? 'ALL TIERS' : tier}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
        <span>Showing {filteredPlayers.length} verified athlete{filteredPlayers.length !== 1 ? 's' : ''}</span>
        {selectedGamemode !== 'all' || selectedTier !== 'all' || searchQuery ? (
          <button
            onClick={() => {
              setSelectedGamemode('all');
              setSelectedTier('all');
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:underline"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* Players Cards Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-20 bg-dark-900/40 rounded-3xl border border-slate-800">
          <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No players found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your gamemode or tier filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => {
            const pvpSkill = player.skills['PvP'] || 90;
            const buildSkill = player.skills['Building'] || 75;
            const topTier = Object.values(player.pvpTiers)[0] || 'HT1';

            return (
              <div
                key={player.id}
                className="group relative rounded-3xl bg-dark-900/70 border border-slate-800/80 hover:border-brand-500/60 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-md flex flex-col justify-between"
              >
                {/* Card Top: Role & Status */}
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                      {player.role}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {player.region}
                  </span>
                </div>

                {/* 3D Skin Viewer or 2D Avatar Stage */}
                <div className="relative py-2 flex justify-center items-center overflow-hidden min-h-[220px]">
                  {show3dPreview ? (
                    <MinecraftSkinViewer
                      skinUrl={player.skinUrl}
                      width={190}
                      height={240}
                      initialAnimation="idle"
                      autoRotate={true}
                      enableControls={false}
                      glowColor={topTier.startsWith('HT1') ? '#f43f5e' : '#8b5cf6'}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-dark-950 border border-slate-800 p-2 flex items-center justify-center">
                      <img
                        src={`https://mc-heads.net/body/${player.ign}/160`}
                        alt={player.ign}
                        className="h-full object-contain"
                        onError={(e) => {
                          // Fallback
                          (e.target as any).src = player.avatarUrl || '/skins/steve.png';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Player details */}
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-2xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                        {player.ign}
                      </h3>
                      {player.name !== player.ign && (
                        <p className="text-xs text-slate-400 font-mono">{player.name}</p>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {player.mainGamemode}
                    </span>
                  </div>

                  {/* Active Tiers Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {Object.entries(player.pvpTiers).slice(0, 4).map(([mode, tier]) => (
                      <TierBadge key={mode} tierId={tier} size="sm" gamemode={mode} showGamemode={true} />
                    ))}
                    {Object.keys(player.pvpTiers).length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500 self-center px-1">
                        +{Object.keys(player.pvpTiers).length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Skills Mini-Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>PvP Mastery</span>
                        <span className="text-rose-400 font-bold">{pvpSkill}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pvpSkill}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Building</span>
                        <span className="text-cyan-400 font-bold">{buildSkill}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${buildSkill}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* View Full Profile CTA */}
                  <Link
                    href={`/roster/${player.id}`}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-800 hover:bg-brand-600 text-xs uppercase tracking-wider font-bold text-slate-200 hover:text-white border border-slate-700/80 hover:border-transparent transition-all shadow-sm"
                  >
                    <span>View Athlete Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
