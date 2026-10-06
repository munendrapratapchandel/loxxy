'use client';

import React, { useState } from 'react';
import { TierDefinition, LoxxyDatabase } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import { Plus, Edit2, Trash2, Check, Sparkles, Shield } from 'lucide-react';

interface TiersManagerProps {
  tiers: TierDefinition[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function TiersManager({ tiers, db, onRefresh }: TiersManagerProps) {
  const [editingTier, setEditingTier] = useState<TierDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = (tier: TierDefinition) => {
    setEditingTier({ ...tier });
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingTier({
      id: `HT${tiers.length + 1}`,
      name: `Custom High Tier ${tiers.length + 1}`,
      badgeTitle: 'ELITE',
      type: 'HT',
      level: 1,
      color: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.5)',
      badgeGradient: 'from-rose-500 to-purple-600',
      description: 'Competitive division tier for league tournaments.',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to remove tier "${id}"?`)) return;
    try {
      const newTiers = db.tiers.filter((t) => t.id !== id);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, tiers: newTiers }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    setSaving(true);
    try {
      let updatedTiers = [...db.tiers];
      if (isCreating) {
        updatedTiers.push(editingTier);
      } else {
        const idx = updatedTiers.findIndex((t) => t.id === editingTier.id);
        if (idx !== -1) updatedTiers[idx] = editingTier;
      }

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...db, tiers: updatedTiers }),
      });
      if (res.ok) {
        setEditingTier(null);
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
          <h3 className="text-base font-display font-bold text-white">PvP Tier Badges & Rankings</h3>
          <p className="text-xs text-slate-400">
            Define competitive badges (HT1..HT5, LT1..LT5) and visual color schemes
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Tier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <TierBadge tierId={tier.id} size="md" />
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {tier.type} Division
                </span>
              </div>
              <h4 className="text-base font-display font-bold text-white">{tier.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {tier.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="font-mono text-slate-500 text-[11px]">{tier.badgeTitle}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(tier)}
                  className="px-2.5 py-1 rounded bg-dark-850 hover:bg-slate-800 text-brand-300 font-mono text-[11px]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tier.id)}
                  className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5">
            <h3 className="text-xl font-display font-bold text-white">
              {isCreating ? 'Create Custom Tier' : `Edit Tier ${editingTier.id}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Tier Code (e.g. HT1)</label>
                  <input
                    type="text"
                    required
                    value={editingTier.id}
                    onChange={(e) => setEditingTier({ ...editingTier, id: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Badge Subtitle</label>
                  <input
                    type="text"
                    required
                    value={editingTier.badgeTitle}
                    onChange={(e) => setEditingTier({ ...editingTier, badgeTitle: e.target.value.toUpperCase() })}
                    placeholder="ELITE, MASTER..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  placeholder="High Tier 1"
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-mono">Live Preview:</span>
                <TierBadge tierId={editingTier.id} size="md" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 text-slate-400 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono font-bold"
                >
                  {saving ? 'Saving...' : 'Save Tier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
