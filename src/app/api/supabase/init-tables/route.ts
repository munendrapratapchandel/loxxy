import { NextResponse } from 'next/server';
import { getAppConfig } from '@/lib/config';
import { getSupabaseSQLSchema } from '@/lib/supabase';
import { Client } from 'pg';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const config = getAppConfig();
    const dbUrl = body.databaseUrl || config.supabase.databaseUrl;

    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'Direct PostgreSQL Connection String (DATABASE_URL) is required to auto-create tables via SQL client. You can also copy the SQL schema and run it in the Supabase Dashboard SQL Editor.',
      }, { status: 400 });
    }

    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }, // Supabase requires SSL
    });

    await client.connect();
    const sql = getSupabaseSQLSchema();
    await client.query(sql);
    await client.end();

    return NextResponse.json({
      success: true,
      message: 'All Loxxy tables and security policies were successfully created in your Supabase PostgreSQL database!',
    });
  } catch (error: any) {
    console.error('Error auto-creating tables in Postgres:', error);
    return NextResponse.json({
      success: false,
      error: `PostgreSQL execution error: ${error.message}. You can also copy the SQL schema and execute it in your Supabase Dashboard SQL Editor.`,
    }, { status: 500 });
  }
}
