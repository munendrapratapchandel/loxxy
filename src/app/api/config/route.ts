import { NextResponse } from 'next/server';
import { getAppConfig, saveAppConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = getAppConfig();
    return NextResponse.json(
      {
        success: true,
        config: {
          supabase: {
            url: config.supabase.url,
            anonKey: config.supabase.anonKey,
            serviceRoleKey: config.supabase.serviceRoleKey,
            databaseUrl: config.supabase.databaseUrl || '',
            enabled: config.supabase.enabled,
          },
          integrations: {
            discordWebhookUrl: config.integrations.discordWebhookUrl || '',
            discordBotToken: config.integrations.discordBotToken || '',
            youtubeApiKey: config.integrations.youtubeApiKey || '',
            twitchClientId: config.integrations.twitchClientId || '',
            twitchClientSecret: config.integrations.twitchClientSecret || '',
          },
          security: {
            hasCustomPin: config.security.adminPin !== 'loxxy2026',
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = saveAppConfig(body);
    return NextResponse.json(
      { success: true, config: updated },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
