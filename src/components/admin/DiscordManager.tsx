'use client';

import React, { useState } from 'react';
import { SiteSettings, RecruitmentApplication, LoxxyDatabase } from '@/lib/types';
import { MessageSquare, CheckCircle, XCircle, Clock, ExternalLink, Save, Check } from 'lucide-react';

interface DiscordManagerProps {
  settings: SiteSettings;
  applications: RecruitmentApplication[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function DiscordManager({
  settings,
  applications,
  db,
  onRefresh,
}: DiscordManagerProps) {
  const [discordPageEnabled, setDiscordPageEnabled] = useState(settings.discordPageEnabled);
  const [recruitmentEnabled, setRecruitmentEnabled] = useState(settings.recruitmentEnabled);
  const [discordInvite, setDiscordInvite] = useState(settings.discordInvite);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discordPageEnabled,
          recruitmentEnabled,
          discordInvite,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Reviewed' | 'Accepted' | 'Rejected') => {
    try {
      const res = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings Form Card */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-display font-bold text-white">Discord & Recruitment Settings</h3>
            <p className="text-xs text-slate-400">Control public access and the invite link</p>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs uppercase font-bold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Discord settings updated successfully on the public site!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discord Page Toggle */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono uppercase text-white font-bold">Discord Page</span>
              <span className="text-[11px] text-slate-400">Toggle public /discord route</span>
            </div>
            <button
              type="button"
              onClick={() => setDiscordPageEnabled(!discordPageEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                discordPageEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  discordPageEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Recruitment Form Toggle */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono uppercase text-white font-bold">Athlete Applications</span>
              <span className="text-[11px] text-slate-400">Accept tryout submissions</span>
            </div>
            <button
              type="button"
              onClick={() => setRecruitmentEnabled(!recruitmentEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                recruitmentEnabled ? 'bg-brand-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  recruitmentEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Discord Invite URL */}
          <div className="md:col-span-1">
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Official Discord Invite URL
            </label>
            <input
              type="text"
              value={discordInvite}
              onChange={(e) => setDiscordInvite(e.target.value)}
              placeholder="https://discord.gg/..."
              className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </form>

      {/* Submitted Recruitment Applications */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-display font-bold text-white">Recruitment Applications Inbox</h3>
            <p className="text-xs text-slate-400">
              {applications.length} Submitted athlete application{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            No applications submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-dark-850 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-display font-black text-white">{app.ign}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Claimed: {app.pvpTierClaim}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : app.status === 'Reviewed'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Discord: <strong className="text-white">{app.discordTag}</strong></span>
                    <span>•</span>
                    <span>Mode: <strong className="text-cyan-400">{app.mainGamemode}</strong></span>
                    <span>•</span>
                    <span>Region: {app.region}</span>
                    {app.age && <span>• Age: {app.age}</span>}
                  </div>

                  {app.experience && (
                    <p className="text-xs text-slate-300 pt-1">
                      <strong className="text-slate-400">Experience:</strong> {app.experience}
                    </p>
                  )}

                  {app.whyJoin && (
                    <p className="text-xs text-slate-400 italic">
                      "{app.whyJoin}"
                    </p>
                  )}

                  {app.clipsUrl && (
                    <div className="pt-1">
                      <a
                        href={app.clipsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Watch Submitted Clips / Montage</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Accepted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Reviewed')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" /> Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
