import { getPlayersAsync, getSettingsAsync } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RankingsView from '@/components/rankings/RankingsView';

export const revalidate = 10; // ISR cache with automatic edge revalidation

export default async function RankingsPage() {
  const players = await getPlayersAsync();
  const settings = await getSettingsAsync();

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest mb-3">
            <span>Verified Athlete Standings</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            LOXXY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-pink-500">RANKINGS</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Official team leaderboard calculated via the <strong>Loxxy Power Index (LPI)</strong>. Filter by combat disciplines, gamemode mastery, and compare high-tier athletes.
          </p>
        </div>

        <RankingsView players={players} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
