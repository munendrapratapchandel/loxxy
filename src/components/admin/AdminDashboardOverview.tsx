'use client';

import React from 'react';
import { LoxxyDatabase } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import { Users, Trophy, MessageSquare, Shield, ExternalLink, Plus, Sparkles, Activity, Medal } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardOverviewProps {
  db: LoxxyDatabase;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboardOverview({ db, setActiveTab }: AdminDashboardOverviewProps) {
  const { players, achievements, dominanceStats, recruitmentApplications, settings } = db;
  const pendingApps = (recruitmentApplications || []).filter((a) => a.status === 'Pending').length;
  const topPlayer = [...players].sort((a, b) => (b.powerIndex || 0) - (a.powerIndex || 0))[0];

  return (
    <div className="space-y-8">
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div
          onClick={() => setActiveTab('players')}
          className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-cyan-400">
              MANAGE →
            </span>
          </div>
          <div className="text-3xl font-display font-black text-white">{players.length}</div>
          <div className="text-xs font-mono uppercase text-slate-400 mt-1">Roster Athletes</div>
        </div>

        <div
          onClick={() => setActiveTab('rankings')}
          className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Medal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-cyan-400">
              CALIBRATE →
            </span>
          </div>
          <div className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 truncate">
            {topPlayer?.ign || 'Rankings'}
          </div>
          <div className="text-xs font-mono uppercase text-slate-400 mt-1">Leaderboard & PI</div>
        </div>

        <div
          onClick={() => setActiveTab('achievements')}
          className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-amber-400">
              MANAGE →
            </span>
          </div>
          <div className="text-3xl font-display font-black text-white">{achievements.length}</div>
          <div className="text-xs font-mono uppercase text-slate-400 mt-1">Tournament Trophies</div>
        </div>

        <div
          onClick={() => setActiveTab('discord')}
          className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-cyan-400">
              REVIEW →
            </span>
          </div>
          <div className="text-3xl font-display font-black text-white">{pendingApps}</div>
          <div className="text-xs font-mono uppercase text-slate-400 mt-1">Pending Tryouts</div>
        </div>

        <div
          onClick={() => setActiveTab('tiers')}
          className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-rose-400">
              MANAGE →
            </span>
          </div>
          <div className="text-3xl font-display font-black text-white">{db.tiers.length}</div>
          <div className="text-xs font-mono uppercase text-slate-400 mt-1">Active PvP Tiers</div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/40 via-dark-900 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="text-sm font-display font-bold text-white flex items-center gap-2">
              <span>Loxxy Real-Time Database Engine Active</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE PERSISTENCE
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Any changes made here in the Admin Command Center immediately reflect on the public website.
            </div>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Athlete Roster Snapshot */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-display font-bold text-white">Featured Athlete Roster Snapshot</h3>
          <button
            onClick={() => setActiveTab('players')}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Manage All Athletes →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.avatarUrl || `https://mc-heads.net/avatar/${p.ign}/40`}
                  alt={p.ign}
                  className="w-10 h-10 rounded-lg bg-dark-950 p-1 border border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-white">{p.ign}</div>
                  <div className="text-xs text-slate-400 font-mono">{p.role}</div>
                </div>
              </div>
              <TierBadge
                tierId={Object.values(p.pvpTiers)[0] || 'HT1'}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
