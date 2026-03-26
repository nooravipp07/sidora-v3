import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File harus berupa gambar' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file tidak boleh lebih dari 5MB' },
        { status: 400 }
      );
    }

    // Determine upload directory based on environment
    // For production: use /app/public or /tmp
    // For development: use project's /public
    let uploadsDir: string;
    
    if (process.env.NODE_ENV === 'production') {
      // Try container's public path first, then /tmp
      uploadsDir = process.env.UPLOADS_DIR || join('/', 'app', 'public', 'uploads', 'berita');
      
      // If /app/public doesn't exist, use /tmp
      try {
        if (!existsSync(join(uploadsDir, '..'))) {
          uploadsDir = join('/tmp', 'uploads', 'berita');
        }
      } catch (e) {
        uploadsDir = join('/tmp', 'uploads', 'berita');
      }
    } else {
      // Development: use project's public folder
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'berita');
    }

    // Create uploads directory if it doesn't exist
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
    } catch (mkdirError) {
      console.error('Failed to create uploads directory:', mkdirError);
      // Fallback to /tmp if primary location fails
      if (uploadsDir !== join('/tmp', 'uploads', 'berita')) {
        uploadsDir = join('/tmp', 'uploads', 'berita');
        await mkdir(uploadsDir, { recursive: true });
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and write
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Return public URL
    // In production, adjust domain based on environment variable
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const url = baseUrl 
      ? `${baseUrl}/uploads/berita/${filename}`
      : `/uploads/berita/${filename}`;

    console.log(`File uploaded successfully: ${url}`);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
