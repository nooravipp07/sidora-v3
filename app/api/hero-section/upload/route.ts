import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateHeroImage } from '@/lib/hero-image-validator';

// Set dynamic to force-dynamic in production to prevent caching issues
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for upload

/**
 * POST /api/hero-section/upload - Upload hero section image
 * Validate image dimensions (min 1200x500), file size (max 10MB), and format (JPEG, PNG, WebP)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[HERO-UPLOAD] Request received');
    
    // Parse FormData with better error handling
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('[HERO-UPLOAD] FormData parsed successfully');
    } catch (parseError) {
      console.error('[HERO-UPLOAD] FormData parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format. Expected multipart/form-data',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    console.log('[HERO-UPLOAD] File:', file?.name, file?.size);

    if (!file) {
      console.warn('[HERO-UPLOAD] No file provided');
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    // Validate image
    console.log('[HERO-UPLOAD] Validating image...');
    const validation = await validateHeroImage(file);

    if (!validation.valid) {
      console.warn('[HERO-UPLOAD] Validation failed:', validation.errors);
      return NextResponse.json(
        {
          error: 'Validasi gambar gagal',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    console.log('[HERO-UPLOAD] Validation passed');

    // Save file locally
    const hostname = request.headers.get('host') || 'localhost';
    const filename = `hero-${Date.now()}-${Math.random().toString(36).substring(7)}.${getFileExtension(file.type)}`;
    console.log('[HERO-UPLOAD] Generated filename:', filename);

    let uploadsDir: string;

    if (process.env.NODE_ENV === 'production') {
      const paths = [
        process.env.UPLOADS_DIR,
        '/app/public/uploads/hero',
        join(process.cwd(), 'public', 'uploads', 'hero'),
        '/tmp/uploads/hero',
      ].filter(Boolean) as string[];

      let foundPath = '';
      for (const path of paths) {
        try {
          if (!existsSync(path)) {
            await mkdir(path, { recursive: true });
          }
          foundPath = path;
          console.log(`[HERO-UPLOAD] Using upload path: ${path}`);
          break;
        } catch (e) {
          console.error(`[HERO-UPLOAD] Failed to use path ${path}:`, e);
          continue;
        }
      }

      if (!foundPath) {
        console.error('[HERO-UPLOAD] No writable upload directory found');
        return NextResponse.json(
          { error: 'Gagal menyimpan file di server' },
          { status: 500 }
        );
      }

      uploadsDir = foundPath;
    } else {
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'hero');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
    }

    const filepath = join(uploadsDir, filename);
    console.log('[HERO-UPLOAD] Saving to:', filepath);
    
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    const url = `/uploads/hero/${filename}`;
    console.log('[HERO-UPLOAD] File saved successfully, URL:', url);

    return NextResponse.json(
      {
        success: true,
        url,
        filename,
        message: 'Gambar berhasil diupload',
        validation: {
          width: validation.width,
          height: validation.height,
          fileSize: validation.fileSize,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[HERO-UPLOAD] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Gagal mengupload gambar: ' + errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function getFileExtension(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  return extensions[mimeType] || 'jpg';
}
