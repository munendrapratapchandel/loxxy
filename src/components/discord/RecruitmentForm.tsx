'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Swords } from 'lucide-react';

export default function RecruitmentForm() {
  const [formData, setFormData] = useState({
    ign: '',
    discordTag: '',
    age: '',
    region: 'NA East',
    mainGamemode: 'Sword PvP',
    pvpTierClaim: 'HT2',
    experience: '',
    clipsUrl: '',
    whyJoin: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
      // Trigger esports victory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#00f5ff', '#ec4899', '#fbbf24'],
        });
      } catch (e) {
        // confetti fallback
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-dark-900/90 border border-emerald-500/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-display font-black text-white">Application Transmitted!</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Your dossier for <strong>{formData.ign}</strong> has been logged in the Loxxy Team Command Center. Our captains will review your match history and ping you on Discord (<code className="text-cyan-400 font-mono">{formData.discordTag}</code>).
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              ign: '',
              discordTag: '',
              age: '',
              region: 'NA East',
              mainGamemode: 'Sword PvP',
              pvpTierClaim: 'HT2',
              experience: '',
              clipsUrl: '',
              whyJoin: '',
            });
          }}
          className="mt-4 px-6 py-2.5 rounded-xl bg-dark-850 border border-slate-700 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-cyan-400" />
            <span>Competitive Athlete Application</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct submission to Loxxy Clan Leadership
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
          Season 2026
        </span>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Minecraft IGN *
          </label>
          <input
            type="text"
            required
            value={formData.ign}
            onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
            placeholder="e.g. Professorx"
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Discord Tag *
          </label>
          <input
            type="text"
            required
            value={formData.discordTag}
            onChange={(e) => setFormData({ ...formData, discordTag: e.target.value })}
            placeholder="e.g. username#0001 or @handle"
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Age
          </label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="e.g. 17"
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Region
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="NA East">NA East</option>
            <option value="NA West">NA West</option>
            <option value="EU Central">EU Central</option>
            <option value="EU West">EU West</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="South America">South America</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Main Gamemode
          </label>
          <select
            value={formData.mainGamemode}
            onChange={(e) => setFormData({ ...formData, mainGamemode: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="Sword PvP">Sword PvP</option>
            <option value="Axe PvP">Axe PvP</option>
            <option value="Crystal PvP">Crystal PvP</option>
            <option value="Mace PvP">Mace PvP</option>
            <option value="UHC">UHC</option>
            <option value="Bedwars">Bedwars</option>
            <option value="Netherite Pot">Netherite Pot</option>
            <option value="Builder / Architect">Builder / Architect</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Self-Assessed PvP Tier Claim
          </label>
          <select
            value={formData.pvpTierClaim}
            onChange={(e) => setFormData({ ...formData, pvpTierClaim: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="HT1">HT1 (High Tier 1 - Elite)</option>
            <option value="HT2">HT2 (High Tier 2 - Master)</option>
            <option value="HT3">HT3 (High Tier 3 - Pro)</option>
            <option value="LT1">LT1 (Low Tier 1 - Challenger)</option>
            <option value="LT2">LT2 (Low Tier 2 - Contender)</option>
            <option value="LT3">LT3 (Low Tier 3 - Warrior)</option>
            <option value="Unranked">Unranked / Aspiring</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Clips / Montage / NameMC URL
          </label>
          <input
            type="url"
            value={formData.clipsUrl}
            onChange={(e) => setFormData({ ...formData, clipsUrl: e.target.value })}
            placeholder="https://youtube.com/... or Medal clip"
            className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
          Competitive Tournament & Clan Experience
        </label>
        <textarea
          rows={2}
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Past teams, tournament results, scrim leagues, or notable duel records..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
          Why do you want to join Loxxy?
        </label>
        <textarea
          rows={3}
          value={formData.whyJoin}
          onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
          placeholder="Tell leadership about your playstyle, goals, and dedication to competitive Minecraft..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-display font-bold text-sm uppercase tracking-wider shadow-glow-md hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Transmitting Dossier...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Roster Application</span>
          </>
        )}
      </button>
    </form>
  );
}
