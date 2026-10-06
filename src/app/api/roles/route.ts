import { NextResponse } from 'next/server';
import { getRoles, createRole, updateRole, deleteRole } from '@/lib/db';
import { TeamRole } from '@/lib/types';

export async function GET() {
  const roles = getRoles();
  return NextResponse.json({ success: true, roles });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Role name is required' }, { status: 400 });
    }
    const newRole: TeamRole = {
      id: body.id || `role-${Date.now()}`,
      name: body.name.trim(),
      color: body.color || '#00f5ff',
      badgeStyle: body.badgeStyle || '',
      description: body.description || '',
      isDefault: false
    };
    const created = createRole(newRole);
    return NextResponse.json({ success: true, role: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Role ID is required' }, { status: 400 });
    }
    const updated = updateRole(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, role: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Role ID is required' }, { status: 400 });
    }
    const deleted = deleteRole(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
