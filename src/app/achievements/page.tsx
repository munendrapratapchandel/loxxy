import React from 'react';
import { getAchievements, getSettings, getDominanceStats, getTimelineMilestones } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AchievementsInteractiveView from '@/components/achievements/AchievementsInteractiveView';
import { Trophy } from 'lucide-react';

export const revalidate = 0;

export default function AchievementsPage() {
  const achievements = getAchievements();
  const settings = getSettings();
  const stats = getDominanceStats();
  const milestones = getTimelineMilestones();

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-brand-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Trophy Room & Chronicle</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400">ACHIEVEMENTS</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Chronological milestones, championship titles, and official tournament victory records.
          </p>
        </div>

        {/* Top Dominance Numbers Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 backdrop-blur-xl text-center"
            >
              <div className="text-3xl sm:text-4xl font-display font-black text-white">
                <span className="text-amber-400">{s.value}</span>
                <span className="text-cyan-400">{s.suffix}</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <AchievementsInteractiveView achievements={achievements} milestones={milestones} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
