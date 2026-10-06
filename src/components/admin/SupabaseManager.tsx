'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  KeyRound,
  Check,
  AlertCircle,
  RefreshCw,
  Copy,
  Zap,
  Server,
  Cloud,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Code2,
  ArrowRight,
  Send,
  MessageSquare,
  Radio,
  ExternalLink
} from 'lucide-react';

interface SupabaseConfigData {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    databaseUrl?: string;
    enabled: boolean;
  };
  integrations: {
    discordWebhookUrl?: string;
    discordBotToken?: string;
    youtubeApiKey?: string;
    twitchClientId?: string;
    twitchClientSecret?: string;
  };
  security: {
    hasCustomPin: boolean;
  };
}

export default function SupabaseManager({ onRefresh }: { onRefresh: () => void }) {
  const [config, setConfig] = useState<SupabaseConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');

  // Third party
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [twitchClientId, setTwitchClientId] = useState('');
  const [newAdminPasskey, setNewAdminPasskey] = useState('');

  // Visibility toggles
  const [showAnon, setShowAnon] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showDbUrl, setShowDbUrl] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  // Test connection state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    latencyMs?: number;
    message: string;
  } | null>(null);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    syncedTables?: string[];
    errors?: string[];
  } | null>(null);
  const [creatingTables, setCreatingTables] = useState(false);

  // SQL schema tab
  const [sqlSchema, setSqlSchema] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/config?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();

      let effectiveUrl = data?.config?.supabase?.url || '';
      let effectiveAnonKey = data?.config?.supabase?.anonKey || '';
      let effectiveServiceRoleKey = data?.config?.supabase?.serviceRoleKey || '';
      let effectiveDatabaseUrl = data?.config?.supabase?.databaseUrl || '';

      if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('loxxy_supabase_url') || '';
        const storedAnonKey = localStorage.getItem('loxxy_supabase_anon_key') || '';
        const storedServiceKey = localStorage.getItem('loxxy_supabase_service_key') || '';
        const storedDbUrl = localStorage.getItem('loxxy_supabase_db_url') || '';

        if (!effectiveUrl && storedUrl) effectiveUrl = storedUrl;
        if (!effectiveAnonKey && storedAnonKey) effectiveAnonKey = storedAnonKey;
        if (!effectiveServiceRoleKey && storedServiceKey) effectiveServiceRoleKey = storedServiceKey;
        if (!effectiveDatabaseUrl && storedDbUrl) effectiveDatabaseUrl = storedDbUrl;

        // Auto self-heal server memory if localStorage has keys but server returned empty
        if ((!data?.config?.supabase?.url && effectiveUrl) || (!data?.config?.supabase?.anonKey && effectiveAnonKey)) {
          fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supabase: {
                url: effectiveUrl,
                anonKey: effectiveAnonKey,
                serviceRoleKey: effectiveServiceRoleKey,
                databaseUrl: effectiveDatabaseUrl,
              },
            }),
          }).catch(() => {});
        }
      }

      if (data.success && data.config) {
        setConfig(data.config);
      }
      setUrl(effectiveUrl);
      setAnonKey(effectiveAnonKey);
      setServiceRoleKey(effectiveServiceRoleKey);
      setDatabaseUrl(effectiveDatabaseUrl);
      setDiscordWebhook(data?.config?.integrations?.discordWebhookUrl || '');
      setYoutubeApiKey(data?.config?.integrations?.youtubeApiKey || '');
      setTwitchClientId(data?.config?.integrations?.twitchClientId || '');
    } catch (e) {
      console.error('Failed to load config:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSqlSchema = async () => {
    try {
      const res = await fetch(`/api/supabase/schema?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setSqlSchema(data.sql);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchSqlSchema();
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/supabase/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key: serviceRoleKey || anonKey }),
      });
      const data = await res.json();
      setTestResult({
        connected: data.connected,
        latencyMs: data.latencyMs,
        message: data.message,
      });
    } catch (err: any) {
      setTestResult({
        connected: false,
        message: err.message || 'Test connection failed',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    // Save to localStorage immediately so keys are never lost in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('loxxy_supabase_url', url.trim());
      localStorage.setItem('loxxy_supabase_anon_key', anonKey.trim());
      localStorage.setItem('loxxy_supabase_service_key', serviceRoleKey.trim());
      localStorage.setItem('loxxy_supabase_db_url', databaseUrl.trim());
    }

    try {
      const payload: any = {
        supabase: {
          url: url.trim(),
          anonKey: anonKey.trim(),
          serviceRoleKey: serviceRoleKey.trim(),
          databaseUrl: databaseUrl.trim(),
          enabled: !!(url.trim() && (anonKey.trim() || serviceRoleKey.trim())),
        },
        integrations: {
          discordWebhookUrl: discordWebhook.trim(),
          youtubeApiKey: youtubeApiKey.trim(),
          twitchClientId: twitchClientId.trim(),
        },
      };

      if (newAdminPasskey.trim()) {
        payload.security = {
          adminPin: newAdminPasskey.trim(),
        };
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
        fetchConfig();
        onRefresh();
      } else {
        alert(data.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePushToSupabase = async () => {
    if (!url.trim()) {
      alert('Please enter and save your Supabase Project URL first.');
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
    } catch (e: any) {
      setSyncResult({
        success: false,
        errors: [e.message || 'Sync failed'],
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoCreateTables = async () => {
    if (!databaseUrl && !url) {
      alert('Please enter your Supabase Project URL or PostgreSQL Connection String first.');
      return;
    }
    setCreatingTables(true);
    try {
      const res = await fetch('/api/supabase/init-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl }),
      });
      const data = await res.json();
      if (data.success) {
        alert('All Loxxy tables and security policies created successfully in PostgreSQL! Now syncing data...');
        await handlePushToSupabase();
      } else {
        alert(data.error || 'Failed to auto-create tables. Please run the SQL schema in Supabase SQL Editor.');
      }
    } catch (e: any) {
      alert(e.message || 'Error creating tables');
    } finally {
      setCreatingTables(false);
    }
  };

  const handleCopySql = () => {
    if (!sqlSchema) return;
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
        <span>Loading Supabase & Keys configuration...</span>
      </div>
    );
  }

  const isConfigured = !!(url && (anonKey || serviceRoleKey));

  return (
    <div className="space-y-8">
      {/* Top Banner / Health Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-900 via-dark-900 to-cyan-950/30 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  Supabase & PostgreSQL Cloud Control
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                      isConfigured
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {isConfigured ? 'Supabase Configured' : 'Awaiting Project Credentials'}
                  </span>

                  {testResult && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                        testResult.connected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {testResult.connected
                        ? `Live Ping: ${testResult.latencyMs}ms`
                        : 'Connection Error'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Connect Loxxy directly to your <strong>Supabase</strong> project. Store athletes, custom PvP roles, highlight clips, tournament fixtures, and settings in cloud PostgreSQL with instant live sync and automatic failover.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleSaveCredentials}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Keys'}</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testingConnection || !url}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono font-bold uppercase text-slate-200 border border-slate-700 transition-all"
            >
              <Radio className={`w-4 h-4 ${testingConnection ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
              <span>{testingConnection ? 'Testing Ping...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handlePushToSupabase}
              disabled={syncing || !isConfigured}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-glow-sm transition-all"
            >
              <Zap className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Pushing Data...' : 'Sync to Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Feedback Banner */}
        {testResult && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs font-mono flex items-center justify-between ${
              testResult.connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
            {testResult.latencyMs !== undefined && (
              <span className="text-[11px] opacity-80">{testResult.latencyMs} ms response</span>
            )}
          </div>
        )}

        {/* Sync Result Banner */}
        {syncResult && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-xs font-mono space-y-2 ${
              syncResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {syncResult.success
                  ? 'All data successfully synchronized to Supabase PostgreSQL!'
                  : 'Sync completed with warnings:'}
              </span>
            </div>
            {syncResult.syncedTables && syncResult.syncedTables.length > 0 && (
              <div className="text-[11px] text-slate-300">
                Synchronized tables:{' '}
                <span className="text-cyan-300 font-bold">
                  {syncResult.syncedTables.join(', ')}
                </span>
              </div>
            )}
            {syncResult.errors && syncResult.errors.length > 0 && (
              <div className="text-[11px] text-rose-400 space-y-1">
                {syncResult.errors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}

            {syncResult.errors &&
              syncResult.errors.some(
                (e) =>
                  e.includes('Could not find the table') || e.includes('schema cache')
              ) && (
                <div className="mt-3 p-4 rounded-xl bg-dark-900 border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Why this happens & 1-Click Fix:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Your Supabase project is active, but the database tables (<code className="text-cyan-300">loxxy_settings</code>, <code className="text-cyan-300">loxxy_players</code>, etc.) haven&apos;t been created in PostgreSQL yet.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {databaseUrl ? (
                      <button
                        type="button"
                        onClick={handleAutoCreateTables}
                        disabled={creatingTables}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{creatingTables ? 'Creating Tables...' : 'Auto-Create Tables via Postgres'}</span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="px-3.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-xs text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema for Supabase'}</span>
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5"
                    >
                      <span>Open Supabase Dashboard</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-dark-950 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                    <div><strong className="text-white">Fastest Fix in Supabase Dashboard (10 seconds):</strong></div>
                    <div>1. Click <strong>Copy SQL Schema for Supabase</strong> above.</div>
                    <div>2. Go to your Supabase project → Click <strong>SQL Editor</strong> on the left (looks like <code>&gt;_</code>).</div>
                    <div>3. Click <strong>New query</strong>, paste (Ctrl+V), and click <strong>RUN</strong>.</div>
                    <div>4. Return here and click <strong>Sync to Supabase</strong> to upload all your athletes &amp; data!</div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveCredentials} className="space-y-8">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Credentials and configuration updated successfully!</span>
          </div>
        )}

        {/* Section 1: Supabase Credentials */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h4 className="font-display font-bold text-white text-base">
                Supabase Project API Credentials
              </h4>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-glow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Keys'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Supabase Project URL *
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzprojectid.supabase.co"
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Found in your Supabase Dashboard: <code>Project Settings → Configuration → API → Project URL</code>
              </p>
            </div>

            {/* Anon Public Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Supabase Anon (Public) Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowAnon(!showAnon)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {showAnon ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showAnon ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <input
                type={showAnon ? 'text' : 'password'}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Found in: <code>Project Settings → API → Project API Keys → anon (public)</code>
              </p>
            </div>

            {/* Service Role Secret Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Supabase Service Role (Secret) Key *
                </label>
                <button
                  type="button"
                  onClick={() => setShowService(!showService)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {showService ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showService ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <input
                type={showService ? 'text' : 'password'}
                value={serviceRoleKey}
                onChange={(e) => setServiceRoleKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-purple-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Found in: <code>Project Settings → API → service_role (secret)</code>. Needed to bypass RLS for table sync.
              </p>
            </div>

            {/* Direct PostgreSQL Connection URI */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Direct PostgreSQL Connection String (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowDbUrl(!showDbUrl)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {showDbUrl ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showDbUrl ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <input
                type={showDbUrl ? 'text' : 'password'}
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                placeholder="postgresql://postgres:[password]@db.xyzprojectid.supabase.co:5432/postgres"
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Found in: <code>Project Settings → Database → Connection String → URI</code>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Third Party Integrations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cloud className="w-5 h-5 text-purple-400" />
            <h4 className="font-display font-bold text-white text-base">
              Third-Party Integrations & Webhooks
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discord Webhook */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Discord Tryouts & Alerts Webhook URL
              </label>
              <input
                type="text"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Receives tryout submissions and tournament fixture alerts automatically in your Discord staff channel.
              </p>
            </div>

            {/* YouTube API Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                YouTube Data API v3 Key (Optional)
              </label>
              <input
                type="text"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                For fetching tournament VOD metadata and player montages automatically.
              </p>
            </div>

            {/* Twitch Client ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Twitch Client ID (Optional)
              </label>
              <input
                type="text"
                value={twitchClientId}
                onChange={(e) => setTwitchClientId(e.target.value)}
                placeholder="gp762nv..."
                className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                For live roster stream detection on the homepage.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Admin Master Passkey Update */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Lock className="w-5 h-5 text-amber-400" />
            <h4 className="font-display font-bold text-white text-base">
              Admin Command Center Security Passkey
            </h4>
          </div>

          <div className="max-w-md space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Update Admin Passkey (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                {showPasskey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPasskey ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <input
              type={showPasskey ? 'text' : 'password'}
              value={newAdminPasskey}
              onChange={(e) => setNewAdminPasskey(e.target.value)}
              placeholder="Enter new passkey (Leave blank to keep existing)"
              className="w-full px-4 py-3 bg-dark-850 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              Used to unlock the Admin Command Gate at <code>/admin</code>.
            </p>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-end gap-4 p-4 bg-dark-900 rounded-2xl border border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-glow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Config...' : 'Apply & Save All Keys'}</span>
          </button>
        </div>
      </form>

      {/* SQL Setup Schema Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h4 className="font-display font-bold text-white text-base">
              Supabase PostgreSQL Database Schema
            </h4>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-mono text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          If you have a fresh Supabase project, navigate to <strong>Supabase Dashboard → SQL Editor</strong>, paste this script, and click <strong>RUN</strong> to create all tables and public read policies.
        </p>

        <div className="relative">
          <pre className="p-4 rounded-2xl bg-dark-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
            {sqlSchema}
          </pre>
        </div>
      </div>
    </div>
  );
}
