'use client';

import React, { useState } from 'react';
import { Achievement, TimelineMilestone } from '@/lib/types';
import { Trophy, Medal, Crown, Calendar, Sparkles, Award, Users, ChevronRight, X } from 'lucide-react';

interface AchievementsInteractiveViewProps {
  achievements: Achievement[];
  milestones: TimelineMilestone[];
}

export default function AchievementsInteractiveView({
  achievements,
  milestones,
}: AchievementsInteractiveViewProps) {
  const [activeTab, setActiveTab] = useState<'trophies' | 'timeline' | 'table'>('trophies');
  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);

  return (
    <div className="space-y-10">
      {/* View Switcher */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-full bg-dark-900 border border-slate-800 backdrop-blur-xl flex gap-1">
          <button
            onClick={() => setActiveTab('trophies')}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'trophies'
                ? 'bg-amber-500 text-dark-950 font-black shadow-glow-gold/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 3D Trophy Room
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'timeline'
                ? 'bg-brand-600 text-white font-black shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏳ Chronological Timeline
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'table'
                ? 'bg-cyan-500 text-dark-950 font-black shadow-glow-cyan/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Standings Table
          </button>
        </div>
      </div>

      {/* 1. 3D Trophy Room View */}
      {activeTab === 'trophies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => setSelectedAch(ach)}
              className="group cursor-pointer rounded-3xl bg-dark-900/80 border border-slate-800 hover:border-amber-500/60 overflow-hidden backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(251,191,36,0.25)] flex flex-col justify-between"
            >
              <div className="relative h-60 bg-dark-950 overflow-hidden">
                <img
                  src={ach.imageUrl}
                  alt={ach.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-dark-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    {ach.result}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-dark-950/80 border border-slate-700 text-slate-300 text-[10px] font-mono uppercase">
                    {ach.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{ach.date}</span>
                </div>
                <h3 className="text-xl font-display font-black text-white group-hover:text-amber-300 transition-colors">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {ach.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex gap-1">
                    {ach.linkedPlayers.map((p) => (
                      <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-850 text-cyan-300 border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Chronological Story Timeline View */}
      {activeTab === 'timeline' && (
        <div className="max-w-3xl mx-auto py-8">
          <div className="relative border-l-2 border-brand-500/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
            {milestones.map((m) => (
              <div key={m.id} className="relative group">
                {/* Glowing node orb */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-dark-950 border-2 border-cyan-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-glow-cyan">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>

                <div className="p-6 rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-brand-500/50 backdrop-blur-xl transition-all">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">{m.date}</span>
                    <span className="px-2 py-0.5 rounded bg-dark-850 border border-slate-700 text-slate-400 text-[10px]">
                      {m.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Standings Table View */}
      {activeTab === 'table' && (
        <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800 backdrop-blur-xl overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="pb-3">Championship Event</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {achievements.map((ach) => (
                <tr key={ach.id} className="hover:bg-slate-800/20">
                  <td className="py-4 font-sans font-bold text-white text-sm">{ach.title}</td>
                  <td className="py-4 text-slate-400">{ach.category}</td>
                  <td className="py-4 text-slate-400">{ach.date}</td>
                  <td className="py-4 text-right">
                    <span className="px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                      {ach.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Modal for Trophy Inspection */}
      {selectedAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-dark-900 border border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-dark-950 font-display font-black text-xs uppercase">
                {selectedAch.result}
              </span>
              <button onClick={() => setSelectedAch(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden bg-dark-950">
              <img src={selectedAch.imageUrl} alt={selectedAch.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400">{selectedAch.date} • {selectedAch.category}</div>
              <h3 className="text-2xl font-display font-black text-white">{selectedAch.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedAch.description}</p>
              
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2">Championship Squad Lineup:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedAch.linkedPlayers.map((p) => (
                    <span key={p} className="px-3 py-1 rounded-xl bg-dark-850 border border-slate-700 text-cyan-300 text-xs font-mono font-bold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
