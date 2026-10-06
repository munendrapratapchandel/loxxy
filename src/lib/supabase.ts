import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getAppConfig } from './config';
import { LoxxyDatabase, Player, TeamRole, ClipItem, TierDefinition, MatchItem, Achievement } from './types';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabase(): SupabaseClient | null {
  const config = getAppConfig();
  const url = config.supabase.url;
  // Prefer serviceRoleKey on the backend for administrative table access, fallback to anonKey
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;

  if (!url || !key) {
    return null;
  }

  // Reuse cached client if credentials haven't changed
  if (cachedClient && lastUsedUrl === url && lastUsedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{
  connected: boolean;
  latencyMs?: number;
  message: string;
  url: string;
  hasServiceRole: boolean;
}> {
  const config = getAppConfig();
  const url = customUrl || config.supabase.url;
  const key = customKey || config.supabase.serviceRoleKey || config.supabase.anonKey;

  if (!url) {
    return {
      connected: false,
      message: 'Supabase Project URL is not configured.',
      url: '',
      hasServiceRole: false,
    };
  }

  if (!key) {
    return {
      connected: false,
      message: 'Supabase Key (Anon or Service Role) is missing.',
      url,
      hasServiceRole: false,
    };
  }

  const startTime = Date.now();
  try {
    const response = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok || response.status === 200 || response.status === 404 || response.status === 401) {
      if (response.status === 401) {
        return {
          connected: false,
          latencyMs,
          message: 'Authentication failed. Please verify your Supabase API Key.',
          url,
          hasServiceRole: false,
        };
      }

      return {
        connected: true,
        latencyMs,
        message: 'Successfully connected to Supabase backend!',
        url,
        hasServiceRole: !!(customKey ? customKey.length > 50 : config.supabase.serviceRoleKey),
      };
    } else {
      return {
        connected: false,
        latencyMs,
        message: `HTTP Status ${response.status}: ${response.statusText}`,
        url,
        hasServiceRole: false,
      };
    }
  } catch (error: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      message: `Connection error: ${error.message || 'Network request failed'}`,
      url,
      hasServiceRole: false,
    };
  }
}

/**
 * Pulls all database records from Supabase tables and reconstructs the complete LoxxyDatabase.
 * Includes a strict timeout guard to prevent public pages from hanging on network stalls.
 */
