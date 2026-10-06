import fs from 'fs';
import path from 'path';
import os from 'os';

export interface AppConfig {
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
    adminPin: string;
  };
}

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');
const TMP_CONFIG_PATH = path.join(os.tmpdir(), 'loxxy_config.json');
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const TMP_DB_PATH = path.join(os.tmpdir(), 'loxxy_db.json');

const DEFAULT_CONFIG: AppConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    databaseUrl: process.env.DATABASE_URL || '',
    enabled: false,
  },
  integrations: {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    discordBotToken: process.env.DISCORD_BOT_TOKEN || '',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
    twitchClientId: process.env.TWITCH_CLIENT_ID || '',
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET || '',
  },
  security: {
    adminPin: process.env.ADMIN_PIN || 'loxxy@2580',
  },
};

// Global memory cache to prevent loss across serverless invocations within the same container
const globalRef = globalThis as unknown as { __loxxy_config?: AppConfig };

export function getAppConfig(): AppConfig {
  if (globalRef.__loxxy_config && (globalRef.__loxxy_config.supabase.url || globalRef.__loxxy_config.supabase.anonKey)) {
    return mergeWithEnv(globalRef.__loxxy_config);
  }

  // 1. Try reading from tmp config first (most recent serverless update)
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const content = fs.readFileSync(TMP_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(content) as AppConfig;
      if (parsed?.supabase?.url || parsed?.supabase?.anonKey) {
        const merged = mergeWithEnv(parsed);
        globalRef.__loxxy_config = merged;
        return merged;
      }
    }
  } catch (_) {}

  // 2. Try reading from db.json settings backup
  try {
    const dbFile = fs.existsSync(TMP_DB_PATH) ? TMP_DB_PATH : (fs.existsSync(DB_PATH) ? DB_PATH : null);
    if (dbFile) {
      const dbContent = fs.readFileSync(dbFile, 'utf-8');
      const parsedDb = JSON.parse(dbContent);
      if (parsedDb?.settings?.supabaseConfig?.url) {
        const merged = mergeWithEnv({
          ...DEFAULT_CONFIG,
          supabase: parsedDb.settings.supabaseConfig,
        });
        globalRef.__loxxy_config = merged;
        return merged;
      }
    }
  } catch (_) {}

  // 3. Try reading from repository file (src/data/config.json)
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(content) as AppConfig;
      const merged = mergeWithEnv(parsed);
      globalRef.__loxxy_config = merged;
      return merged;
    }
  } catch (_) {}

  // 4. Fall back to environment defaults
  const fallback = mergeWithEnv(DEFAULT_CONFIG);
  globalRef.__loxxy_config = fallback;
  return fallback;
}

function mergeWithEnv(base: AppConfig): AppConfig {
  const url = base.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = base.supabase?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceRoleKey = base.supabase?.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const databaseUrl = base.supabase?.databaseUrl || process.env.DATABASE_URL || '';
  const hasKeys = !!(url && (anonKey || serviceRoleKey));

  return {
    supabase: {
      ...DEFAULT_CONFIG.supabase,
      ...(base.supabase || {}),
      url,
      anonKey,
      serviceRoleKey,
      databaseUrl,
      enabled: hasKeys ? (base.supabase?.enabled ?? true) : false,
    },
    integrations: {
      ...DEFAULT_CONFIG.integrations,
      ...(base.integrations || {}),
      discordWebhookUrl: base.integrations?.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL || '',
      discordBotToken: base.integrations?.discordBotToken || process.env.DISCORD_BOT_TOKEN || '',
      youtubeApiKey: base.integrations?.youtubeApiKey || process.env.YOUTUBE_API_KEY || '',
      twitchClientId: base.integrations?.twitchClientId || process.env.TWITCH_CLIENT_ID || '',
      twitchClientSecret: base.integrations?.twitchClientSecret || process.env.TWITCH_CLIENT_SECRET || '',
    },
    security: {
      ...DEFAULT_CONFIG.security,
      ...(base.security || {}),
      adminPin: base.security?.adminPin || process.env.ADMIN_PIN || 'loxxy@2580',
    },
  };
}

export function saveAppConfig(partial: Partial<AppConfig>): AppConfig {
  const current = getAppConfig();
  const updated: AppConfig = {
    supabase: {
      ...current.supabase,
      ...(partial.supabase || {}),
    },
    integrations: {
      ...current.integrations,
      ...(partial.integrations || {}),
    },
    security: {
      ...current.security,
      ...(partial.security || {}),
    },
  };

  if (updated.supabase.url && (updated.supabase.anonKey || updated.supabase.serviceRoleKey)) {
    updated.supabase.enabled = true;
  }

  // Save into memory cache
  globalRef.__loxxy_config = updated;

  // 1. Save to tmp storage
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (_) {}

  // 2. Save into db.json backup (TMP_DB_PATH and DB_PATH)
  try {
    const dbFile = fs.existsSync(TMP_DB_PATH) ? TMP_DB_PATH : (fs.existsSync(DB_PATH) ? DB_PATH : null);
    if (dbFile) {
      const content = fs.readFileSync(dbFile, 'utf-8');
      const parsedDb = JSON.parse(content);
      if (parsedDb && parsedDb.settings) {
        parsedDb.settings.supabaseConfig = updated.supabase;
        fs.writeFileSync(dbFile, JSON.stringify(parsedDb, null, 2), 'utf-8');
      }
    }
  } catch (_) {}

  // 3. Try saving to repository path
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    const envPath = path.join(process.cwd(), '.env.local');
    const envLines = [
      `NEXT_PUBLIC_SUPABASE_URL="${updated.supabase.url}"`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY="${updated.supabase.anonKey}"`,
      `SUPABASE_SERVICE_ROLE_KEY="${updated.supabase.serviceRoleKey}"`,
      `DATABASE_URL="${updated.supabase.databaseUrl || ''}"`,
      `DISCORD_WEBHOOK_URL="${updated.integrations.discordWebhookUrl || ''}"`,
      `YOUTUBE_API_KEY="${updated.integrations.youtubeApiKey || ''}"`,
    ];
    fs.writeFileSync(envPath, envLines.join('\n'), 'utf-8');
  } catch (_) {}

  return updated;
}
