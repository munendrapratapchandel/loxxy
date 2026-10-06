import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabaseAsync } from '@/lib/db';
import { pushAllToSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    const db = await getDatabaseAsync();
    const result = await pushAllToSupabase(db);
    try {
      revalidatePath('/', 'layout');
    } catch (_) {}
    return NextResponse.json({ success: result.success, ...result });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      syncedTables: [],
      errors: [error.message || 'Sync failed'],
    }, { status: 500 });
  }
}
