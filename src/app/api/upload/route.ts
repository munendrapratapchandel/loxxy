import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'uploads'; // 'skins' or 'uploads'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const mimeType = file.type || (filename.endsWith('.png') ? 'image/png' : 'application/octet-stream');

    // 1. Try Supabase Cloud Storage first if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const bucketName = 'loxxy-media';
        
        // Ensure bucket exists or create it
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b) => b.name === bucketName);
        if (!bucketExists) {
          await supabase.storage.createBucket(bucketName, { public: true });
        }

        const storagePath = `${type}/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(storagePath);

          if (urlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: urlData.publicUrl,
              filename,
              storage: 'supabase',
            });
          }
        }
      } catch (supabaseErr: any) {
        console.warn('Supabase storage upload bypassed:', supabaseErr.message);
      }
    }

    // 2. Try writing to local disk (e.g. localhost or container with write permissions)
    try {
      const targetDir = path.join(process.cwd(), 'public', type === 'skins' ? 'skins' : 'uploads');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(targetDir, filename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/${type === 'skins' ? 'skins' : 'uploads'}/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        storage: 'local',
      });
    } catch (fsErr: any) {
      // 3. Fallback for read-only environments (e.g. EROFS on Vercel Serverless)
      // For skins and image files, Base64 Data URLs are 100% compatible with skinview3d, Three.js, and HTML
      console.warn('Filesystem is read-only (Vercel serverless). Falling back to Base64 Data URL:', fsErr.message);

      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename,
        storage: 'base64',
      });
    }
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
