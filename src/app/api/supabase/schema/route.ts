import { NextResponse } from 'next/server';
import { getSupabaseSQLSchema } from '@/lib/supabase';

export async function GET() {
  const sql = getSupabaseSQLSchema();
  return NextResponse.json({ success: true, sql });
}
