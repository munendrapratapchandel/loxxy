'use client';

import React, { useState } from 'react';
import { SiteSettings, Player } from '@/lib/types';
import { Layout, Save, Check, Eye, EyeOff, Activity } from 'lucide-react';

interface HomepageManagerProps {
  settings: SiteSettings;
  players: Player[];
  onRefresh: () => void;
}

export default function HomepageManager({
  settings,
  players,
  onRefresh,
}: HomepageManagerProps) {
  const [heroForm, setHeroForm] = useState({ ...settings.hero });
  const [sections, setSections] = useState({ ...settings.sections });
  const [liveStatus, setLiveStatus] = useState({
    enabled: settings.liveStatus?.enabled ?? true,
    membersOnline: settings.liveStatus?.membersOnline ?? 24,
    playersInGame: settings.liveStatus?.playersInGame ?? 7,
    discordOnline: settings.liveStatus?.discordOnline ?? true,
    currentActivity: settings.liveStatus?.currentActivity ?? 'Scrimming Tier-1 Invitational Brackets',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero: heroForm,
          sections,
          liveStatus,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-dark-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-display font-bold text-white">Homepage Layout, Hero & Live Status</h3>
          <p className="text-xs text-slate-400">
            Control the hero text, live status numbers, featured athlete, and toggle sections ON/OFF
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Homepage layout and live status updated successfully!</span>
          </div>
        )}

        {/* Section Toggles */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Homepage Section Visibility & Toggles
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'hero', label: 'Hero Rig Section' },
              { key: 'universe', label: 'Loxxy Universe (3D Orbit)' },
              { key: 'liveStatus', label: 'Live Status Ticker' },
              { key: 'stats', label: 'Dominance Counters' },
              { key: 'featuredPlayers', label: 'Featured 3D Players' },
              { key: 'latestNews', label: 'Latest Dispatch News' },
              { key: 'discordCta', label: 'Discord Join Banner' },
            ].map((sec) => {
              const active = sections[sec.key as keyof typeof sections];
              return (
                <button
                  type="button"
                  key={sec.key}
                  onClick={() => handleToggleSection(sec.key as any)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    active
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-dark-850 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{sec.label}</span>
                  {active ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Team Status Manager */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Live Team Status System</span>
            </h4>
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={liveStatus.enabled}
                onChange={(e) => setLiveStatus({ ...liveStatus, enabled: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Ticker Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Members Online</label>
              <input
                type="number"
                value={liveStatus.membersOnline}
                onChange={(e) => setLiveStatus({ ...liveStatus, membersOnline: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Players In-Game</label>
              <input
                type="number"
                value={liveStatus.playersInGame}
                onChange={(e) => setLiveStatus({ ...liveStatus, playersInGame: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Current Activity Text</label>
              <input
                type="text"
                value={liveStatus.currentActivity}
                onChange={(e) => setLiveStatus({ ...liveStatus, currentActivity: e.target.value })}
                placeholder="Scrimming Tier-1 Invitational..."
                className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Hero Content Editor */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold">
            Hero Headline & Copy
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Hero Title</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Hero Tagline</label>
              <input
                type="text"
                value={heroForm.tagline}
                onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Hero Description</label>
            <textarea
              rows={2}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Featured 3D Athlete on Hero Stage
            </label>
            <select
              value={heroForm.featuredPlayerId}
              onChange={(e) => setHeroForm({ ...heroForm, featuredPlayerId: e.target.value })}
              className="w-full sm:w-80 px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ign} ({p.role}) - {p.mainGamemode}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Button 1 Label</label>
              <input
                type="text"
                value={heroForm.cta1Text}
                onChange={(e) => setHeroForm({ ...heroForm, cta1Text: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Button 2 Label</label>
              <input
                type="text"
                value={heroForm.cta2Text}
                onChange={(e) => setHeroForm({ ...heroForm, cta2Text: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Button 3 Label</label>
              <input
                type="text"
                value={heroForm.cta3Text}
                onChange={(e) => setHeroForm({ ...heroForm, cta3Text: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 bg-dark-900 rounded-2xl border border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Homepage Layout & Status'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
