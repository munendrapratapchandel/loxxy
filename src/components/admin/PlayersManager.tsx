'use client';

import React, { useState } from 'react';
import { Player, TierDefinition, GamemodeDefinition } from '@/lib/types';
import TierBadge from '@/components/tier/TierBadge';
import MinecraftSkinViewer from '@/components/skin/MinecraftSkinViewer';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Download,
  Search,
  Sparkles,
  UserCheck,
  Star,
  RefreshCw,
  Eye
} from 'lucide-react';

interface PlayersManagerProps {
  players: Player[];
  tiers: TierDefinition[];
  gamemodes: GamemodeDefinition[];
  onRefresh: () => void;
}

export default function PlayersManager({
  players,
  tiers,
  gamemodes,
  onRefresh,
}: PlayersManagerProps) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingSkin, setUploadingSkin] = useState(false);

  const defaultNewPlayer: Player = {
    id: `player-${Date.now()}`,
    name: '',
    ign: '',
    role: 'PvP Player',
    skinUrl: '/skins/steve.png',
    avatarUrl: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    featured: false,
    region: 'NA East',
    mainGamemode: 'Sword PvP',
    bio: '',
    pvpTiers: {
      'Sword': 'HT2',
      'Axe': 'HT2',
      'Crystal': 'LT1',
      'Mace': 'HT2',
    },
    skills: {
      'PvP': 90,
      'Building': 75,
      'Redstone': 65,
      'Clutching': 85,
      'Game Sense': 88,
      'Parkour': 82,
    },
    socials: {
      discord: '',
      youtube: '',
      twitter: '',
      twitch: '',
      namemc: '',
    },
  };

  const handleStartCreate = () => {
    setEditingPlayer({ ...defaultNewPlayer, id: `player-${Date.now()}` });
    setIsCreating(true);
  };

  const handleEdit = (p: Player) => {
    setEditingPlayer(JSON.parse(JSON.stringify(p)));
    setIsCreating(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove athlete "${name}" from the Loxxy database?`)) return;
    try {
      const res = await fetch(`/api/players?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete player');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (p: Player) => {
    try {
      await fetch('/api/players', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, featured: !p.featured }),
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSkinFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPlayer) return;

    setUploadingSkin(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'skins');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditingPlayer({
          ...editingPlayer,
          skinUrl: data.url,
        });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert('Error uploading skin: ' + err.message);
    } finally {
      setUploadingSkin(false);
    }
  };

  const handleFetchMojangSkin = () => {
    if (!editingPlayer || !editingPlayer.ign) {
      alert('Please enter a Minecraft IGN first!');
      return;
    }
    const ign = editingPlayer.ign.trim();
    setEditingPlayer({
      ...editingPlayer,
      skinUrl: `https://mc-heads.net/skin/${ign}`,
      avatarUrl: `https://mc-heads.net/avatar/${ign}/100`,
      name: editingPlayer.name || ign,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.ign) return;

    setSaving(true);
    try {
      const url = '/api/players';
      const method = isCreating ? 'POST' : 'PUT';

      const payload = {
        ...editingPlayer,
        avatarUrl: editingPlayer.avatarUrl || `https://mc-heads.net/avatar/${editingPlayer.ign}/100`,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEditingPlayer(null);
        setIsCreating(false);
        onRefresh();
      } else {
        alert(data.error || 'Failed to save player');
      }
    } catch (err: any) {
      alert('Error saving player: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = players.filter(
    (p) =>
      p.ign.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players by IGN or role..."
            className="w-full pl-9 pr-3 py-2 bg-dark-850 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={handleStartCreate}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Athlete</span>
        </button>
      </div>

      {/* Players List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((player) => {
          const topTier = Object.values(player.pvpTiers)[0] || 'HT1';
          return (
            <div
              key={player.id}
              className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 backdrop-blur-xl flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(player)}
                      title={player.featured ? 'Featured on Homepage (Click to unfeature)' : 'Click to feature on Homepage'}
                      className={`p-1 rounded-md transition-colors ${player.featured ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <Star className={`w-4 h-4 ${player.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-850 border border-slate-700 text-brand-300">
                      {player.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{player.status}</span>
                </div>

                {/* Body info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={player.avatarUrl || `https://mc-heads.net/avatar/${player.ign}/60`}
                    alt={player.ign}
                    className="w-12 h-12 rounded-xl bg-dark-950 border border-slate-800 p-1"
                    onError={(e) => {
                      (e.target as any).src = '/skins/steve.png';
                    }}
                  />
                  <div>
                    <h4 className="text-lg font-display font-black text-white">{player.ign}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {player.name} • {player.mainGamemode}
                    </p>
                  </div>
                </div>

                {/* Tiers Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {Object.entries(player.pvpTiers).slice(0, 3).map(([mode, tier]) => (
                    <TierBadge key={mode} tierId={tier} size="sm" gamemode={mode} showGamemode={true} />
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={`/roster/${player.id}`}
                  target="_blank"
                  className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-mono"
                  title="View Public Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(player)}
                    className="px-2.5 py-1.5 rounded-lg bg-dark-850 hover:bg-brand-600/30 text-brand-300 text-xs font-mono flex items-center gap-1 border border-slate-800"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(player.id, player.ign)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 text-xs border border-rose-500/20"
                    title="Delete Player"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Player Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] bg-dark-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-display font-black text-white">
                  {isCreating ? 'Register New Athlete' : `Editing ${editingPlayer.ign}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Update 3D Minecraft skin, PvP gamemode tiers, and combat statistics
                </p>
              </div>
              <button
                onClick={() => setEditingPlayer(null)}
                className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Core Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Minecraft IGN *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingPlayer.ign}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, ign: e.target.value })}
                      placeholder="e.g. Professorx"
                      className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleFetchMojangSkin}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-[11px] font-mono whitespace-nowrap"
                      title="Fetch skin from Mojang CDN by IGN"
                    >
                      Fetch Skin
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Display Name / Alias
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.name}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                    placeholder="e.g. Professorx"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Team Role
                  </label>
                  <select
                    value={editingPlayer.role}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, role: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Owner">Owner</option>
                    <option value="Co-Owner">Co-Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Captain">Captain</option>
                    <option value="PvP Player">PvP Player</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Builder">Builder</option>
                    <option value="Redstoner">Redstoner</option>
                    <option value="Trial">Trial</option>
                    <option value="Reserve">Reserve</option>
                  </select>
                </div>
              </div>

              {/* Status, Region, Gamemode, JoinDate */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPlayer.status}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Captain">Captain</option>
                    <option value="Reserve">Reserve</option>
                    <option value="Trial">Trial</option>
                    <option value="Former">Former</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.region}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, region: e.target.value })}
                    placeholder="NA East, EU Central..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Main Gamemode
                  </label>
                  <input
                    type="text"
                    value={editingPlayer.mainGamemode}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, mainGamemode: e.target.value })}
                    placeholder="Sword PvP, Crystal..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Joined Date
                  </label>
                  <input
                    type="date"
                    value={editingPlayer.joinDate}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, joinDate: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Skin Upload Section & 3D Preview */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    3D Minecraft Skin Texture (2D PNG)
                  </span>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/30 border border-brand-500/50 text-brand-300 hover:bg-brand-600/50 cursor-pointer text-xs font-mono">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSkin ? 'Uploading...' : 'Upload Skin PNG'}</span>
                    <input
                      type="file"
                      accept=".png"
                      className="hidden"
                      onChange={handleSkinFileUpload}
                      disabled={uploadingSkin}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Skin URL / Path:
                    </label>
                    <input
                      type="text"
                      value={editingPlayer.skinUrl}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, skinUrl: e.target.value })}
                      placeholder="/skins/professorx.png or https://..."
                      className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                        <input
                          type="checkbox"
                          checked={editingPlayer.featured}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, featured: e.target.checked })}
                          className="rounded text-brand-500"
                        />
                        <span>Feature on Homepage Arena</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-center bg-dark-900/60 p-2 rounded-xl border border-slate-800">
                    <MinecraftSkinViewer
                      skinUrl={editingPlayer.skinUrl}
                      width={160}
                      height={200}
                      initialAnimation="idle"
                      autoRotate={true}
                      enableControls={false}
                    />
                  </div>
                </div>
              </div>

              {/* PvP Gamemode Tiers Assigner */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  PvP Gamemode Tiers (HT1..HT5 / LT1..LT5)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Sword', 'Axe', 'Crystal', 'Mace', 'UHC', 'Bedwars'].map((mode) => (
                    <div key={mode} className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">{mode}</label>
                      <select
                        value={editingPlayer.pvpTiers[mode] || 'HT2'}
                        onChange={(e) => {
                          setEditingPlayer({
                            ...editingPlayer,
                            pvpTiers: {
                              ...editingPlayer.pvpTiers,
                              [mode]: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                      >
                        {tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.id} - {t.badgeTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Sliders */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Mechanics & Combat Skill Ratings (%)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(editingPlayer.skills).map(([skill, val]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-300">
                        <span>{skill}</span>
                        <span className="text-cyan-400 font-bold">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={val}
                        onChange={(e) => {
                          setEditingPlayer({
                            ...editingPlayer,
                            skills: {
                              ...editingPlayer.skills,
                              [skill]: parseInt(e.target.value) || 50,
                            },
                          });
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Socials */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Athlete Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editingPlayer.bio}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, bio: e.target.value })}
                    placeholder="Short summary of player accomplishments, playstyle, and tournament highlights..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Discord</label>
                    <input
                      type="text"
                      value={editingPlayer.socials.discord || ''}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          socials: { ...editingPlayer.socials, discord: e.target.value },
                        })
                      }
                      placeholder="user#0001"
                      className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">YouTube</label>
                    <input
                      type="text"
                      value={editingPlayer.socials.youtube || ''}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          socials: { ...editingPlayer.socials, youtube: e.target.value },
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Twitter/X</label>
                    <input
                      type="text"
                      value={editingPlayer.socials.twitter || ''}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          socials: { ...editingPlayer.socials, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/..."
                      className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Twitch</label>
                    <input
                      type="text"
                      value={editingPlayer.socials.twitch || ''}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          socials: { ...editingPlayer.socials, twitch: e.target.value },
                        })
                      }
                      placeholder="https://twitch.tv/..."
                      className="w-full px-2.5 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Save Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-400 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish Player'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
