import fs from 'fs';
import path from 'path';

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
    adminPin: process.env.ADMIN_PIN || 'loxxy2026',
  },
};

export function getAppConfig(): AppConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      const dir = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
      return DEFAULT_CONFIG;
    }
    const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(content) as AppConfig;

    // Merge defaults in case of missing keys
    return {
      supabase: {
        ...DEFAULT_CONFIG.supabase,
        ...(parsed.supabase || {}),
        url: parsed.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        anonKey: parsed.supabase?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        serviceRoleKey: parsed.supabase?.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      },
      integrations: {
        ...DEFAULT_CONFIG.integrations,
        ...(parsed.integrations || {}),
      },
      security: {
        ...DEFAULT_CONFIG.security,
        ...(parsed.security || {}),
      },
    };
  } catch (e) {
    console.error('Error reading app config:', e);
    return DEFAULT_CONFIG;
  }
}

export function saveAppConfig(partial: Partial<AppConfig>): AppConfig {
  try {
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

    // If Supabase URL and anonKey/serviceRoleKey are provided, auto-set enabled = true
    if (updated.supabase.url && (updated.supabase.anonKey || updated.supabase.serviceRoleKey)) {
      updated.supabase.enabled = true;
    }

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    // Also update .env.local if possible for process.env fallback
    try {
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
  } catch (e) {
    console.error('Error saving app config:', e);
    return getAppConfig();
  }
}
