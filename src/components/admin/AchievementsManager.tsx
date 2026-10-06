'use client';

import React, { useState } from 'react';
import { Achievement, LoxxyDatabase, Player } from '@/lib/types';
import { Trophy, Plus, Edit2, Trash2, Calendar, Medal, Upload, X } from 'lucide-react';

interface AchievementsManagerProps {
  achievements: Achievement[];
  players: Player[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function AchievementsManager({
  achievements,
  players,
  db,
  onRefresh,
}: AchievementsManagerProps) {
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const defaultNew: Achievement = {
    id: `ach-${Date.now()}`,
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Tournament',
    result: '1st Place Champions',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    linkedPlayers: ['Professorx'],
  };

  const handleStartCreate = () => {
    setEditingAch({ ...defaultNew, id: `ach-${Date.now()}` });
    setIsCreating(true);
  };

  const handleEdit = (ach: Achievement) => {
    setEditingAch({ ...ach, linkedPlayers: [...ach.linkedPlayers] });
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this achievement?')) return;
    try {
      const updated = db.achievements.filter((a) => a.id !== id);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, achievements: updated }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAch) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'uploads');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setEditingAch({ ...editingAch, imageUrl: data.url });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;
    setSaving(true);
    try {
      let updated = [...db.achievements];
      if (isCreating) {
        updated.unshift(editingAch);
      } else {
        const idx = updated.findIndex((a) => a.id === editingAch.id);
        if (idx !== -1) updated[idx] = editingAch;
      }
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, achievements: updated }),
      });
      if (res.ok) {
        setEditingAch(null);
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
          <h3 className="text-base font-display font-bold text-white">Championships & Trophies</h3>
          <p className="text-xs text-slate-400">
            Manage tournament results, event banners, and line-ups
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-glow-gold/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="rounded-2xl bg-dark-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-40 bg-dark-950">
              <img
                src={ach.imageUrl}
                alt={ach.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-80" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-dark-950 text-[11px] font-bold font-mono">
                  {ach.result}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{ach.date}</span>
                <span className="text-cyan-400">{ach.category}</span>
              </div>
              <h4 className="text-base font-display font-bold text-white">{ach.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
              
              <div className="flex flex-wrap gap-1 pt-1">
                {ach.linkedPlayers.map((p) => (
                  <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-850 text-slate-300 border border-slate-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(ach)}
                className="px-2.5 py-1 rounded bg-dark-850 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDelete(ach.id)}
                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Achievement Modal */}
      {editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] bg-dark-900 border border-slate-700 rounded-3xl p-6 sm:p-8 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-display font-bold text-white">
                {isCreating ? 'Add Tournament Victory' : 'Edit Achievement'}
              </h3>
              <button onClick={() => setEditingAch(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Tournament / Event Title *</label>
                <input
                  type="text"
                  required
                  value={editingAch.title}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="Global Minecraft PvP Invitational 2026"
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Result / Placement</label>
                  <input
                    type="text"
                    required
                    value={editingAch.result}
                    onChange={(e) => setEditingAch({ ...editingAch, result: e.target.value })}
                    placeholder="1st Place Champions"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Category</label>
                  <select
                    value={editingAch.category}
                    onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono cursor-pointer"
                  >
                    <option value="Championship">Championship</option>
                    <option value="Tournament">Tournament</option>
                    <option value="PvP">PvP</option>
                    <option value="Dominance">Dominance</option>
                    <option value="Record">Record</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Event Date</label>
                <input
                  type="date"
                  value={editingAch.date}
                  onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Banner Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingAch.imageUrl}
                    onChange={(e) => setEditingAch({ ...editingAch, imageUrl: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1 shrink-0 font-mono">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAch.description}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  placeholder="Summary of tournament match highlights and final score..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Participating Lineup (comma-separated IGNs)
                </label>
                <input
                  type="text"
                  value={editingAch.linkedPlayers.join(', ')}
                  onChange={(e) =>
                    setEditingAch({
                      ...editingAch,
                      linkedPlayers: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Professorx, Zephyr, Valkyrie"
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAch(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 text-slate-400 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-mono font-bold"
                >
                  {saving ? 'Publishing...' : 'Publish Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
