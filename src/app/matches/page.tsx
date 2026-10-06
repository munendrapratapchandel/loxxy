import React from 'react';
import { getMatches, getSettings } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Swords, Calendar, Trophy, CheckCircle, Clock, Video, ArrowUpRight } from 'lucide-react';

export const revalidate = 0;

export default function MatchesPage() {
  const matches = getMatches();
  const settings = getSettings();

  const upcoming = matches.filter((m) => m.status === 'Upcoming');
  const completed = matches.filter((m) => m.status === 'Completed');

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Swords className="w-3.5 h-3.5 text-cyan-400" />
            <span>Competitive Scrim Schedule</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            MATCHES & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">FIXTURES</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Official team calendar for upcoming tournament matches, clan scrims, and verified head-to-head scorecards.
          </p>
        </div>

        {/* Upcoming Fixtures */}
        <div className="space-y-6 mb-16">
          <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Upcoming Fixtures</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((match) => (
              <div
                key={match.id}
                className="p-6 rounded-3xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="text-cyan-400 uppercase tracking-wider">{match.tournament}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {match.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4 border-y border-slate-800/80">
                    <div className="text-xl font-display font-black text-white">LOXXY</div>
                    <div className="px-3 py-1 rounded-full bg-dark-850 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                      VS
                    </div>
                    <div className="text-xl font-display font-black text-slate-200">
                      {match.opponent}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 mt-3">
                    Gamemode: <strong className="text-slate-200">{match.gamemode}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                    CONFIRMED FIXTURE
                  </span>
                  <a
                    href={settings.discordInvite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Watch Scrim Stream</span>
                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Recent Match Results</span>
          </h2>

          <div className="space-y-4">
            {completed.map((match) => (
              <div
                key={match.id}
                className="p-6 rounded-2xl bg-dark-900/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black font-display text-sm shrink-0">
                    W
                  </div>
                  <div>
                    <div className="text-base font-display font-black text-white">
                      Loxxy vs {match.opponent}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {match.tournament} • {match.date} • {match.gamemode}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-2xl font-mono font-black text-emerald-400">
                    {match.score}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase">
                    {match.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer settings={settings} />
    </div>
  );
}
