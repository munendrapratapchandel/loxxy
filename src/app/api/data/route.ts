import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({ success: true, data: db });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 });
    }
    const saved = saveDatabase(body);
    return NextResponse.json({ success: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
