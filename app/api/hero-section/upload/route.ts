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
      // Prioritize explicit UPLOADS_DIR env variable
      const paths = [
        process.env.UPLOADS_DIR,  // Must be set in .env.production
        process.env.UPLOAD_PATH,  // Fallback
        '/var/www/sidora-v3/public/uploads/hero',  // Default VPS path
        join(process.cwd(), 'public', 'uploads', 'hero'),  // Relative to app root
        '/app/public/uploads/hero',  // Docker alternative
        // NOTE: Removed /tmp - too unreliable for production
      ].filter(Boolean) as string[];

      console.log('[HERO-UPLOAD] Production mode - searching paths:', paths);
      
      let foundPath = '';
      for (const path of paths) {
        try {
          if (!existsSync(path)) {
            console.log(`[HERO-UPLOAD] Creating directory: ${path}`);
            await mkdir(path, { recursive: true });
          }
          
          // Verify we can write
          const testFile = join(path, '.write-test-' + Date.now());
          await writeFile(testFile, 'test');
          await import('fs/promises').then(fs => fs.unlink(testFile));
          
          foundPath = path;
          console.log(`[HERO-UPLOAD] ✓ Using upload path: ${path}`);
          break;
        } catch (e) {
          console.error(
            `[HERO-UPLOAD] ✗ Cannot use path ${path}:`,
            e instanceof Error ? e.message : String(e)
          );
          continue;
        }
      }

      if (!foundPath) {
        console.error('[HERO-UPLOAD] ✗ No writable upload directory found', {
          'Tried paths': paths,
          'NODE_ENV': process.env.NODE_ENV,
          'UPLOADS_DIR set': !!process.env.UPLOADS_DIR,
          'cwd': process.cwd(),
        });
        return NextResponse.json(
          { 
            error: 'Gagal menyimpan file di server',
            debug: 'No writable upload directory. Check UPLOADS_DIR env var and directory permissions.',
            triedPaths: paths,
          },
          { status: 500 }
        );
      }

      uploadsDir = foundPath;
    } else {
      // Development mode
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'hero');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      console.log('[HERO-UPLOAD] Development mode - using:', uploadsDir);
    }

    const filepath = join(uploadsDir, filename);
    console.log('[HERO-UPLOAD] Saving to:', filepath);
    
    try {
      const buffer = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(buffer));
      console.log('[HERO-UPLOAD] ✓ File written successfully');
    } catch (writeError) {
      console.error('[HERO-UPLOAD] ✗ Failed to write file:', {
        filepath,
        error: writeError instanceof Error ? writeError.message : String(writeError),
      });
      return NextResponse.json(
        { 
          error: 'Gagal menyimpan file: ' + (writeError instanceof Error ? writeError.message : 'Unknown error'),
          filepath,
        },
        { status: 500 }
      );
    }

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
