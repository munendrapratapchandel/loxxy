import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPlayerByIdAsync, getSettingsAsync, getPlayersAsync, calculatePowerIndex } from '@/lib/db';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import TierBadge from '@/components/tier/TierBadge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Calendar,
  Clock,
  Globe,
  Swords,
  Shield,
  MessageSquare,
  ExternalLink,
  ArrowLeft,
  Share2,
  Sparkles,
  Zap,
  Target,
  Image as ImageIcon,
  Flame,
  ArrowLeftRight
} from 'lucide-react';
import { YouTubeIcon, TwitterXIcon, TwitchIcon, DiscordIcon } from '@/components/common/SocialIcons';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // live dynamic render

interface PlayerProfilePageProps {
  params: {
    id: string;
  };
}

function calculateTenure(joinDateStr: string): string {
  try {
    const joinDate = new Date(joinDateStr);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - joinDate.getFullYear()) * 12 +
      (now.getMonth() - joinDate.getMonth());

    if (diffMonths < 1) return 'New Recruit (< 1 month)';
    if (diffMonths === 1) return '1 month';
    if (diffMonths < 12) return `${diffMonths} months`;

    const years = Math.floor(diffMonths / 12);
    const remMonths = diffMonths % 12;
    if (remMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} yr ${remMonths} mo`;
  } catch {
    return 'Veteran Member';
  }
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const player = await getPlayerByIdAsync(params.id);
  const settings = await getSettingsAsync();
  const allPlayers = await getPlayersAsync();

  if (!player) {
    notFound();
  }

  const tenure = calculateTenure(player.joinDate);
  const topTier = Object.values(player.pvpTiers)[0] || 'HT1';
  const powerIndex = player.powerIndex || calculatePowerIndex(player);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative">
        {/* Background ambient lighting */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Breadcrumb & Actions Row */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/roster"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Roster Directory</span>
          </Link>

          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:bg-dark-850 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare Athlete</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: 3D Minecraft Rig Showcase Stage */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-dark-900/80 border border-slate-700/80 backdrop-blur-2xl shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  3D HOLOGRAM RIG
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  INTERACTIVE
                </span>
              </div>

              {/* 3D Skin Viewer */}
              <div className="py-4 flex justify-center">
                <MinecraftSkinViewer
                  skinUrl={player.skinUrl}
                  width={300}
                  height={420}
                  initialAnimation="idle"
                  autoRotate={true}
                  enableControls={true}
                  glowColor={topTier.startsWith('HT1') ? '#f43f5e' : topTier.startsWith('HT2') ? '#fbbf24' : '#8b5cf6'}
                />
              </div>

              {/* Skin Source & NameMC Note */}
              <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>IGN: <strong className="text-white">{player.ign}</strong></span>
                <a
                  href={`https://namemc.com/profile/${player.ign}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>NameMC Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Athlete Registry Card */}
            <div className="p-6 rounded-3xl bg-dark-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Athlete Registry
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  LPI: {powerIndex.toFixed(1)}
                </span>
              </div>
              
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Region
                  </span>
                  <span className="text-white font-semibold">{player.region}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" /> Joined Loxxy
                  </span>
                  <span className="text-white font-semibold">
                    {new Date(player.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Member Tenure
                  </span>
                  <span className="text-emerald-300 font-semibold">{tenure}</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-amber-400" /> Primary Discipline
                  </span>
                  <span className="text-amber-300 font-semibold">{player.mainGamemode}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dossier, Tiers, Skills, Career, Media, Socials */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Info */}
            <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-mono uppercase font-bold tracking-wider">
                    {player.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-medium">
                    {player.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">POWER INDEX:</span>
                  <span className="font-display font-black text-xl text-cyan-300">{powerIndex.toFixed(1)}</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
                {player.ign}
              </h1>

              {player.name !== player.ign && (
                <div className="text-sm font-mono text-cyan-300 mt-1 font-semibold">
                  Known as: {player.name}
                </div>
              )}

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                {player.bio ||
                  `${player.ign} is a competitive member representing Loxxy in high-tier Minecraft PvP tournaments and league matches.`}
              </p>

              {/* Social Channels */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                {player.socials.discord && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 text-xs font-mono text-slate-300">
                    <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{player.socials.discord}</span>
                  </div>
                )}
                {player.socials.youtube && (
                  <a
                    href={player.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 hover:border-rose-500/50 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5 text-rose-400" />
                    <span>YouTube</span>
                  </a>
                )}
                {player.socials.twitter && (
                  <a
                    href={player.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 hover:border-sky-500/50 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    <TwitterXIcon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Twitter/X</span>
                  </a>
                )}
                {player.socials.twitch && (
                  <a
                    href={player.socials.twitch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700 hover:border-purple-500/50 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    <TwitchIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Twitch</span>
                  </a>
                )}
              </div>
            </div>

            {/* Gamemode PvP Tiers System Showcase */}
            <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-rose-400" />
                    <span>PvP Gamemode Tiers</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Individual competitive rankings per combat gamemode
                  </p>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {Object.keys(player.pvpTiers).length} MODES RANKED
                </span>
              </div>

              {/* Grid of Custom Tier Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {Object.entries(player.pvpTiers).map(([mode, tier]) => (
                  <TierBadge
                    key={mode}
                    tierId={tier}
                    gamemode={mode}
                    showGamemode={true}
                    size="lg"
                  />
                ))}
              </div>
            </div>

            {/* Minecraft Skill Ratings Breakdown */}
            <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5">
              <div>
                <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Combat & Mechanics Ratings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calibrated from tournament analytics and clan scrim performance
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {Object.entries(player.skills).map(([skillName, score]) => {
                  let barColor = 'bg-brand-500';
                  if (skillName.toLowerCase().includes('pvp')) barColor = 'bg-rose-500';
                  if (skillName.toLowerCase().includes('build')) barColor = 'bg-cyan-500';
                  if (skillName.toLowerCase().includes('redstone')) barColor = 'bg-amber-500';
                  if (skillName.toLowerCase().includes('clutch')) barColor = 'bg-purple-500';
                  if (skillName.toLowerCase().includes('sense')) barColor = 'bg-emerald-500';

                  return (
                    <div key={skillName} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-semibold">{skillName}</span>
                        <span className="text-white font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                          className={`h-full rounded-full ${barColor} shadow-sm transition-all duration-1000`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Career Timeline Ladder */}
            {player.careerTimeline && player.careerTimeline.length > 0 && (
              <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5">
                <div>
                  <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Career Progression & Milestones</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Historical rank promotions and competitive accomplishments
                  </p>
                </div>

                <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6 pt-2">
                  {player.careerTimeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-dark-950" />
                      <div className="text-xs font-mono text-cyan-400 font-bold">{item.date}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Player Media Gallery */}
            {player.mediaGallery && player.mediaGallery.length > 0 && (
              <div className="p-8 rounded-3xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    <span>Athlete Media & Highlights</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {player.mediaGallery.map((m) => (
                    <div key={m.id} className="rounded-2xl overflow-hidden bg-dark-950 border border-slate-800 group">
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={m.url}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3 text-xs font-mono text-slate-300 font-medium truncate">
                        {m.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
