'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Users,
  Trophy,
  BarChart2,
  MessageSquare,
  Menu,
  X,
  Swords,
  ExternalLink,
  Settings,
  Sparkles,
  ArrowLeftRight,
  Calendar,
  Crown,
  Film
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface NavbarProps {
  settings?: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const siteName = settings?.siteName || 'LOXXY';
  const nav = settings?.navigation || {
    home: true,
    roster: true,
    rankings: true,
    compare: true,
    matches: true,
    clips: true,
    achievements: true,
    dominance: true,
    discord: true,
  };

  const navLinks = [
    { label: 'Home', href: '/', show: nav.home, icon: Sparkles },
    { label: 'Roster', href: '/roster', show: nav.roster, icon: Users },
    { label: 'Rankings', href: '/rankings', show: nav.rankings !== false, icon: Crown },
    { label: 'Compare', href: '/compare', show: nav.compare !== false, icon: ArrowLeftRight },
    { label: 'Matches', href: '/matches', show: nav.matches !== false, icon: Calendar },
    { label: 'Clips', href: '/clips', show: nav.clips !== false, icon: Film },
    { label: 'Trophies', href: '/achievements', show: nav.achievements, icon: Trophy },
    { label: 'Dominance', href: '/dominance', show: nav.dominance, icon: BarChart2 },
    { label: 'Discord', href: '/discord', show: nav.discord && settings?.discordPageEnabled !== false, icon: MessageSquare },
  ].filter(l => l.show);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-950/85 backdrop-blur-xl transition-all">
      {/* Maintenance Mode Banner if active */}
      {settings?.maintenanceMode && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-1 text-center text-xs font-mono text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>MAINTENANCE NOTICE: Public recruitment and live scrim updates are currently in standby.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={siteName}
                className="w-10 h-10 object-contain rounded-xl"
              />
            ) : (
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple-600 to-cyan-400 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-glow-sm">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                  <Swords className="w-5 h-5 text-cyan-400 group-hover:text-brand-300 transition-colors" />
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                {siteName}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-1">
                MINECRAFT ESPORTS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-200' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {settings?.discordInvite && (
              <a
                href={settings.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-glow-cyan transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discord</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-dark-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-dark-950/95 backdrop-blur-2xl px-4 py-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-colors ${
                    active
                      ? 'bg-brand-600/30 text-white border border-brand-500/40'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            {settings?.discordInvite && (
              <a
                href={settings.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Join Discord Community</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
