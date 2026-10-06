import { getSettingsAsync, getPlayersAsync, getDominanceStatsAsync, getPlayerByIdAsync, getNewsAsync } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveStatusBar from '@/components/layout/LiveStatusBar';
import HeroCanvas from '@/components/home/HeroCanvas';
import HeroSection from '@/components/home/HeroSection';
import LoxxyUniverse from '@/components/home/LoxxyUniverse';
import FeaturedPlayers from '@/components/home/FeaturedPlayers';
import DominanceSection from '@/components/home/DominanceSection';
import LatestNewsSection from '@/components/home/LatestNewsSection';
import DiscordCtaSection from '@/components/home/DiscordCtaSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // always fresh data from admin updates

export default async function HomePage() {
  const settings = await getSettingsAsync();
  const players = await getPlayersAsync();
  const stats = await getDominanceStatsAsync();
  const news = await getNewsAsync();
  
  // Featured hero player (e.g. Professorx)
  const heroPlayer =
    (await getPlayerByIdAsync(settings.hero?.featuredPlayerId)) ||
    players.find(p => p.featured) ||
    players[0];

  const sections = settings.sections || {
    hero: true,
    universe: true,
    liveStatus: true,
    stats: true,
    featuredPlayers: true,
    latestNews: true,
    achievements: true,
    discordCta: true,
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col relative selection:bg-brand-500 selection:text-white">
      {/* Dynamic Animated Canvas in background */}
      <HeroCanvas />

      {/* Live Status Ticker */}
      {sections.liveStatus && (
        <LiveStatusBar settings={settings} />
      )}

      {/* Navigation */}
      <Navbar settings={settings} />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        {sections.hero && (
          <HeroSection settings={settings} featuredPlayer={heroPlayer} />
        )}

        {/* Loxxy Universe 3D Team Showcase */}
        {sections.universe && (
          <LoxxyUniverse players={players} />
        )}

        {/* Live Dominance Stats */}
        {sections.stats && (
          <DominanceSection stats={stats} />
        )}

        {/* Featured Players with 3D Skins & Ranks */}
        {sections.featuredPlayers && (
          <FeaturedPlayers players={players} />
        )}

        {/* Latest from Loxxy Dispatch */}
        {sections.latestNews && (
          <LatestNewsSection news={news} />
        )}

        {/* Discord & Recruitment CTA Banner */}
        {sections.discordCta && (
          <DiscordCtaSection settings={settings} />
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
