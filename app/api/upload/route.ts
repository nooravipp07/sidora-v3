import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Set dynamic to force-dynamic in production to prevent caching issues
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for upload

// Utility function to get writable upload directory
async function getUploadDir(): Promise<string | null> {
  try {
    // In production, prioritize UPLOADS_DIR env variable
    const paths = [
      process.env.UPLOAD_PATH,  // Environment variable (highest priority for berita)
      process.env.UPLOADS_DIR,  // Fallback general uploads dir
      join(process.cwd(), 'public', 'uploads', 'berita'),  // Default relative path
      '/var/www/sidora-v3/public/uploads/berita',  // Default VPS path
      process.env.HOME ? join(process.env.HOME, 'uploads', 'berita') : null,
      '/app/public/uploads/berita',  // Docker path
      // NOTE: Removed /tmp - too unreliable for production
    ].filter(Boolean) as string[];

    console.log('[UPLOAD] Searching upload paths:', paths);

    // Find first writable path
    for (const dirPath of paths) {
      try {
        if (!existsSync(dirPath)) {
          console.log(`[UPLOAD] Creating directory: ${dirPath}`);
          await mkdir(dirPath, { recursive: true });
        }
        
        // Test write permission
        const testFile = join(dirPath, '.write-test-' + Date.now());
        await writeFile(testFile, 'test');
        await import('fs/promises').then(fs => fs.unlink(testFile));
        
        console.log(`[UPLOAD] ✓ Using upload directory: ${dirPath}`);
        return dirPath;
      } catch (e) {
        console.warn(
          `[UPLOAD] ✗ Cannot use path ${dirPath}:`,
          e instanceof Error ? e.message : 'Unknown error'
        );
        continue;
      }
    }

    console.error('[UPLOAD] ✗ No writable upload directory found. Paths tried:', paths);
    return null;
  } catch (error) {
    console.error('[UPLOAD] Error finding upload directory:', error);
    return null;
  }
}

// Utility function to save file locally
async function saveFileLocally(file: File, filename: string): Promise<{ url: string; local: true } | null> {
  try {
    const uploadsDir = await getUploadDir();
    
    if (!uploadsDir) {
      console.error('[UPLOAD] ✗ No valid upload directory available');
      return null;
    }

    const filepath = join(uploadsDir, filename);
    console.log('[UPLOAD] Saving file to:', filepath);
    
    try {
      const buffer = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(buffer));
      console.log(`[UPLOAD] ✓ File saved successfully`);
    } catch (writeError) {
      console.error('[UPLOAD] ✗ Failed to write file:', {
        filepath,
        error: writeError instanceof Error ? writeError.message : String(writeError),
      });
      return null;
    }

    // Build URL - always use relative path for static served files
    const url = `/uploads/berita/${filename}`;

    console.log(`[UPLOAD] ✓ File URL: ${url}`);

    return { url, local: true };
  } catch (error) {
    console.error('[UPLOAD] Local file save error:', error instanceof Error ? error.message : 'Unknown error');
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
    console.log(`[UPLOAD] File stored as base64 (size: ${dataUrl.length} bytes)`);
    return { url: dataUrl, local: false };
  } catch (error) {
    console.error('[UPLOAD] Database save error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let uploadedFile: File | null = null;
  
  try {
    console.log('[UPLOAD] Request received, method:', request.method);
    console.log('[UPLOAD] Content-Type:', request.headers.get('content-type'));
    
    // Parse FormData with better error handling
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('[UPLOAD] FormData parsed successfully');
    } catch (parseError) {
      console.error('[UPLOAD] FormData parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format. Expected multipart/form-data',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 400 }
      );
    }

    uploadedFile = formData.get('file') as File;
    console.log('[UPLOAD] File from FormData:', uploadedFile?.name, uploadedFile?.size);

    if (!uploadedFile) {
      console.warn('[UPLOAD] No file provided in FormData');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!uploadedFile.type.startsWith('image/')) {
      console.warn('[UPLOAD] Invalid file type:', uploadedFile.type);
      return NextResponse.json(
        { error: 'File harus berupa gambar' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      console.warn('[UPLOAD] File too large:', uploadedFile.size);
      return NextResponse.json(
        { error: 'Ukuran file tidak boleh lebih dari 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = uploadedFile.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    console.log('[UPLOAD] Generated filename:', filename);

    // Try local storage first
    console.log('[UPLOAD] Attempting local storage...');
    const localResult = await saveFileLocally(uploadedFile, filename);
    if (localResult) {
      console.log('[UPLOAD] Local storage successful:', localResult.url);
      return NextResponse.json(localResult, { status: 201 });
    }

    // Fallback: save to database as base64 if local fails
    console.warn('[UPLOAD] Local storage failed, attempting database fallback...');
    const dbResult = await saveFileToDatabase(uploadedFile, filename);
    if (dbResult) {
      console.log('[UPLOAD] Database storage successful');
      return NextResponse.json(dbResult, { status: 201 });
    }

    console.error('[UPLOAD] All storage methods failed');
    return NextResponse.json(
      { error: 'Failed to save file (no storage available)' },
      { status: 500 }
    );
  } catch (error) {
    console.error('[UPLOAD] Unexpected error in POST handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
