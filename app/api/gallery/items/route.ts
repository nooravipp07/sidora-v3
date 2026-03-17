import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/services/gallery.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { galleryId, imageUrl, caption } = body;

        if (!galleryId || !imageUrl?.trim()) {
            return NextResponse.json(
                { error: 'Gallery ID dan URL gambar harus diisi' },
                { status: 400 }
            );
        }

        const item = await GalleryService.addItem(galleryId, {
            imageUrl: imageUrl.trim(),
            caption: caption?.trim() || null
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error adding gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to add gallery item' },
            { status: 500 }
        );
    }
}
