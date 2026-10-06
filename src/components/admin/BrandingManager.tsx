'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Palette, Upload, Check, Save, Image as ImageIcon } from 'lucide-react';

interface BrandingManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export default function BrandingManager({ settings, onRefresh }: BrandingManagerProps) {
  const [form, setForm] = useState({
    siteName: settings.siteName,
    tagline: settings.tagline,
    description: settings.description,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    logoUrl: settings.logoUrl || '',
    faviconUrl: settings.faviconUrl || '',
    adminPin: settings.adminPin || 'loxxy2026',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    try {
      if (type === 'logo') setUploadingLogo(true);
      else setUploadingFavicon(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'uploads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'logo') {
          setForm((prev) => ({ ...prev, logoUrl: data.url }));
        } else {
          setForm((prev) => ({ ...prev, faviconUrl: data.url }));
        }
      }
    } catch (e: any) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploadingLogo(false);
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          <h3 className="text-base font-display font-bold text-white">Brand Identity & Cyber Themes</h3>
          <p className="text-xs text-slate-400">
            Customize team name, esports colors, slogans, logo, favicon, and admin security PIN
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-dark-900 border border-slate-800 space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Brand identity & security settings updated across the entire website!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Website / Team Name
            </label>
            <input
              type="text"
              required
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Team Tagline
            </label>
            <input
              type="text"
              required
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Meta / SEO Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-dark-850 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Logo & Favicon Image Upload Section */}
        <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase font-bold text-white">
              Official Logo & Favicon Management
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-slate-400">Team Logo PNG</label>
              <div className="flex items-center gap-3">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo"
                    className="w-12 h-12 rounded-xl object-contain bg-dark-900 border border-slate-700 p-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-dark-900 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-500">
                    SVG
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="/uploads/logo.png or https://..."
                    className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-dark-800 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-slate-400">Site Favicon (ICO / PNG)</label>
              <div className="flex items-center gap-3">
                {form.faviconUrl ? (
                  <img
                    src={form.faviconUrl}
                    alt="Favicon"
                    className="w-10 h-10 rounded-lg object-contain bg-dark-900 border border-slate-700 p-1"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-dark-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                    ICO
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={form.faviconUrl}
                    onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                    placeholder="/uploads/favicon.png"
                    className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-dark-800 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingFavicon ? 'Uploading...' : 'Upload Favicon File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'favicon')}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Management */}
        <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase font-bold text-white">
              Dynamic Esports Color Palette
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Primary Color (Purple)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Secondary (Cyan)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                />
                <input
                  type="text"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Accent (Neon Pink)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                />
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Security PIN Settings */}
        <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
          <label className="block text-xs font-mono uppercase text-slate-400">
            Admin Panel Security PIN / Passkey
          </label>
          <input
            type="text"
            required
            value={form.adminPin}
            onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
            placeholder="Enter passkey"
            className="w-full sm:w-80 px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 font-bold"
          />
          <p className="text-[11px] text-slate-500 font-mono">
            Used to unlock the Admin Command Center across browsers.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Brand Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
