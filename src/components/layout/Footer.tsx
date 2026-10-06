import React from 'react';
import Link from 'next/link';
import { Swords, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { YouTubeIcon, TwitterXIcon, TwitchIcon, DiscordIcon } from '@/components/common/SocialIcons';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName || 'LOXXY';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-850 bg-dark-950 text-slate-400 py-16 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-brand-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-dark-900 rounded-[6px] flex items-center justify-center">
                  <Swords className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-black text-xl tracking-wider text-white">
                {siteName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings?.tagline || 'Built to Compete. Designed to Dominate.'} An elite competitive Minecraft clan dominating high-tier brackets worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings?.discordInvite && (
                <a
                  href={settings.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-dark-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  title="Discord"
                >
                  <DiscordIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                title="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                title="Twitter / X"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/40 transition-colors"
                title="Twitch"
              >
                <TwitchIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-4">
              Organization
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home Hub
                </Link>
              </li>
              <li>
                <Link href="/roster" className="hover:text-cyan-400 transition-colors">
                  Official Roster
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-cyan-400 transition-colors">
                  Trophies & Dominance
                </Link>
              </li>
              {settings?.navigation?.clips !== false && (
                <li>
                  <Link href="/clips" className="hover:text-cyan-400 transition-colors">
                    Clips & Highlights
                  </Link>
                </li>
              )}
              <li>
                <Link href="/dominance" className="hover:text-cyan-400 transition-colors">
                  Statistical Records
                </Link>
              </li>
              <li>
                <Link href="/discord" className="hover:text-cyan-400 transition-colors">
                  Recruitment / Discord
                </Link>
              </li>
            </ul>
          </div>

          {/* Gamemodes Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-4">
              Gamemodes
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-slate-400 hover:text-white transition-colors">⚔ Sword PvP</span>
              <span className="text-slate-400 hover:text-white transition-colors">💥 Crystal PvP</span>
              <span className="text-slate-400 hover:text-white transition-colors">🪓 Axe Combat</span>
              <span className="text-slate-400 hover:text-white transition-colors">🔨 Mace Smashing</span>
              <span className="text-slate-400 hover:text-white transition-colors">❤️ UHC League</span>
              <span className="text-slate-400 hover:text-white transition-colors">🛏 Bedwars Pro</span>
            </div>
          </div>

          {/* Competitive System */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-4">
              Team Command
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Powered by Loxxy Custom Dynamic Tier Engine. All player stats, 3D skins, and achievements updated live.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Competitive Engine Online</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 text-center sm:text-right">
            Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
