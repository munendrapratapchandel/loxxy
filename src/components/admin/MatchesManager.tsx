'use client';

import React, { useState } from 'react';
import { MatchItem, LoxxyDatabase } from '@/lib/types';
import { Swords, Plus, Edit2, Trash2, Calendar, Check, Save } from 'lucide-react';

interface MatchesManagerProps {
  matches: MatchItem[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function MatchesManager({ matches, db, onRefresh }: MatchesManagerProps) {
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultNew: MatchItem = {
    id: `m-${Date.now()}`,
    opponent: '',
    opponentTag: '',
    date: new Date().toISOString().split('T')[0],
    tournament: 'Seasonal Scrim Series',
    gamemode: 'Sword PvP & Mace 4v4',
    status: 'Upcoming',
  };

  const handleStartCreate = () => {
    setEditingMatch({ ...defaultNew, id: `m-${Date.now()}` });
    setIsCreating(true);
  };

  const handleEdit = (m: MatchItem) => {
    setEditingMatch({ ...m });
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this match fixture?')) return;
    try {
      const updated = db.matches.filter((m) => m.id !== id);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, matches: updated }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch || !editingMatch.opponent) return;
    setSaving(true);
    try {
      let updated = [...(db.matches || [])];
      if (isCreating) {
        updated.unshift(editingMatch);
      } else {
        const idx = updated.findIndex((m) => m.id === editingMatch.id);
        if (idx !== -1) updated[idx] = editingMatch;
      }

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, matches: updated }),
      });
      if (res.ok) {
        setEditingMatch(null);
        setIsCreating(false);
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
          <h3 className="text-base font-display font-bold text-white">Match Schedule & Results</h3>
          <p className="text-xs text-slate-400">
            Publish upcoming fixtures and record official victory scorecards
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-glow-cyan/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Match</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(matches || []).map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400 font-bold">{m.tournament}</span>
                <span>{m.date}</span>
              </div>
              <div className="flex items-center justify-between text-base font-display font-bold text-white">
                <span>LOXXY vs {m.opponent}</span>
                {m.score && <span className="font-mono text-emerald-400">{m.score}</span>}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Mode: {m.gamemode}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono">
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  m.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-cyan-500/20 text-cyan-300'
                }`}
              >
                {m.status === 'Completed' ? `${m.result || 'Victory'}` : 'Upcoming'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-2.5 py-1 rounded bg-dark-850 hover:bg-slate-800 text-slate-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-display font-bold text-white">
              {isCreating ? 'Create Match Fixture' : 'Edit Match Details'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Opponent Clan Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMatch.opponent}
                    onChange={(e) => setEditingMatch({ ...editingMatch, opponent: e.target.value })}
                    placeholder="Team Apex"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tournament / League</label>
                  <input
                    type="text"
                    required
                    value={editingMatch.tournament}
                    onChange={(e) => setEditingMatch({ ...editingMatch, tournament: e.target.value })}
                    placeholder="Invitational Cup"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={editingMatch.date}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gamemode</label>
                  <input
                    type="text"
                    value={editingMatch.gamemode}
                    onChange={(e) => setEditingMatch({ ...editingMatch, gamemode: e.target.value })}
                    placeholder="Sword PvP & Mace 4v4"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingMatch.status}
                    onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Result</label>
                  <select
                    value={editingMatch.result || 'Victory'}
                    onChange={(e) => setEditingMatch({ ...editingMatch, result: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white cursor-pointer"
                  >
                    <option value="Victory">Victory</option>
                    <option value="Defeat">Defeat</option>
                    <option value="Draw">Draw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Final Score</label>
                  <input
                    type="text"
                    value={editingMatch.score || ''}
                    onChange={(e) => setEditingMatch({ ...editingMatch, score: e.target.value })}
                    placeholder="5 - 2"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold"
                >
                  {saving ? 'Saving...' : 'Save Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
