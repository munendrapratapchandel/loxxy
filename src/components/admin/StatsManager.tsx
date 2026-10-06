'use client';

import React, { useState } from 'react';
import { DominanceStat, LoxxyDatabase } from '@/lib/types';
import { Trophy, Swords, Crown, Users, Check, Save } from 'lucide-react';

interface StatsManagerProps {
  stats: DominanceStat[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function StatsManager({ stats, db, onRefresh }: StatsManagerProps) {
  const [localStats, setLocalStats] = useState<DominanceStat[]>(JSON.parse(JSON.stringify(stats)));
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (id: string, field: keyof DominanceStat, value: any) => {
    setLocalStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, dominanceStats: localStats }),
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
          <h3 className="text-base font-display font-bold text-white">Dominance & Stat Counters</h3>
          <p className="text-xs text-slate-400">
            Edit the numbers displayed in the animated stats ribbons on the Homepage and Dominance page
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {localStats.map((stat) => (
            <div
              key={stat.id}
              className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Counter ID: {stat.id}
                </span>
                <span className="text-xs font-mono text-slate-400">Icon: {stat.icon}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Value (Number)</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => handleChange(stat.id, 'value', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Suffix (e.g. + or %)</label>
                  <input
                    type="text"
                    value={stat.suffix || ''}
                    onChange={(e) => handleChange(stat.id, 'suffix', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Icon Type</label>
                  <select
                    value={stat.icon}
                    onChange={(e) => handleChange(stat.id, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white cursor-pointer"
                  >
                    <option value="Trophy">Trophy</option>
                    <option value="Swords">Swords</option>
                    <option value="Crown">Crown</option>
                    <option value="Users">Users</option>
                    <option value="Target">Target</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={stat.description}
                  onChange={(e) => handleChange(stat.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-dark-900 rounded-2xl border border-slate-800">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes saved to public site!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Dominance Numbers'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
