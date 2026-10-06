import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await testSupabaseConnection(body.url, body.key);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      connected: false,
      message: error.message || 'Connection test failed',
    }, { status: 500 });
  }
}
