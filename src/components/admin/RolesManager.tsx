'use client';

import React, { useState } from 'react';
import { TeamRole, Player } from '@/lib/types';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Users,
  Sparkles,
  AlertCircle,
  Palette
} from 'lucide-react';

interface RolesManagerProps {
  roles: TeamRole[];
  players: Player[];
  onRefresh: () => void;
}

const PRESET_COLORS = [
  { name: 'Cyber Cyan', hex: '#00f5ff' },
  { name: 'Neon Purple', hex: '#8b5cf6' },
  { name: 'Blood Rose', hex: '#f43f5e' },
  { name: 'Solar Amber', hex: '#fbbf24' },
  { name: 'Emerald Blade', hex: '#10b981' },
  { name: 'Void Magenta', hex: '#ec4899' },
  { name: 'Sky Electric', hex: '#38bdf8' },
  { name: 'Titanium Slate', hex: '#94a3b8' },
  { name: 'Royal Gold', hex: '#eab308' },
];

export default function RolesManager({ roles, players, onRefresh }: RolesManagerProps) {
  const [editingRole, setEditingRole] = useState<TeamRole | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const defaultNewRole: TeamRole = {
    id: `role-${Date.now()}`,
    name: '',
    color: '#00f5ff',
    badgeStyle: '',
    description: '',
    isDefault: false,
  };

  const handleStartCreate = () => {
    setEditingRole({ ...defaultNewRole, id: `role-${Date.now()}` });
    setIsCreating(true);
    setErrorMsg('');
  };

  const handleStartEdit = (role: TeamRole) => {
    setEditingRole({ ...role });
    setIsCreating(false);
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole || !editingRole.name.trim()) {
      setErrorMsg('Role name is required');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const url = '/api/roles';
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRole),
      });

      const data = await res.json();
      if (data.success) {
        setEditingRole(null);
        setIsCreating(false);
        onRefresh();
      } else {
        setErrorMsg(data.error || 'Failed to save role');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const assignedCount = players.filter(
      (p) => p.role.toLowerCase() === name.toLowerCase()
    ).length;

    let warning = `Are you sure you want to delete role "${name}"?`;
    if (assignedCount > 0) {
      warning += `\nWarning: ${assignedCount} athlete(s) currently possess this role. Their role title will remain until reassigned.`;
    }

    if (!confirm(warning)) return;

    try {
      const res = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete role');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-display font-bold text-white">Team Roles & Hierarchy</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create, color-code, and assign custom competitive roles for all Loxxy athletes.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const assignedPlayers = players.filter(
            (p) => p.role.toLowerCase() === role.name.toLowerCase()
          );

          return (
            <div
              key={role.id}
              className="p-5 rounded-2xl bg-dark-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100"
                style={{ backgroundColor: role.color }}
              />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color, boxShadow: `0 0 10px ${role.color}` }}
                    />
                    <h4 className="font-display font-bold text-base text-white">{role.name}</h4>
                  </div>
                  {role.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{role.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(role)}
                    className="p-1.5 rounded-lg bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Edit Role"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id, role.name)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Badge Preview */}
              <div className="p-2.5 rounded-xl bg-dark-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Public Badge Preview</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${role.color}15`,
                    color: role.color,
                    border: `1px solid ${role.color}40`,
                    boxShadow: `0 0 8px ${role.color}25`,
                  }}
                >
                  {role.name}
                </span>
              </div>

              {/* Assigned Athletes */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Assigned Athletes</span>
                  </span>
                  <span className="text-white font-bold px-1.5 py-0.5 rounded bg-dark-850">
                    {assignedPlayers.length}
                  </span>
                </div>

                {assignedPlayers.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {assignedPlayers.map((p) => (
                      <span
                        key={p.id}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-dark-850 border border-slate-800 text-slate-300"
                      >
                        {p.ign}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-600 italic">
                    No athletes assigned yet
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-display font-black text-white">
                  {isCreating ? 'Create Custom Role' : `Edit Role: ${editingRole.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Role Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  placeholder="e.g. Vanguard, Crystal Ace, Duelist..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Role Color (Hex & Palette)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="color"
                    value={editingRole.color}
                    onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={editingRole.color}
                    onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                    placeholder="#00f5ff"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Preset quick colors */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setEditingRole({ ...editingRole, color: c.hex })}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-850 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-600 transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Role Description & Responsibility
                </label>
                <textarea
                  rows={3}
                  value={editingRole.description || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Describe what this role signifies on the competitive Loxxy roster..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-2">
                <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Live Public Badge Preview:
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: `${editingRole.color}20`,
                      color: editingRole.color,
                      border: `1px solid ${editingRole.color}50`,
                      boxShadow: `0 0 12px ${editingRole.color}30`,
                    }}
                  >
                    {editingRole.name || 'Sample Role'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Player profile and roster badge styling
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm"
                >
                  {saving ? 'Saving...' : isCreating ? 'Create Role' : 'Update Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
