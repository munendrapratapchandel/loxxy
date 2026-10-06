'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Player, TierDefinition, LoxxyDatabase } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import { calculatePowerIndex } from '@/lib/powerIndex';
import {
  Trophy,
  Medal,
  Crown,
  Swords,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Search,
  Save,
  RotateCcw,
  Sliders,
  Check,
  ExternalLink,
  Zap,
  Target,
  Flame,
  Star,
  Edit3,
  X,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface RankingsManagerProps {
  players: Player[];
  tiers: TierDefinition[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

const GAMEMODES = ['Mace', 'Netpot', 'Crystal', 'Spear Mace', 'UHC', 'Elytra Mace'] as const;
const SKILL_KEYS = ['PvP', 'Game Sense', 'Clutching', 'Building', 'Parkour', 'Redstone'] as const;

export default function RankingsManager({ players: initialPlayers, tiers, db, onRefresh }: RankingsManagerProps) {
  const [playersList, setPlayersList] = useState<Player[]>(() => {
    // Clone and ensure powerIndex exists
    return initialPlayers.map(p => ({
      ...p,
      powerIndex: p.powerIndex !== undefined && p.powerIndex > 0 ? p.powerIndex : calculatePowerIndex(p),
      pvpTiers: { ...(p.pvpTiers || {}) },
      skills: { ...(p.skills || {}) }
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('overall');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state if initialPlayers updates from parent
  React.useEffect(() => {
    setPlayersList(initialPlayers.map(p => ({
      ...p,
      powerIndex: p.powerIndex !== undefined && p.powerIndex > 0 ? p.powerIndex : calculatePowerIndex(p),
      pvpTiers: { ...(p.pvpTiers || {}) },
      skills: { ...(p.skills || {}) }
    })));
  }, [initialPlayers]);

  // Sorted list based on active filter
  const sortedPlayers = useMemo(() => {
    const list = [...playersList];
    return list.sort((a, b) => {
      if (filterMode === 'overall') {
        return (b.powerIndex || 0) - (a.powerIndex || 0);
      }
      if (SKILL_KEYS.includes(filterMode as any)) {
        return (b.skills[filterMode] || 0) - (a.skills[filterMode] || 0);
      }
      // Gamemode tier rank
      const tierScore = (p: Player, mode: string) => {
        const val = p.pvpTiers[mode] || '';
        if (val === 'HT1') return 100;
        if (val === 'HT2') return 90;
        if (val === 'HT3') return 80;
        if (val === 'HT4') return 75;
        if (val === 'HT5') return 70;
        if (val === 'LT1') return 60;
        if (val === 'LT2') return 50;
        if (val === 'LT3') return 40;
        if (val === 'LT4') return 30;
        if (val === 'LT5') return 20;
        return 0;
      };
      return tierScore(b, filterMode) - tierScore(a, filterMode);
    });
  }, [playersList, filterMode]);

  // Filtered by search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return sortedPlayers;
    const q = searchQuery.toLowerCase();
    return sortedPlayers.filter(p =>
      p.ign.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  }, [sortedPlayers, searchQuery]);

  // Overall top 3 for the podium preview
  const overallTop3 = useMemo(() => {
    return [...playersList]
      .sort((a, b) => (b.powerIndex || 0) - (a.powerIndex || 0))
      .slice(0, 3);
  }, [playersList]);

  // Quick Inline Power Index Change
  const handlePowerIndexChange = (playerId: string, newScore: number) => {
    const clamped = Math.max(0, Math.min(99.9, Math.round(newScore * 10) / 10));
    setPlayersList(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, powerIndex: clamped };
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Auto Recalculate Single Player
  const handleRecalculateSingle = (playerId: string) => {
    setPlayersList(prev => prev.map(p => {
      if (p.id === playerId) {
        const copy = { ...p, powerIndex: undefined };
        const calculated = calculatePowerIndex(copy);
        return { ...p, powerIndex: calculated };
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Reorder Rank: Move Up
  const handleMoveUp = (playerId: string) => {
    const sorted = [...playersList].sort((a, b) => (b.powerIndex || 0) - (a.powerIndex || 0));
    const index = sorted.findIndex(p => p.id === playerId);
    if (index <= 0) return; // Already at top

    const currentPlayer = sorted[index];
    const playerAbove = sorted[index - 1];

    // Swap / give currentPlayer a powerIndex slightly higher than playerAbove
    const newScore = Math.min(99.9, Math.round(((playerAbove.powerIndex || 95) + 0.3) * 10) / 10);

    setPlayersList(prev => prev.map(p => {
      if (p.id === currentPlayer.id) return { ...p, powerIndex: newScore };
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Reorder Rank: Move Down
  const handleMoveDown = (playerId: string) => {
    const sorted = [...playersList].sort((a, b) => (b.powerIndex || 0) - (a.powerIndex || 0));
    const index = sorted.findIndex(p => p.id === playerId);
    if (index === -1 || index >= sorted.length - 1) return; // Already at bottom

    const currentPlayer = sorted[index];
    const playerBelow = sorted[index + 1];

    // Give currentPlayer a powerIndex slightly below playerBelow
    const newScore = Math.max(50.0, Math.round(((playerBelow.powerIndex || 80) - 0.3) * 10) / 10);

    setPlayersList(prev => prev.map(p => {
      if (p.id === currentPlayer.id) return { ...p, powerIndex: newScore };
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Auto-Recalculate All Players based on skills & tiers formula
  const handleRecalculateAll = () => {
    if (!confirm('Recalculate Power Indexes for all athletes based on their combat stats and tier bonus formula?')) return;
    setPlayersList(prev => prev.map(p => {
      const copy = { ...p, powerIndex: undefined };
      return { ...p, powerIndex: calculatePowerIndex(copy) };
    }));
    setHasUnsavedChanges(true);
  };

  // Normalize sequential spacing (e.g., #1 gets 99.4, #2 gets 98.6, #3 gets 97.8...)
  const handleNormalizeSpacing = () => {
    if (!confirm('Normalize rankings to clean descending power index tiers (99.0 down to ~85.0)?')) return;
    const sorted = [...playersList].sort((a, b) => (b.powerIndex || 0) - (a.powerIndex || 0));
    const total = sorted.length;
    const step = total > 1 ? 14.0 / (total - 1) : 0;

    const updatedMap = new Map<string, number>();
    sorted.forEach((p, idx) => {
      const score = Math.round((99.2 - (idx * step)) * 10) / 10;
      updatedMap.set(p.id, score);
    });

    setPlayersList(prev => prev.map(p => ({
      ...p,
      powerIndex: updatedMap.get(p.id) ?? p.powerIndex
    })));
    setHasUnsavedChanges(true);
  };

  // Quick Gamemode Tier change
  const handleTierChange = (playerId: string, gamemode: string, tierId: string) => {
    setPlayersList(prev => prev.map(p => {
      if (p.id === playerId) {
        const nextTiers = { ...p.pvpTiers };
        if (tierId === 'None') {
          delete nextTiers[gamemode];
        } else {
          nextTiers[gamemode] = tierId;
        }
        return { ...p, pvpTiers: nextTiers };
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Save all rankings to cloud backend & Supabase
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Merge updated players into the complete database
      const updatedDb: LoxxyDatabase = {
        ...db,
        players: playersList,
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDb),
      });

      const json = await res.json();
      if (json.success) {
        setHasUnsavedChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        onRefresh();
      } else {
        alert(json.error || 'Failed to save rankings');
      }
    } catch (err: any) {
      alert('Network error saving rankings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Apply changes from calibration modal
  const handleSaveModal = (updated: Player) => {
    setPlayersList(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingPlayer(null);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Header & Cloud Sync Bar */}
      <div className="p-6 rounded-3xl bg-dark-900/90 border border-slate-800 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-600/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-widest">
            <Medal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Leaderboard Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Rankings & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">Power Index Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Control athlete leaderboard positions, calibrate competitive skill attributes, assign gamemode PvP division badges, and preview the live top-3 podium in real-time.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/rankings"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-2 transition-all"
          >
            <span>Live /rankings</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </Link>

          <button
            onClick={handleRecalculateAll}
            className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-2 transition-all"
            title="Recalculate all players based on the formula"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalculate All</span>
          </button>

          <button
            onClick={handleNormalizeSpacing}
            className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-2 transition-all"
            title="Evenly distribute Power Index from 99.2 to ~85"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Even Spacing</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-600 hover:to-cyan-600 text-white shadow-glow-cyan animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved & Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? 'Save Unsaved Changes' : 'Save & Sync Rankings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>You have unsaved ranking adjustments. Click <strong>"Save & Sync Rankings"</strong> above to push changes live to the website!</span>
          </div>
          <button
            onClick={handleSaveAll}
            className="px-3 py-1 bg-amber-500 text-dark-950 font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Live Top 3 Podium Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-display font-black text-white uppercase tracking-wider">
              Live Podium Preview (Top 3 Public Placement)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Current #1: <span className="text-amber-400 font-bold">{overallTop3[0]?.ign || 'None'}</span> ({overallTop3[0]?.powerIndex?.toFixed(1) || '0.0'})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
          {/* #2 Silver (Left) */}
          {overallTop3[1] && (
            <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-700/60 backdrop-blur-xl flex flex-col items-center text-center relative hover:border-slate-500 transition-all">
              <div className="w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-black font-display text-sm mb-3">
                #2
              </div>
              <img
                src={overallTop3[1].avatarUrl || `https://mc-heads.net/avatar/${overallTop3[1].ign}/80`}
                alt={overallTop3[1].ign}
                className="w-16 h-16 rounded-2xl pixelated border-2 border-slate-400 shadow-md mb-2"
              />
              <h4 className="text-lg font-display font-black text-white">{overallTop3[1].ign}</h4>
              <span className="text-xs font-mono text-slate-400">{overallTop3[1].role} • {overallTop3[1].region}</span>
              <div className="mt-3 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-400 font-mono font-bold text-sm">
                {overallTop3[1].powerIndex?.toFixed(1)} PI
              </div>
              <button
                onClick={() => setEditingPlayer(overallTop3[1])}
                className="mt-4 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-[11px] font-mono text-slate-300 hover:text-white border border-slate-750 flex items-center gap-1.5"
              >
                <Edit3 className="w-3 h-3 text-cyan-400" />
                <span>Calibrate #2</span>
              </button>
            </div>
          )}

          {/* #1 Gold (Center, Elevated) */}
          {overallTop3[0] && (
            <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/15 via-dark-900 to-dark-950 border-2 border-amber-400/60 backdrop-blur-xl flex flex-col items-center text-center relative shadow-glow-sm hover:border-amber-400 transition-all">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-dark-950 font-black font-display text-xs flex items-center gap-1 shadow-md uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>#1 Champion</span>
              </div>
              <img
                src={overallTop3[0].avatarUrl || `https://mc-heads.net/avatar/${overallTop3[0].ign}/96`}
                alt={overallTop3[0].ign}
                className="w-20 h-20 rounded-2xl pixelated border-2 border-amber-400 shadow-glow-amber mb-2 mt-2"
              />
              <h4 className="text-xl font-display font-black text-white">{overallTop3[0].ign}</h4>
              <span className="text-xs font-mono text-amber-300">{overallTop3[0].role} • {overallTop3[0].region}</span>
              <div className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-black text-base shadow-sm">
                {overallTop3[0].powerIndex?.toFixed(1)} PI
              </div>
              <button
                onClick={() => setEditingPlayer(overallTop3[0])}
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-[11px] font-mono text-amber-300 hover:text-amber-200 border border-amber-500/30 flex items-center gap-1.5"
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>Calibrate #1</span>
              </button>
            </div>
          )}

          {/* #3 Bronze (Right) */}
          {overallTop3[2] && (
            <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-700/60 backdrop-blur-xl flex flex-col items-center text-center relative hover:border-amber-700 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 border border-amber-600/40 flex items-center justify-center font-black font-display text-sm mb-3">
                #3
              </div>
              <img
                src={overallTop3[2].avatarUrl || `https://mc-heads.net/avatar/${overallTop3[2].ign}/80`}
                alt={overallTop3[2].ign}
                className="w-16 h-16 rounded-2xl pixelated border-2 border-amber-700 shadow-md mb-2"
              />
              <h4 className="text-lg font-display font-black text-white">{overallTop3[2].ign}</h4>
              <span className="text-xs font-mono text-slate-400">{overallTop3[2].role} • {overallTop3[2].region}</span>
              <div className="mt-3 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-brand-400 font-mono font-bold text-sm">
                {overallTop3[2].powerIndex?.toFixed(1)} PI
              </div>
              <button
                onClick={() => setEditingPlayer(overallTop3[2])}
                className="mt-4 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-[11px] font-mono text-slate-300 hover:text-white border border-slate-750 flex items-center gap-1.5"
              >
                <Edit3 className="w-3 h-3 text-brand-400" />
                <span>Calibrate #3</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter modes */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterMode('overall')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              filterMode === 'overall'
                ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-bold shadow-glow-sm'
                : 'bg-dark-850 text-slate-400 hover:text-white'
            }`}
          >
            Overall PI
          </button>
          {GAMEMODES.map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                filterMode === mode
                  ? 'bg-gradient-to-r from-rose-600 to-brand-500 text-white font-bold'
                  : 'bg-dark-850 text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
          {SKILL_KEYS.slice(0, 3).map(skill => (
            <button
              key={skill}
              onClick={() => setFilterMode(skill)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                filterMode === skill
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold'
                  : 'bg-dark-850 text-slate-400 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search athlete IGN or role..."
            className="w-full pl-9 pr-4 py-2 bg-dark-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Rankings Management Table */}
      <div className="rounded-3xl bg-dark-900/90 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-16">Rank</th>
                <th className="py-4 px-3 text-center w-20">Reorder</th>
                <th className="py-4 px-4">Athlete / IGN</th>
                <th className="py-4 px-4 text-center">Power Index</th>
                <th className="py-4 px-4">Gamemode Tiers (Quick Edit)</th>
                <th className="py-4 px-4">Key Mechanics</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No athletes found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, idx) => {
                  const rankNumber = idx + 1;
                  const isTop1 = rankNumber === 1 && filterMode === 'overall';
                  const isTop2 = rankNumber === 2 && filterMode === 'overall';
                  const isTop3 = rankNumber === 3 && filterMode === 'overall';

                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-slate-850/40 transition-colors ${
                        isTop1 ? 'bg-amber-500/5' : isTop2 ? 'bg-slate-400/5' : isTop3 ? 'bg-amber-700/5' : ''
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-4 px-4 text-center">
                        {isTop1 ? (
                          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-dark-950 font-black font-display text-sm flex items-center justify-center shadow-glow-amber">
                            #1
                          </div>
                        ) : isTop2 ? (
                          <div className="w-8 h-8 mx-auto rounded-full bg-slate-400/20 border border-slate-400 text-slate-200 font-black font-display text-sm flex items-center justify-center">
                            #2
                          </div>
                        ) : isTop3 ? (
                          <div className="w-8 h-8 mx-auto rounded-full bg-amber-700/20 border border-amber-600 text-amber-400 font-black font-display text-sm flex items-center justify-center">
                            #3
                          </div>
                        ) : (
                          <span className="font-display font-bold text-slate-400 text-sm">
                            #{rankNumber}
                          </span>
                        )}
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-4 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-dark-950 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={() => handleMoveUp(player.id)}
                            disabled={idx === 0}
                            title="Move rank up"
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(player.id)}
                            disabled={idx === filteredPlayers.length - 1}
                            title="Move rank down"
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Athlete Identity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatarUrl || `https://mc-heads.net/avatar/${player.ign}/64`}
                            alt={player.ign}
                            className="w-10 h-10 rounded-xl pixelated border border-slate-700 bg-dark-950 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/roster/${encodeURIComponent(player.ign)}`}
                                target="_blank"
                                className="font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1"
                              >
                                <span>{player.ign}</span>
                                <ArrowUpRight className="w-3 h-3 text-slate-500" />
                              </Link>
                              {player.featured && (
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="text-cyan-400">{player.role}</span>
                              <span>•</span>
                              <span>{player.region}</span>
                              <span>•</span>
                              <span className="text-slate-500">{player.mainGamemode}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Power Index Inline Edit */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="99.9"
                            value={player.powerIndex !== undefined ? player.powerIndex : 90.0}
                            onChange={(e) => handlePowerIndexChange(player.id, parseFloat(e.target.value) || 0)}
                            className="w-14 bg-transparent text-center font-bold font-mono text-cyan-300 focus:outline-none focus:text-white"
                          />
                          <span className="text-slate-500 text-[10px]">PI</span>
                          <button
                            onClick={() => handleRecalculateSingle(player.id)}
                            title="Auto-recalculate from skills and tiers"
                            className="p-1 text-slate-500 hover:text-amber-400 rounded transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Gamemode Tiers Grid / Inline Select */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {GAMEMODES.map(mode => {
                            const currentTier = player.pvpTiers[mode] || '';
                            return (
                              <div key={mode} className="flex items-center gap-1 bg-dark-950 border border-slate-800/80 rounded-lg px-2 py-0.5 text-[10px]">
                                <span className="text-slate-400">{mode.slice(0, 3)}:</span>
                                <select
                                  value={currentTier || 'None'}
                                  onChange={(e) => handleTierChange(player.id, mode, e.target.value)}
                                  className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                                >
                                  <option value="None" className="bg-dark-900 text-slate-400">-</option>
                                  {tiers.map(t => (
                                    <option key={t.id} value={t.id} className="bg-dark-900 text-white">
                                      {t.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Key Mechanics */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">PvP:</span>
                            <span className="text-rose-400 font-bold">{player.skills['PvP'] || 90}%</span>
                          </div>
                          <div className="w-full bg-dark-950 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-rose-500 to-brand-500 h-full rounded-full"
                              style={{ width: `${player.skills['PvP'] || 90}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] pt-0.5">
                            <span className="text-slate-400">Sense:</span>
                            <span className="text-cyan-400 font-bold">{player.skills['Game Sense'] || 85}%</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingPlayer(player)}
                            className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-slate-750 flex items-center gap-1.5 transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Calibrate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Calibration Modal */}
      {editingPlayer && (
        <PlayerCalibrationModal
          player={editingPlayer}
          tiers={tiers}
          onClose={() => setEditingPlayer(null)}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
}

// Modal for fine-grained ranking attribute calibration
function PlayerCalibrationModal({
  player,
  tiers,
  onClose,
  onSave,
}: {
  player: Player;
  tiers: TierDefinition[];
  onClose: () => void;
  onSave: (p: Player) => void;
}) {
  const [formData, setFormData] = useState<Player>({
    ...player,
    skills: { ...(player.skills || {}) },
    pvpTiers: { ...(player.pvpTiers || {}) },
  });

  const [autoCompute, setAutoCompute] = useState(false);

  // Auto calculate preview
  const previewPowerIndex = useMemo(() => {
    if (!autoCompute && formData.powerIndex !== undefined) {
      return formData.powerIndex;
    }
    const copy = { ...formData, powerIndex: undefined };
    return calculatePowerIndex(copy);
  }, [formData, autoCompute]);

  const handleSkillChange = (skill: string, val: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: Math.max(0, Math.min(100, val)),
      },
      ...(autoCompute ? { powerIndex: undefined } : {}),
    }));
  };

  const handleTierChange = (gamemode: string, tier: string) => {
    setFormData(prev => {
      const nextTiers = { ...prev.pvpTiers };
      if (tier === 'None') delete nextTiers[gamemode];
      else nextTiers[gamemode] = tier;
      return {
        ...prev,
        pvpTiers: nextTiers,
        ...(autoCompute ? { powerIndex: undefined } : {}),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      powerIndex: autoCompute ? previewPowerIndex : formData.powerIndex,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-3">
            <img
              src={formData.avatarUrl || `https://mc-heads.net/avatar/${formData.ign}/64`}
              alt={formData.ign}
              className="w-12 h-12 rounded-xl pixelated border border-slate-700 bg-dark-950"
            />
            <div>
              <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                <span>{formData.ign}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {formData.role}
                </span>
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Calibrate competitive skills, Power Index, and Gamemode Tiers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* Power Index Card */}
          <div className="p-5 rounded-2xl bg-dark-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Loxxy Power Index</span>
              <div className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">
                {previewPowerIndex.toFixed(1)} / 99.9
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {autoCompute ? 'Auto-calculated from combat stats & tier bonus' : 'Custom manual Power Index assigned'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoCompute(true);
                  const copy = { ...formData, powerIndex: undefined };
                  setFormData(prev => ({ ...prev, powerIndex: calculatePowerIndex(copy) }));
                }}
                className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  autoCompute
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-dark-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto Formula</span>
              </button>

              <div className="flex items-center gap-1 bg-dark-900 border border-slate-700 rounded-xl px-3 py-1.5">
                <span className="text-slate-400">Score:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="99.9"
                  value={formData.powerIndex ?? 90.0}
                  onChange={(e) => {
                    setAutoCompute(false);
                    setFormData(prev => ({ ...prev, powerIndex: parseFloat(e.target.value) || 0 }));
                  }}
                  className="w-16 bg-transparent text-right font-bold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gamemode PvP Tiers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Competitive Gamemode Tiers</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GAMEMODES.map(mode => {
                const current = formData.pvpTiers[mode] || '';
                return (
                  <div key={mode} className="p-3 rounded-xl bg-dark-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] text-slate-300 font-bold">{mode}</span>
                    <select
                      value={current || 'None'}
                      onChange={(e) => handleTierChange(mode, e.target.value)}
                      className="w-full bg-dark-900 border border-slate-700 rounded-lg p-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 text-xs"
                    >
                      <option value="None" className="text-slate-400">Unranked / None</option>
                      {tiers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.id} - {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Skill Bars */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Mechanics & Skill Attributes (0 - 100%)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKILL_KEYS.map(skill => {
                const val = formData.skills[skill] || 85;
                return (
                  <div key={skill} className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-bold">{skill}</span>
                      <span className="text-cyan-400 font-mono font-bold text-sm">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={val}
                      onChange={(e) => handleSkillChange(skill, parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-glow-cyan"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
