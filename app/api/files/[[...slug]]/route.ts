import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Map content types
const contentTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const filePath = slug.join('/');

    // Security: prevent directory traversal
    if (filePath.includes('..') || filePath.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Determine upload directory
    let uploadsDir: string;
    
    if (process.env.NODE_ENV === 'production') {
      uploadsDir = process.env.UPLOADS_DIR || join('/tmp', 'uploads');
    } else {
      uploadsDir = join(process.cwd(), 'public', 'uploads');
    }

    const fullPath = join(uploadsDir, filePath);

    // Verify file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(fullPath);
    const ext = filePath.split('.').pop()?.toLowerCase() || 'bin';
    const contentType = contentTypes[ext as keyof typeof contentTypes] || 'application/octet-stream';

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
