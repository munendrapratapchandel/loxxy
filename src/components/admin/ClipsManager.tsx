'use client';

import React, { useState } from 'react';
import { ClipItem, Player, SiteSettings } from '@/lib/types';
import {
  Film,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Play,
  Image as ImageIcon,
  Eye,
  Power,
  AlertCircle,
  Video,
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';

interface ClipsManagerProps {
  clips: ClipItem[];
  players: Player[];
  settings: SiteSettings;
  onRefresh: () => void;
}

const CATEGORIES: ClipItem['category'][] = [
  'Tournament Clutch',
  '1v1 Duel',
  'Montage',
  'Screenshot / Photo',
  'VOD'
];

export default function ClipsManager({
  clips,
  players,
  settings,
  onRefresh,
}: ClipsManagerProps) {
  const [editingClip, setEditingClip] = useState<ClipItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPreview, setSelectedPreview] = useState<ClipItem | null>(null);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const isClipsEnabled = settings.navigation?.clips !== false;

  const defaultNewClip: ClipItem = {
    id: `clip-${Date.now()}`,
    title: '',
    category: 'Tournament Clutch',
    mediaType: 'video',
    url: '',
    thumbnailUrl: '',
    authorOrPlayer: players[0]?.ign || 'Professorx',
    gamemode: 'Crystal PvP',
    date: new Date().toISOString().split('T')[0],
    description: '',
    featured: false,
  };

  const handleToggleClipsStatus = async () => {
    setTogglingStatus(true);
    try {
      const nextStatus = !isClipsEnabled;
      const res = await fetch('/api/clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e) {
      console.error('Failed to toggle clips status:', e);
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleStartCreate = () => {
    setEditingClip({ ...defaultNewClip, id: `clip-${Date.now()}` });
    setIsCreating(true);
  };

  const handleStartEdit = (clip: ClipItem) => {
    setEditingClip({ ...clip });
    setIsCreating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumb = false) => {
    const file = e.target.files?.[0];
    if (!file || !editingClip) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'uploads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (isThumb) {
          setEditingClip({ ...editingClip, thumbnailUrl: data.url });
        } else {
          // Detect media type from file extension
          const isVideo = file.type.startsWith('video') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
          setEditingClip({
            ...editingClip,
            url: data.url,
            mediaType: isVideo ? 'video' : 'image',
          });
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClip || !editingClip.title.trim() || !editingClip.url.trim()) {
      alert('Title and Media URL or uploaded file are required!');
      return;
    }

    setSaving(true);
    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/clips', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClip),
      });
      const data = await res.json();
      if (data.success) {
        setEditingClip(null);
        setIsCreating(false);
        onRefresh();
      } else {
        alert(data.error || 'Failed to save clip');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete clip "${title}"?`)) return;
    try {
      const res = await fetch(`/api/clips?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredClips = clips.filter((c) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Videos') return c.mediaType === 'video';
    if (activeFilter === 'Photos') return c.mediaType === 'image';
    return c.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* ON / OFF Page & Header Toggle Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isClipsEnabled
          ? 'bg-gradient-to-r from-dark-900 via-dark-900 to-cyan-950/40 border-cyan-500/40'
          : 'bg-dark-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-display font-black text-white">
                Clips & Media Highlights Master Control
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                  isClipsEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isClipsEnabled ? 'Status: ONLINE (ACTIVE)' : 'Status: STANDBY (OFF)'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              When <strong className="text-white">ON</strong>: The Clips link appears in the website header and visitors can watch clutch videos. When <strong className="text-white">OFF</strong>: The link is hidden from the header and public page is deactivated.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleClipsStatus}
              disabled={togglingStatus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md ${
                isClipsEnabled
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isClipsEnabled ? 'Turn OFF Clips Section' : 'Turn ON Clips Section'}</span>
            </button>

            <button
              onClick={handleStartCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video / Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Videos', 'Photos', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeFilter === cat
                  ? 'bg-brand-600/30 text-cyan-300 border border-brand-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-dark-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 px-2">
          Total Clips: <span className="text-white font-bold">{clips.length}</span>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClips.map((clip) => {
          const isVideo = clip.mediaType === 'video';
          return (
            <div
              key={clip.id}
              className="group bg-dark-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-video bg-dark-950 overflow-hidden">
                {clip.thumbnailUrl || (!isVideo && clip.url) ? (
                  <img
                    src={clip.thumbnailUrl || clip.url}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
                    <Video className="w-10 h-10 text-slate-600" />
                  </div>
                )}

                {/* Play / View Overlay */}
                <button
                  onClick={() => setSelectedPreview(clip)}
                  className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 flex items-center justify-center transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-500/90 group-hover:scale-110 text-white flex items-center justify-center shadow-glow-cyan transition-transform">
                    {isVideo ? <Play className="w-5 h-5 ml-0.5 fill-white" /> : <Eye className="w-5 h-5" />}
                  </div>
                </button>

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-dark-950/80 border border-slate-800 text-[10px] font-mono text-cyan-300 font-bold uppercase backdrop-blur-md">
                    {clip.category}
                  </span>
                  {clip.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/80 text-dark-950 text-[10px] font-mono font-bold uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-dark-950/90 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                  {isVideo ? 'VIDEO' : 'PHOTO'}
                </div>
              </div>

              {/* Clip Metadata */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {clip.title}
                  </h4>
                  {clip.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {clip.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{clip.authorOrPlayer || 'Team'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-dark-850 text-slate-400 border border-slate-800 text-[11px]">
                      {clip.gamemode || 'PvP'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">{clip.date}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(clip)}
                        className="px-2.5 py-1.5 rounded-lg bg-dark-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-slate-800"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(clip.id, clip.title)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 text-xs border border-rose-500/20"
                        title="Delete Clip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload / Edit Modal */}
      {editingClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-dark-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-display font-black text-white">
                  {isCreating ? 'Publish Media Highlight / Clip' : 'Edit Media Highlight'}
                </h3>
              </div>
              <button
                onClick={() => setEditingClip(null)}
                className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Media Type & File / Embed Upload */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-cyan-400">
                    Media File or Embed Source
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingClip({ ...editingClip, mediaType: 'video' })}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                        editingClip.mediaType === 'video'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-dark-900 text-slate-500'
                      }`}
                    >
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingClip({ ...editingClip, mediaType: 'image' })}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                        editingClip.mediaType === 'image'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-dark-900 text-slate-500'
                      }`}
                    >
                      Photo / Screenshot
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* File Upload */}
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-cyan-400 rounded-xl bg-dark-900/60 cursor-pointer transition-colors group">
                    <Upload className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                    <span className="text-xs font-mono text-slate-300 group-hover:text-white">
                      {uploadingFile ? 'Uploading File...' : 'Upload Video / Photo File'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      MP4, WebM, MOV, PNG, JPG, GIF
                    </span>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                      disabled={uploadingFile}
                    />
                  </label>

                  {/* Thumbnail Upload (Optional) */}
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-purple-400 rounded-xl bg-dark-900/60 cursor-pointer transition-colors group">
                    <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-purple-400 mb-2 transition-colors" />
                    <span className="text-xs font-mono text-slate-300 group-hover:text-white">
                      Upload Custom Thumbnail
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WebP cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      disabled={uploadingFile}
                    />
                  </label>
                </div>

                {/* Direct Link or Embed URL input */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Or Direct URL / Video Embed (YouTube, Twitch, Discord CDN, etc.) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClip.url}
                    onChange={(e) => setEditingClip({ ...editingClip, url: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Clip Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClip.title}
                    onChange={(e) => setEditingClip({ ...editingClip, title: e.target.value })}
                    placeholder="e.g. 1v4 Crystal Anchor Clutch Grand Finals"
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={editingClip.category}
                    onChange={(e) => setEditingClip({ ...editingClip, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Athlete & Gamemode & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Athlete Credit (IGN)
                  </label>
                  <select
                    value={editingClip.authorOrPlayer}
                    onChange={(e) => setEditingClip({ ...editingClip, authorOrPlayer: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {players.map((p) => (
                      <option key={p.id} value={p.ign}>
                        {p.ign} ({p.role})
                      </option>
                    ))}
                    <option value="Loxxy Team">Loxxy Team (Official)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Gamemode / Bracket
                  </label>
                  <input
                    type="text"
                    value={editingClip.gamemode}
                    onChange={(e) => setEditingClip({ ...editingClip, gamemode: e.target.value })}
                    placeholder="Crystal PvP, Mace, Sword..."
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Clip Date
                  </label>
                  <input
                    type="date"
                    value={editingClip.date}
                    onChange={(e) => setEditingClip({ ...editingClip, date: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Description & Clutch Context
                </label>
                <textarea
                  rows={2}
                  value={editingClip.description || ''}
                  onChange={(e) => setEditingClip({ ...editingClip, description: e.target.value })}
                  placeholder="Describe the play, opponents, tournament context, or mechanics involved..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-clip"
                  checked={editingClip.featured}
                  onChange={(e) => setEditingClip({ ...editingClip, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-dark-850 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="featured-clip" className="text-xs font-mono text-slate-300">
                  Feature this highlight prominently in the media vault header carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingClip(null)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingFile}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm"
                >
                  {saving ? 'Publishing...' : isCreating ? 'Publish Media' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video / Photo Preview Lightbox */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-dark-950/80 hover:bg-dark-850 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {selectedPreview.mediaType === 'video' ? (
                selectedPreview.url.includes('youtube.com') || selectedPreview.url.includes('youtu.be') ? (
                  <iframe
                    src={selectedPreview.url.replace('watch?v=', 'embed/')}
                    title={selectedPreview.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={selectedPreview.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={selectedPreview.url}
                  alt={selectedPreview.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-6 bg-dark-900 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold">
                  {selectedPreview.category} • {selectedPreview.gamemode}
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-0.5">
                  {selectedPreview.title}
                </h3>
                {selectedPreview.description && (
                  <p className="text-xs text-slate-400 mt-1">{selectedPreview.description}</p>
                )}
              </div>
              <div className="text-right text-xs font-mono text-slate-400 shrink-0">
                <div>By <strong className="text-white">{selectedPreview.authorOrPlayer}</strong></div>
                <div className="text-[11px] text-slate-500 mt-1">{selectedPreview.date}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
