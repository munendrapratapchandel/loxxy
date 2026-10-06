'use client';

import React, { useState } from 'react';
import { NewsItem, LoxxyDatabase } from '@/lib/types';
import { Bell, Plus, Edit2, Trash2, Calendar, Save, Upload } from 'lucide-react';

interface NewsManagerProps {
  news: NewsItem[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function NewsManager({ news, db, onRefresh }: NewsManagerProps) {
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultNew: NewsItem = {
    id: `n-${Date.now()}`,
    title: '',
    category: 'Announcement',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    imageUrl: '',
  };

  const handleStartCreate = () => {
    setEditingNews({ ...defaultNew, id: `n-${Date.now()}` });
    setIsCreating(true);
  };

  const handleEdit = (n: NewsItem) => {
    setEditingNews({ ...n });
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const updated = db.news.filter((n) => n.id !== id);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, news: updated }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title) return;
    setSaving(true);
    try {
      let updated = [...(db.news || [])];
      if (isCreating) {
        updated.unshift(editingNews);
      } else {
        const idx = updated.findIndex((n) => n.id === editingNews.id);
        if (idx !== -1) updated[idx] = editingNews;
      }

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, news: updated }),
      });
      if (res.ok) {
        setEditingNews(null);
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
          <h3 className="text-base font-display font-bold text-white">Latest from Loxxy Dispatch</h3>
          <p className="text-xs text-slate-400">
            Publish announcements, roster promotions, and tournament victory news
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish News</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(news || []).map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400 font-bold uppercase">{n.category}</span>
                <span>{n.date}</span>
              </div>
              <h4 className="text-base font-display font-bold text-white">{n.title}</h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{n.summary}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleEdit(n)}
                className="px-2.5 py-1 rounded bg-dark-850 hover:bg-slate-800 text-xs font-mono text-slate-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-display font-bold text-white">
              {isCreating ? 'Publish Announcement' : 'Edit News Item'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="e.g. Loxxy Welcomes New HT1 Recruits"
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-sans text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Category</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white cursor-pointer"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Tournament Win">Tournament Win</option>
                    <option value="Roster Update">Roster Update</option>
                    <option value="Promotion">Promotion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Date</label>
                  <input
                    type="date"
                    value={editingNews.date}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Thumbnail / Skin URL</label>
                <input
                  type="text"
                  value={editingNews.imageUrl || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                  placeholder="/skins/user-custom-skin.png or https://..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  placeholder="Brief summary of the announcement..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold font-mono"
                >
                  {saving ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
