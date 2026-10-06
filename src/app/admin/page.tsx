'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoxxyDatabase } from '@/lib/types';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import PlayersManager from '@/components/admin/PlayersManager';
import TiersManager from '@/components/admin/TiersManager';
import AchievementsManager from '@/components/admin/AchievementsManager';
import StatsManager from '@/components/admin/StatsManager';
import DiscordManager from '@/components/admin/DiscordManager';
import BrandingManager from '@/components/admin/BrandingManager';
import HomepageManager from '@/components/admin/HomepageManager';
import MediaManager from '@/components/admin/MediaManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import MatchesManager from '@/components/admin/MatchesManager';
import NewsManager from '@/components/admin/NewsManager';
import RolesManager from '@/components/admin/RolesManager';
import ClipsManager from '@/components/admin/ClipsManager';
import SupabaseManager from '@/components/admin/SupabaseManager';
import AdminSecurityGate from '@/components/admin/AdminSecurityGate';

import {
  LayoutDashboard,
  Users,
  Shield,
  Trophy,
  BarChart3,
  MessageSquare,
  Palette,
  Layout,
  FolderOpen,
  Settings,
  ExternalLink,
  RefreshCw,
  Swords,
  ChevronRight,
  Menu,
  X,
  Lock,
  Bell,
  Calendar,
  Crown,
  Film,
  Database
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [db, setDb] = useState<LoxxyDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchDatabase = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data');
      const data = await res.json();
      if (data.success && data.data) {
        setDb(data.data);
      }
    } catch (e) {
      console.error('Failed to load database:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  const handleLockSession = () => {
    sessionStorage.removeItem('loxxy_admin_auth');
    setIsAuthenticated(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'players', label: 'Players & 3D Skins', icon: Users, badge: db?.players?.length },
    { id: 'roles', label: 'Team Roles', icon: Crown, badge: db?.roles?.length },
    { id: 'clips', label: 'Clips & Media Vault', icon: Film, badge: db?.clips?.length },
    { id: 'tiers', label: 'PvP Tiers & Badges', icon: Shield, badge: db?.tiers?.length },
    { id: 'matches', label: 'Matches & Fixtures', icon: Calendar, badge: db?.matches?.length },
    { id: 'news', label: 'News Dispatch', icon: Bell, badge: db?.news?.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: db?.achievements?.length },
    { id: 'dominance', label: 'Dominance & Stats', icon: BarChart3 },
    {
      id: 'discord',
      label: 'Discord & Tryouts',
      icon: MessageSquare,
      badge: db?.recruitmentApplications?.filter((a) => a.status === 'Pending').length,
      badgeColor: 'bg-rose-500',
    },
    { id: 'branding', label: 'Branding & Theme', icon: Palette },
    { id: 'homepage', label: 'Homepage & Hero', icon: Layout },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'supabase', label: 'Supabase & Keys', icon: Database, badgeColor: 'bg-emerald-500' },
    { id: 'settings', label: 'Pages ON/OFF', icon: Settings },
  ];

  if (loading && !db) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          Loading Loxxy Admin Command Center...
        </span>
      </div>
    );
  }

  if (!db) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white p-4">
        <span className="text-rose-400 font-mono mb-2">Failed to initialize database connection.</span>
        <button
          onClick={fetchDatabase}
          className="px-4 py-2 rounded-xl bg-brand-600 text-xs font-mono text-white"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Security gate check
  if (!isAuthenticated) {
    return (
      <AdminSecurityGate
        correctPin={db.settings.adminPin || 'loxxy2026'}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-cyan-400" />
          <span className="font-display font-black text-white">{db.settings.siteName} ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-dark-850 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-dark-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 z-40 fixed md:sticky top-0 h-screen overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Swords className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="font-display font-black text-lg text-white group-hover:text-cyan-300 transition-colors">
                  {db.settings.siteName}
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 -mt-1">
                  ADMIN PORTAL
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? 'bg-gradient-to-r from-brand-600/30 to-purple-600/20 text-white border border-brand-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-dark-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={fetchDatabase}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-300"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Database</span>
          </button>

          <button
            onClick={handleLockSession}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Lock Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
        {/* Top bar header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-850">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              <span>Admin Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400 capitalize">{activeTab}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white capitalize">
              {activeTab === 'dashboard' ? 'Overview & Statistics' : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-slate-300 hover:text-white border border-slate-700/80 flex items-center gap-1.5"
            >
              <span>Public Hub</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* Content by activeTab */}
        <div className="relative">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview db={db} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'players' && (
            <PlayersManager
              players={db.players}
              tiers={db.tiers}
              gamemodes={db.gamemodes}
              roles={db.roles || []}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'roles' && (
            <RolesManager
              roles={db.roles || []}
              players={db.players}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'clips' && (
            <ClipsManager
              clips={db.clips || []}
              players={db.players}
              settings={db.settings}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'tiers' && (
            <TiersManager
              tiers={db.tiers}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesManager
              matches={db.matches || []}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'news' && (
            <NewsManager
              news={db.news || []}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsManager
              achievements={db.achievements}
              players={db.players}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'dominance' && (
            <StatsManager
              stats={db.dominanceStats}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'discord' && (
            <DiscordManager
              settings={db.settings}
              applications={db.recruitmentApplications || []}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'branding' && (
            <BrandingManager
              settings={db.settings}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'homepage' && (
            <HomepageManager
              settings={db.settings}
              players={db.players}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'media' && (
            <MediaManager
              media={db.mediaLibrary || []}
              db={db}
              onRefresh={fetchDatabase}
            />
          )}

          {activeTab === 'supabase' && (
            <SupabaseManager onRefresh={fetchDatabase} />
          )}

          {activeTab === 'settings' && (
            <SiteSettingsManager
              settings={db.settings}
              onRefresh={fetchDatabase}
            />
          )}
        </div>
      </main>
    </div>
  );
}