export async function pullAllFromSupabase(timeoutMs: number = 2500): Promise<LoxxyDatabase | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const pullTask = async (): Promise<LoxxyDatabase | null> => {
    try {
      // 1. Try pulling full database snapshot from loxxy_settings (single roundtrip ~100ms)
      try {
        const { data: snapshotRows, error: snapshotErr } = await supabase
          .from('loxxy_settings')
          .select('*')
          .eq('id', 'loxxy_full_db')
          .limit(1);

        if (!snapshotErr && snapshotRows && snapshotRows.length > 0 && snapshotRows[0].data) {
          const snap = snapshotRows[0].data as LoxxyDatabase;
          if (snap.players && snap.players.length > 0 && snap.settings) {
            return snap;
          }
        }
      } catch (_) {}

    // 2. Fallback: Pull from individual tables in PARALLEL if snapshot wasn't available
    const [
      settingsRes,
      playersRes,
      rolesRes,
      clipsRes,
      tiersRes,
      matchesRes,
      achievementsRes,
    ] = await Promise.all([
      supabase.from('loxxy_settings').select('*').eq('id', 'loxxy_global').limit(1),
      supabase.from('loxxy_players').select('*'),
      supabase.from('loxxy_roles').select('*'),
      supabase.from('loxxy_clips').select('*'),
      supabase.from('loxxy_tiers').select('*'),
      supabase.from('loxxy_matches').select('*'),
      supabase.from('loxxy_achievements').select('*'),
    ]);

    const resultDb: Partial<LoxxyDatabase> = {};

    if (settingsRes.data && settingsRes.data.length > 0 && settingsRes.data[0].data) {
      resultDb.settings = settingsRes.data[0].data;
    }

    if (playersRes.data && playersRes.data.length > 0) {
      resultDb.players = playersRes.data.map((r: any): Player => ({
        id: r.id,
        ign: r.ign,
        name: r.name,
        role: r.role || 'Member',
        skinUrl: r.skin_url || '/skins/steve.png',
        avatarUrl: r.avatar_url || `https://mc-heads.net/avatar/${r.ign}/100`,
        joinDate: r.join_date || '',
        status: r.status || 'Active',
        featured: !!r.featured,
        region: r.region || 'Global',
        mainGamemode: r.main_gamemode || 'Mace',
        bio: r.bio || '',
        powerIndex: Number(r.power_index) || 0,
        pvpTiers: r.pvp_tiers || {},
        skills: r.skills || {},
        socials: r.socials || {},
      }));
    }

    if (rolesRes.data && rolesRes.data.length > 0) {
      resultDb.roles = rolesRes.data.map((r: any): TeamRole => ({
        id: r.id,
        name: r.name,
        color: r.color || '#00f5ff',
        badgeStyle: r.badge_style || '',
        description: r.description || '',
        isDefault: !!r.is_default,
      }));
    }

    if (clipsRes.data && clipsRes.data.length > 0) {
      resultDb.clips = clipsRes.data.map((c: any): ClipItem => ({
        id: c.id,
        title: c.title,
        category: c.category || 'Tournament Clutch',
        mediaType: c.media_type || 'video',
        url: c.url,
        thumbnailUrl: c.thumbnail_url || '',
        authorOrPlayer: c.author_or_player || '',
        gamemode: c.gamemode || '',
        date: c.date || '',
        description: c.description || '',
        featured: !!c.featured,
      }));
    }

    if (tiersRes.data && tiersRes.data.length > 0) {
      resultDb.tiers = tiersRes.data.map((t: any): TierDefinition => ({
        id: t.id,
        name: t.name,
        badgeTitle: t.badge_title,
        type: t.type,
        level: t.level,
        color: t.color,
        glowColor: t.glow_color,
        badgeGradient: t.badge_gradient,
        description: t.description,
      }));
    }

    if (matchesRes.data && matchesRes.data.length > 0) {
      resultDb.matches = matchesRes.data.map((m: any): MatchItem => ({
        id: m.id,
        opponent: m.opponent,
        opponentTag: m.opponent_tag || '',
        date: m.date,
        tournament: m.tournament,
        gamemode: m.gamemode,
        status: m.status,
        result: m.result || null,
        score: m.score || '',
        vodUrl: m.vod_url || '',
      }));
    }

    if (achievementsRes.data && achievementsRes.data.length > 0) {
      resultDb.achievements = achievementsRes.data.map((a: any): Achievement => ({
        id: a.id,
        title: a.title,
        description: a.description,
        date: a.date,
        category: a.category,
        result: a.result,
        imageUrl: a.image_url,
        linkedPlayers: a.linked_players || [],
      }));
    }

    if (resultDb.settings && resultDb.players && resultDb.players.length > 0) {
      return resultDb as LoxxyDatabase;
    }

    return null;
  } catch (err) {
    console.warn('Could not pull database from Supabase:', err);
    return null;
  }
};

  const timeoutTask = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });

  return Promise.race([pullTask(), timeoutTask]);
}

/**
 * Pushes all local database entities (players, custom roles, clips, tiers, matches, settings) to Supabase tables.
 */
