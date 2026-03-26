import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Utility function to save file locally
async function saveFileLocally(file: File, filename: string): Promise<{ url: string; local: true } | null> {
  try {
    let uploadsDir: string;
    
    if (process.env.NODE_ENV === 'production') {
      // In production, prefer /app/public (deployed to server root)
      // Fallback to /public in same directory
      const paths = [
        process.env.UPLOADS_DIR,
        '/app/public/uploads/berita',
        join(process.cwd(), 'public', 'uploads', 'berita'),
        '/tmp/uploads/berita', // Last resort (ephemeral)
      ].filter(Boolean) as string[];

      let foundPath = '';
      for (const path of paths) {
        try {
          if (!existsSync(path)) {
            await mkdir(path, { recursive: true });
          }
          foundPath = path;
          console.log(`Using upload path: ${path}`);
          break;
        } catch (e) {
          console.error(`Failed to use path ${path}:`, e);
          continue;
        }
      }

      if (!foundPath) {
        console.error('No writable upload directory found');
        return null;
      }
      uploadsDir = foundPath;
    } else {
      // Development - always use project's /public folder
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'berita');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
    }

    const filepath = join(uploadsDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Build URL - always use relative path for static served files
    const url = `/uploads/berita/${filename}`;

    console.log(`File saved to ${filepath}`);
    console.log(`File URL: ${url}`);

    return { url, local: true };
  } catch (error) {
    console.error('Local file save error:', error);
    return null;
  }
}

// Utility function to save to database as base64 (fallback)
async function saveFileToDatabase(file: File, filename: string): Promise<{ url: string; local: false } | null> {
  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Note: This is limited by database column size
    // Make sure your schema supports this (use LONGBLOB or similar)
    console.log(`File stored as base64 (size: ${dataUrl.length} bytes)`);
    return { url: dataUrl, local: false };
  } catch (error) {
    console.error('Database save error:', error);
    return null;
  }
}

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

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Try local storage first
    const localResult = await saveFileLocally(file, filename);
    if (localResult) {
      return NextResponse.json(localResult, { status: 201 });
    }

    // Fallback: save to database as base64 if local fails
    console.warn('Local storage failed, using database fallback');
    const dbResult = await saveFileToDatabase(file, filename);
    if (dbResult) {
      return NextResponse.json(dbResult, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Failed to save file (no storage available)' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
