'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Settings, ShieldAlert, Check, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface SiteSettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export default function SiteSettingsManager({ settings, onRefresh }: SiteSettingsManagerProps) {
  const [nav, setNav] = useState({ ...settings.navigation });
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleNav = (key: keyof typeof nav) => {
    setNav((prev) => ({ ...prev, [key]: !prev[key] }));
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
          navigation: nav,
          maintenanceMode,
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
          <h3 className="text-base font-display font-bold text-white">System Settings & Page ON/OFF</h3>
          <p className="text-xs text-slate-400">
            Control global navigation items, page availability, and maintenance state
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>System configuration updated successfully!</span>
          </div>
        )}

        {/* Maintenance Mode Toggle Card */}
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white">Maintenance Mode Standby</h4>
                <p className="text-xs text-slate-400">
                  Displays an alert header across the website informing visitors that live match updates are under maintenance
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                maintenanceMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                  maintenanceMode ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pages ON / OFF Navigation Toggles */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Public Navigation & Page Routes Visibility
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'home', label: 'Home Page', desc: 'Main landing page route (/)' },
              { key: 'roster', label: 'Team Roster Page', desc: 'Complete athlete directory (/roster)' },
              { key: 'clips', label: 'Clips & Media Page', desc: 'Clutch highlights, video vault & photos (/clips)' },
              { key: 'rankings', label: 'Rankings Page', desc: 'Power index competitive leaderboards (/rankings)' },
              { key: 'compare', label: 'Compare Athletes', desc: 'Head-to-head tier & stat comparison (/compare)' },
              { key: 'matches', label: 'Matches & Fixtures', desc: 'Tournament schedules & results (/matches)' },
              { key: 'achievements', label: 'Achievements Page', desc: 'Trophy showcase & story timeline (/achievements)' },
              { key: 'dominance', label: 'Dominance Page', desc: 'Competitive statistics & radar (/dominance)' },
              { key: 'discord', label: 'Discord & Recruitment', desc: 'Community & tryout forms (/discord)' },
            ].map((item) => {
              const active = nav[item.key as keyof typeof nav];
              return (
                <div
                  key={item.key}
                  className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-mono font-bold text-white uppercase">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNav(item.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {active ? 'ACTIVE: ON' : 'DISABLED: OFF'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end p-4 bg-dark-900 rounded-2xl border border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Apply System Config'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