export async function pushAllToSupabase(db: LoxxyDatabase): Promise<{
  success: boolean;
  syncedTables: string[];
  errors: string[];
}> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      syncedTables: [],
      errors: ['Supabase client not initialized. Configure your Project URL and Key first.'],
    };
  }

  const syncedTables: string[] = [];
  const errors: string[] = [];

  // Helper upsert
  const safeUpsert = async (table: string, records: any[]) => {
    if (!records || records.length === 0) return;
    try {
      const { error } = await supabase.from(table).upsert(records, { onConflict: 'id' });
      if (error) {
        errors.push(`Table "${table}": ${error.message}`);
      } else {
        syncedTables.push(table);
      }
    } catch (e: any) {
      errors.push(`Table "${table}": ${e.message}`);
    }
  };

  // Helper delete orphans
  const syncDeletions = async (table: string, activeIds: string[]) => {
    try {
      const { data: existing } = await supabase.from(table).select('id');
      if (existing && existing.length > 0) {
        const toDelete = existing.map((r: any) => r.id).filter((id: string) => !activeIds.includes(id));
        if (toDelete.length > 0) {
          await supabase.from(table).delete().in('id', toDelete);
        }
      }
    } catch (_) {}
  };

  // 1. Snapshot store in loxxy_settings as backup (id='loxxy_full_db')
  try {
    const { error: fullDbErr } = await supabase
      .from('loxxy_settings')
      .upsert([{ id: 'loxxy_full_db', data: db, updated_at: new Date().toISOString() }], {
        onConflict: 'id',
      });
    if (!fullDbErr) syncedTables.push('loxxy_settings (full snapshot)');
  } catch (_) {}

  // 2. Settings (store as single row with id='loxxy_global')
  try {
    const { error } = await supabase
      .from('loxxy_settings')
      .upsert([{ id: 'loxxy_global', data: db.settings, updated_at: new Date().toISOString() }], {
        onConflict: 'id',
      });
    if (error) errors.push(`Settings: ${error.message}`);
    else syncedTables.push('loxxy_settings');
  } catch (e: any) {
    errors.push(`Settings: ${e.message}`);
  }

  // 3. Players
  if (db.players && db.players.length > 0) {
    await safeUpsert(
      'loxxy_players',
      db.players.map((p) => ({
        id: p.id,
        ign: p.ign,
        name: p.name,
        role: p.role,
        skin_url: p.skinUrl,
        avatar_url: p.avatarUrl,
        join_date: p.joinDate,
        status: p.status,
        featured: p.featured,
        region: p.region,
        main_gamemode: p.mainGamemode,
        bio: p.bio,
        power_index: p.powerIndex || 0,
        pvp_tiers: p.pvpTiers,
        skills: p.skills,
        socials: p.socials,
        updated_at: new Date().toISOString(),
      }))
    );
  }

  // 4. Roles
  if (db.roles && db.roles.length > 0) {
    await safeUpsert(
      'loxxy_roles',
      db.roles.map((r) => ({
        id: r.id,
        name: r.name,
        color: r.color,
        badge_style: r.badgeStyle || '',
        description: r.description || '',
        updated_at: new Date().toISOString(),
      }))
    );
  }

  // 5. Clips
  if (db.clips && db.clips.length > 0) {
    await safeUpsert(
      'loxxy_clips',
      db.clips.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        media_type: c.mediaType,
        url: c.url,
        thumbnail_url: c.thumbnailUrl || '',
        author_or_player: c.authorOrPlayer || '',
        gamemode: c.gamemode || '',
        date: c.date,
        description: c.description || '',
        featured: c.featured || false,
        updated_at: new Date().toISOString(),
      }))
    );
  }

  // 6. Tiers
  if (db.tiers && db.tiers.length > 0) {
    await safeUpsert(
      'loxxy_tiers',
      db.tiers.map((t) => ({
        id: t.id,
        name: t.name,
        badge_title: t.badgeTitle,
        type: t.type,
        level: t.level,
        color: t.color,
        glow_color: t.glowColor,
        badge_gradient: t.badgeGradient,
        description: t.description,
      }))
    );
  }

  // 7. Matches
  if (db.matches && db.matches.length > 0) {
    await safeUpsert(
      'loxxy_matches',
      db.matches.map((m) => ({
        id: m.id,
        opponent: m.opponent,
        opponent_tag: m.opponentTag || '',
        date: m.date,
        tournament: m.tournament,
        gamemode: m.gamemode,
        status: m.status,
        result: m.result || null,
        score: m.score || '',
        vod_url: m.vodUrl || '',
      }))
    );
  }

  // 8. Achievements
  if (db.achievements && db.achievements.length > 0) {
    await safeUpsert(
      'loxxy_achievements',
      db.achievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        date: a.date,
        category: a.category,
        result: a.result,
        image_url: a.imageUrl,
        linked_players: a.linkedPlayers,
      }))
    );
  }

  // Sync deletions across tables
  if (db.players) await syncDeletions('loxxy_players', db.players.map((p) => p.id));
  if (db.roles) await syncDeletions('loxxy_roles', db.roles.map((r) => r.id));
  if (db.clips) await syncDeletions('loxxy_clips', db.clips.map((c) => c.id));
  if (db.tiers) await syncDeletions('loxxy_tiers', db.tiers.map((t) => t.id));
  if (db.matches) await syncDeletions('loxxy_matches', db.matches.map((m) => m.id));
  if (db.achievements) await syncDeletions('loxxy_achievements', db.achievements.map((a) => a.id));

  return {
    success: errors.length === 0,
    syncedTables,
    errors,
  };
}

