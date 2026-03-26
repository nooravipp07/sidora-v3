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

    // Try multiple locations
    const possiblePaths = [
      process.env.UPLOADS_DIR ? join(process.env.UPLOADS_DIR, filePath) : null,
      join('/app/public/uploads', filePath),
      join(process.cwd(), 'public', 'uploads', filePath),
      join('/tmp/uploads', filePath),
    ].filter(Boolean) as string[];

    let foundPath: string | null = null;
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        foundPath = path;
        break;
      }
    }

    if (!foundPath) {
      console.error(`File not found at any location: ${filePath}`);
      return NextResponse.json(
        { error: 'File not found', tried: possiblePaths },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(foundPath);
    const ext = filePath.split('.').pop()?.toLowerCase() || 'bin';
    const contentType = contentTypes[ext as keyof typeof contentTypes] || 'application/octet-stream';

    console.log(`Serving file from: ${foundPath}`);

    // Return file with proper headers for caching
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
        'Access-Control-Allow-Origin': '*', // Allow cross-origin
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to serve file' },
      { status: 500 }
    );
  }
}
