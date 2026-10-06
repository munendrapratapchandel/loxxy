'use client';

import React, { useState } from 'react';
import { MediaItem, LoxxyDatabase } from '@/lib/types';
import { Upload, Copy, Check, Image as ImageIcon, Sparkles, Folder } from 'lucide-react';

interface MediaManagerProps {
  media: MediaItem[];
  db: LoxxyDatabase;
  onRefresh: () => void;
}

export default function MediaManager({ media, db, onRefresh }: MediaManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const isSkin = file.name.toLowerCase().endsWith('.png');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', isSkin ? 'skins' : 'uploads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const newItem: MediaItem = {
          id: `media-${Date.now()}`,
          name: file.name,
          url: data.url,
          category: isSkin ? 'skin' : 'banner',
          uploadedAt: new Date().toISOString().split('T')[0],
        };

        const updated = [...(db.mediaLibrary || []), newItem];
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...db, mediaLibrary: updated }),
        });
        onRefresh();
      }
    } catch (e: any) {
      alert('Upload error: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = (media || []).filter((m) =>
    categoryFilter === 'all' ? true : m.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-display font-bold text-white">Media Assets & Skin Vault</h3>
          <p className="text-xs text-slate-400">
            Upload raw Minecraft 2D skin PNGs, logos, and tournament banners to use across the site
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer shadow-glow-sm">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'skin', 'banner', 'logo'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
              categoryFilter === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between group transition-all"
          >
            <div className="relative aspect-square rounded-xl bg-dark-950 border border-slate-850 p-2 flex items-center justify-center overflow-hidden mb-2">
              <img
                src={item.url}
                alt={item.name}
                className="max-h-full max-w-full object-contain pixelated"
              />
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-900/90 text-cyan-300 border border-slate-800 uppercase">
                {item.category}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-white truncate" title={item.name}>
                {item.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {item.uploadedAt}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(item.url, item.id)}
              className="mt-3 w-full py-1.5 rounded-lg bg-dark-850 hover:bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
