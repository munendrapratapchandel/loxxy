import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
