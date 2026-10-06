import { NextResponse } from 'next/server';
import { getClips, createClip, updateClip, deleteClip, updateSettings, getSettings } from '@/lib/db';
import { ClipItem } from '@/lib/types';

export async function GET() {
  const clips = getClips();
  const settings = getSettings();
  return NextResponse.json({
    success: true,
    clips,
    enabled: settings.navigation?.clips !== false
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support toggle action if body has toggleStatus
    if (typeof body.enabled === 'boolean') {
      const current = getSettings();
      updateSettings({
        navigation: { ...current.navigation, clips: body.enabled },
        sections: { ...current.sections, clips: body.enabled }
      });
      return NextResponse.json({ success: true, enabled: body.enabled });
    }

    if (!body.title || !body.url) {
      return NextResponse.json({ success: false, error: 'Title and Media URL are required' }, { status: 400 });
    }

    const newClip: ClipItem = {
      id: body.id || `clip-${Date.now()}`,
      title: body.title.trim(),
      category: body.category || 'Tournament Clutch',
      mediaType: body.mediaType || 'video',
      url: body.url.trim(),
      thumbnailUrl: body.thumbnailUrl || '',
      authorOrPlayer: body.authorOrPlayer || 'Loxxy Athlete',
      gamemode: body.gamemode || 'Sword PvP',
      date: body.date || new Date().toISOString().split('T')[0],
      description: body.description || '',
      featured: !!body.featured
    };

    const created = createClip(newClip);
    return NextResponse.json({ success: true, clip: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Clip ID is required' }, { status: 400 });
    }
    const updated = updateClip(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Clip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, clip: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Clip ID is required' }, { status: 400 });
    }
    const deleted = deleteClip(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
