import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { RecruitmentApplication } from '@/lib/types';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({ success: true, applications: db.recruitmentApplications || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDatabase();

    // Check if updating an existing application status (Admin)
    if (body.action === 'update_status' && body.id && body.status) {
      const idx = db.recruitmentApplications.findIndex(a => a.id === body.id);
      if (idx !== -1) {
        db.recruitmentApplications[idx].status = body.status;
        saveDatabase(db);
        return NextResponse.json({ success: true, application: db.recruitmentApplications[idx] });
      }
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    // New application submission
    if (!body.ign || !body.discordTag) {
      return NextResponse.json({ success: false, error: 'Minecraft IGN and Discord tag are required' }, { status: 400 });
    }

    const newApp: RecruitmentApplication = {
      id: `app-${Date.now()}`,
      ign: body.ign,
      discordTag: body.discordTag,
      age: body.age || '',
      region: body.region || 'Global',
      mainGamemode: body.mainGamemode || 'Sword PvP',
      pvpTierClaim: body.pvpTierClaim || 'HT2',
      experience: body.experience || '',
      clipsUrl: body.clipsUrl || '',
      whyJoin: body.whyJoin || '',
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };

    if (!db.recruitmentApplications) {
      db.recruitmentApplications = [];
    }
    db.recruitmentApplications.unshift(newApp);
    saveDatabase(db);

    return NextResponse.json({ success: true, application: newApp });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
