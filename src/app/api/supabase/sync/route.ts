import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { pushAllToSupabase } from '@/lib/supabase';

export async function POST() {
  try {
    const db = getDatabase();
    const result = await pushAllToSupabase(db);
    return NextResponse.json({ success: result.success, ...result });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      syncedTables: [],
      errors: [error.message || 'Sync failed'],
    }, { status: 500 });
  }
}