/**
 * Generates ready-to-run PostgreSQL DDL SQL to create all Loxxy tables in Supabase SQL Editor.
 */
export function getSupabaseSQLSchema(): string {
  return `-- ==========================================
-- LOXXY MINECRAFT ESPORTS - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.loxxy_settings (
  id TEXT PRIMARY KEY DEFAULT 'loxxy_global',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Custom Team Roles Table
CREATE TABLE IF NOT EXISTS public.loxxy_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#00f5ff',
  badge_style TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Athletes / Players Table
CREATE TABLE IF NOT EXISTS public.loxxy_players (
  id TEXT PRIMARY KEY,
  ign TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Member',
  skin_url TEXT NOT NULL DEFAULT '/skins/steve.png',
  avatar_url TEXT,
  join_date TEXT,
  status TEXT DEFAULT 'Active',
  featured BOOLEAN DEFAULT false,
  region TEXT DEFAULT 'Global',
  main_gamemode TEXT DEFAULT 'Sword PvP',
  bio TEXT,
  power_index NUMERIC DEFAULT 0,
  pvp_tiers JSONB DEFAULT '{}'::jsonb,
  skills JSONB DEFAULT '{}'::jsonb,
  socials JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Clips & Media Highlights Table
CREATE TABLE IF NOT EXISTS public.loxxy_clips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tournament Clutch',
  media_type TEXT NOT NULL DEFAULT 'video',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  author_or_player TEXT,
  gamemode TEXT,
  date TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. PvP Tiers Definition Table
CREATE TABLE IF NOT EXISTS public.loxxy_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  badge_title TEXT,
  type TEXT,
  level INT,
  color TEXT,
  glow_color TEXT,
  badge_gradient TEXT,
  description TEXT
);

-- 6. Matches & Fixtures Table
CREATE TABLE IF NOT EXISTS public.loxxy_matches (
  id TEXT PRIMARY KEY,
  opponent TEXT NOT NULL,
  opponent_tag TEXT,
  date TEXT NOT NULL,
  tournament TEXT NOT NULL,
  gamemode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  result TEXT,
  score TEXT,
  vod_url TEXT
);

-- 7. Achievements & Trophies Table
CREATE TABLE IF NOT EXISTS public.loxxy_achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  category TEXT,
  result TEXT,
  image_url TEXT,
  linked_players JSONB DEFAULT '[]'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.loxxy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loxxy_achievements ENABLE ROW LEVEL SECURITY;

-- Allow full access for both Anon API Key & Service Role Key
DROP POLICY IF EXISTS "Public Access Settings" ON public.loxxy_settings;
CREATE POLICY "Public Access Settings" ON public.loxxy_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Roles" ON public.loxxy_roles;
CREATE POLICY "Public Access Roles" ON public.loxxy_roles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Players" ON public.loxxy_players;
CREATE POLICY "Public Access Players" ON public.loxxy_players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Clips" ON public.loxxy_clips;
CREATE POLICY "Public Access Clips" ON public.loxxy_clips FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Tiers" ON public.loxxy_tiers;
CREATE POLICY "Public Access Tiers" ON public.loxxy_tiers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Matches" ON public.loxxy_matches;
CREATE POLICY "Public Access Matches" ON public.loxxy_matches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Achievements" ON public.loxxy_achievements;
CREATE POLICY "Public Access Achievements" ON public.loxxy_achievements FOR ALL USING (true) WITH CHECK (true);
`;
}
