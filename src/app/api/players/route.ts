import { NextResponse } from 'next/server';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '@/lib/db';
import { Player } from '@/lib/types';

export async function GET() {
  const players = getPlayers();
  return NextResponse.json({ success: true, players });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.ign) {
      return NextResponse.json({ success: false, error: 'Name and IGN are required' }, { status: 400 });
    }
    const newPlayer: Player = {
      id: body.id || `player-${Date.now()}`,
      name: body.name,
      ign: body.ign,
      role: body.role || 'Member',
      skinUrl: body.skinUrl || '/skins/steve.png',
      avatarUrl: body.avatarUrl || `https://mc-heads.net/avatar/${body.ign}/100`,
      joinDate: body.joinDate || new Date().toISOString().split('T')[0],
      status: body.status || 'Active',
      featured: !!body.featured,
      region: body.region || 'Global',
      mainGamemode: body.mainGamemode || 'Sword PvP',
      bio: body.bio || '',
      pvpTiers: body.pvpTiers || {},
      skills: body.skills || { 'PvP': 85, 'Building': 70, 'Redstone': 60, 'Clutching': 80, 'Game Sense': 80 },
      socials: body.socials || {}
    };
    const created = createPlayer(newPlayer);
    return NextResponse.json({ success: true, player: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Player ID required' }, { status: 400 });
    }
    const updated = updatePlayer(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, player: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Player ID required' }, { status: 400 });
    }
    const deleted = deletePlayer(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
