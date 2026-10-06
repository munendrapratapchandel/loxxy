'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Users, Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface DiscordCtaSectionProps {
  settings: SiteSettings;
}

export default function DiscordCtaSection({ settings }: DiscordCtaSectionProps) {
  if (!settings.discordPageEnabled) return null;

  return (
    <section className="relative py-20 bg-dark-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-950/80 via-dark-900 to-cyan-950/70 border border-slate-700/80 p-8 sm:p-14 shadow-2xl">
          
          {/* Subtle glowing orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-600/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join The Inner Circle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                ENTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">LOXXY COMMUNITY</span>
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Connect with high-tier PvP duelists, organize competitive scrims, track roster promotions, and submit recruitment applications directly to clan leadership.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified HT & LT matchmaking tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Weekly tournament prize pools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Private training arenas & coaching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct team tryouts & recruitment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 sm:items-start lg:items-end justify-center">
              {settings.discordInvite && (
                <a
                  href={settings.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-brand-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-display font-bold text-sm tracking-wider uppercase shadow-glow-md hover:shadow-glow-cyan transition-all"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                  <span>Join Discord Server</span>
                </a>
              )}

              <Link
                href="/discord#apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-dark-900/80 hover:bg-dark-850 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-mono uppercase tracking-wider font-semibold transition-all"
              >
                <span>Apply For Roster</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
