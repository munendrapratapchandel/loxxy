import React from 'react';
import { getPlayers, getSettings, getGamemodes, getTiers } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RosterView from '@/components/roster/RosterView';
import { Users, Shield, Sparkles } from 'lucide-react';

export const revalidate = 0; // always fresh data

export default function RosterPage() {
  const players = getPlayers();
  const settings = getSettings();
  const gamemodes = getGamemodes();
  const tiers = getTiers();

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-brand-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Athlete Directory</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-pink-500">ROSTER</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Every athlete representing Loxxy in competitive Minecraft circuits. Filter by PvP gamemode mastery, high-tier status, or search for your favorite competitor.
          </p>
        </div>

        {/* Main Filterable Roster View */}
        <RosterView players={players} gamemodes={gamemodes} tiers={tiers} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
