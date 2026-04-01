import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateHeroImage } from '@/lib/hero-image-validator';

/**
 * POST /api/hero-section/upload - Upload hero section image
 * Validate image dimensions (min 1200x500), file size (max 10MB), and format (JPEG, PNG, WebP)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    // Validate image
    const validation = await validateHeroImage(file);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validasi gambar gagal',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Save file locally
    const hostname = request.headers.get('host') || 'localhost';
    const filename = `hero-${Date.now()}-${Math.random().toString(36).substring(7)}.${getFileExtension(file.type)}`;

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
          console.log(`Using upload path: ${path}`);
          break;
        } catch (e) {
          console.error(`Failed to use path ${path}:`, e);
          continue;
        }
      }

      if (!foundPath) {
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
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    const url = `/uploads/hero/${filename}`;

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
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupload gambar: ' + (error as Error).message },
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
