import { getDominanceStatsAsync, getSettingsAsync, getPlayersAsync } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DominanceSection from '@/components/home/DominanceSection';
import TierBadge from '@/components/tier/TierBadge';
import { BarChart3, Swords, Flame, Target, Zap, Shield, Crown } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DominancePage() {
  const stats = await getDominanceStatsAsync();
  const settings = await getSettingsAsync();
  const players = await getPlayersAsync();

  // Calculate tier distribution
  const tierCounts: Record<string, number> = {};
  players.forEach(p => {
    Object.values(p.pvpTiers).forEach(tier => {
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });
  });

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Competitive Analytics</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            CLAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">DOMINANCE</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Real-time metric breakdown of competitive victories, tier saturation, match consistency, and individual athlete benchmarks.
          </p>
        </div>

        {/* Dynamic Dominance Counter Grid */}
        <DominanceSection stats={stats} />

        {/* Tier Saturation Breakdown */}
        <div className="mt-16 p-8 rounded-3xl bg-dark-900/70 border border-slate-800 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-rose-400" />
              <span>Competitive Tier Saturation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Distribution of verified high-tier and low-tier combat ratings across our athlete roster
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['HT1', 'HT2', 'HT3', 'LT1', 'LT2', 'LT3'].map((tier) => {
              const count = tierCounts[tier] || 0;
              return (
                <div
                  key={tier}
                  className="p-4 rounded-2xl bg-dark-850 border border-slate-800 text-center flex flex-col items-center justify-between gap-3"
                >
                  <TierBadge tierId={tier} size="md" />
                  <div>
                    <div className="text-2xl font-mono font-bold text-white">{count}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Roster Badges
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer settings={settings} />
    </div>
  );
}
