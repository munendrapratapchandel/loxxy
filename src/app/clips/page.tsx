'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ClipItem, SiteSettings, Player } from '@/lib/types';
import {
  Film,
  Play,
  Eye,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Sparkles,
  Swords,
  Trophy,
  X,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ClipsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeGamemode, setActiveGamemode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalClip, setActiveModalClip] = useState<ClipItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data.settings);
          setClips(json.data.clips || []);
          setPlayers(json.data.players || []);
        }
      } catch (e) {
        console.error('Failed to load clips data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isEnabled = settings ? settings.navigation?.clips !== false : true;

  const categories = [
    'All',
    'Tournament Clutch',
    '1v1 Duel',
    'Montage',
    'Screenshot / Photo',
    'VOD'
  ];

  const gamemodes = ['All', 'Crystal PvP', 'Sword PvP', 'Mace', 'Axe', 'Tournament', 'UHC'];

  const filteredClips = clips.filter((clip) => {
    const matchesCat =
      activeCategory === 'All' ||
      (activeCategory === 'Videos' && clip.mediaType === 'video') ||
      (activeCategory === 'Photos' && clip.mediaType === 'image') ||
      clip.category === activeCategory;

    const matchesMode =
      activeGamemode === 'All' ||
      (clip.gamemode && clip.gamemode.toLowerCase().includes(activeGamemode.toLowerCase()));

    const matchesSearch =
      searchQuery === '' ||
      clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clip.authorOrPlayer && clip.authorOrPlayer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (clip.description && clip.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesMode && matchesSearch;
  });

  const featuredClip = clips.find((c) => c.featured) || clips[0];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings || undefined} />

      <main className="flex-1">
        {!isEnabled ? (
          /* Offline / Disabled Notice */
          <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-black text-white">
              Media Vault Standby
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              The Loxxy Media Vault is temporarily set to standby by team administration while fresh tournament highlights and scrim footage are curated.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono uppercase font-bold text-slate-300 border border-slate-700"
              >
                Return to Hub
              </Link>
              <Link
                href="/roster"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white text-xs font-mono uppercase font-bold shadow-glow-sm"
              >
                Explore Roster
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            {/* Header Hero */}
            <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-800 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                  <Film className="w-3.5 h-3.5" />
                  <span>LOXXY MEDIA VAULT & COMBAT ARCHIVE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
                  Highlights, Clutches & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400">
                    Arena Records
                  </span>
                </h1>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Relive peak competitive moments—from 1v4 tournament anchor pops to frame-perfect mace critical drops and championship stage photography.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-dark-850/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{clips.length} Curated Archives</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-dark-850/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <Swords className="w-4 h-4 text-cyan-400" />
                    <span>High-Tier Brackets</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Highlight Card if exists */}
            {featuredClip && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-900 via-dark-900 to-purple-950/20 border border-purple-500/30 relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Media Thumbnail */}
                  <div
                    onClick={() => setActiveModalClip(featuredClip)}
                    className="w-full lg:w-7/12 aspect-video rounded-2xl overflow-hidden relative cursor-pointer border border-slate-700 shadow-2xl group"
                  >
                    <img
                      src={
                        featuredClip.thumbnailUrl ||
                        featuredClip.url ||
                        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200'
                      }
                      alt={featuredClip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-cyan-500 group-hover:bg-cyan-400 text-white flex items-center justify-center shadow-glow-cyan group-hover:scale-110 transition-transform">
                        {featuredClip.mediaType === 'video' ? (
                          <Play className="w-7 h-7 ml-1 fill-white" />
                        ) : (
                          <Eye className="w-7 h-7" />
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg">
                      FEATURED CLUTCH
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="w-full lg:w-5/12 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                      <span>{featuredClip.category}</span>
                      <span>•</span>
                      <span>{featuredClip.gamemode}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                      {featuredClip.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {featuredClip.description ||
                        'A showcase of technical mastery, rapid game sense, and lethal mechanics during competitive play.'}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs font-mono text-slate-400">
                      <div>
                        Athlete: <span className="text-white font-bold">{featuredClip.authorOrPlayer}</span>
                      </div>
                      <div>{featuredClip.date}</div>
                    </div>

                    <button
                      onClick={() => setActiveModalClip(featuredClip)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-glow-sm transition-all"
                    >
                      <span>Watch Full Highlight</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Controls & Search */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                        activeCategory === cat
                          ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white font-bold shadow-glow-sm'
                          : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-dark-850'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clips or athlete..."
                    className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Gamemode pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400 pt-1">
                <span className="text-slate-500 mr-2 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Gamemode:</span>
                </span>
                {gamemodes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveGamemode(mode)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                      activeGamemode === mode
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-dark-900/60 hover:bg-dark-850 text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Clips Grid */}
            {filteredClips.length === 0 ? (
              <div className="p-16 rounded-3xl bg-dark-900/50 border border-slate-800 text-center space-y-3">
                <Film className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-display font-bold text-white">No Clips Found</h3>
                <p className="text-xs text-slate-400 font-mono">
                  No highlight matches the current filter or search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClips.map((clip) => {
                  const isVideo = clip.mediaType === 'video';
                  return (
                    <div
                      key={clip.id}
                      onClick={() => setActiveModalClip(clip)}
                      className="group bg-dark-900/80 border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
                    >
                      {/* Media Thumbnail */}
                      <div className="relative aspect-video bg-dark-950 overflow-hidden">
                        <img
                          src={
                            clip.thumbnailUrl ||
                            clip.url ||
                            'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600'
                          }
                          alt={clip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as any).src =
                              'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600';
                          }}
                        />

                        {/* Hover Overlay with Play Button */}
                        <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/15 flex items-center justify-center transition-colors">
                          <div className="w-12 h-12 rounded-full bg-cyan-500 group-hover:scale-110 text-white flex items-center justify-center shadow-glow-cyan transition-transform">
                            {isVideo ? (
                              <Play className="w-5 h-5 ml-0.5 fill-white" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </div>
                        </div>

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-dark-950/85 border border-slate-800 text-[10px] font-mono text-cyan-300 font-bold uppercase backdrop-blur-md">
                            {clip.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-dark-950/90 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                          {isVideo ? 'VIDEO' : 'PHOTO'}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                            <span className="text-cyan-400">{clip.gamemode || 'PvP'}</span>
                            <span>{clip.date}</span>
                          </div>

                          <h3 className="font-display font-bold text-white text-base line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {clip.title}
                          </h3>

                          {clip.description && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                              {clip.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{clip.authorOrPlayer || 'Loxxy Athlete'}</span>
                          </span>

                          <span className="text-[11px] text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            <span>Watch</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Tryout CTA */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-white">
                  Hit an Insane Clutch in Ranked or Scrims?
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Loxxy scouts review competitive footage weekly. Submit your clips during team recruitment to qualify for high-tier tryouts.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/discord"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm"
                >
                  Submit Tryout Clips
                </Link>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Modal Video / Lightbox Player */}
      {activeModalClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-dark-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setActiveModalClip(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-dark-950/80 hover:bg-dark-850 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Presentation Frame */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeModalClip.mediaType === 'video' ? (
                activeModalClip.url.includes('youtube.com') || activeModalClip.url.includes('youtu.be') ? (
                  <iframe
                    src={activeModalClip.url.replace('watch?v=', 'embed/')}
                    title={activeModalClip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeModalClip.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={activeModalClip.url}
                  alt={activeModalClip.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Footer Information */}
            <div className="p-6 sm:p-8 bg-dark-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                  <span>{activeModalClip.category}</span>
                  <span>•</span>
                  <span>{activeModalClip.gamemode}</span>
                </div>
                <h2 className="text-xl font-display font-black text-white">
                  {activeModalClip.title}
                </h2>
                {activeModalClip.description && (
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {activeModalClip.description}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-slate-400 shrink-0">
                <div>Athlete: <span className="text-white font-bold">{activeModalClip.authorOrPlayer}</span></div>
                <div className="text-[11px] text-slate-500 mt-1">{activeModalClip.date}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer settings={settings || undefined} />
    </div>
  );
}
