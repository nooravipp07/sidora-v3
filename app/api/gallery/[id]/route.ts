import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/services/gallery.service';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const galleryId = parseInt(id);

        if (isNaN(galleryId)) {
            return NextResponse.json(
                { error: 'ID galeri tidak valid' },
                { status: 400 }
            );
        }

        const gallery = await GalleryService.getById(galleryId);

        if (!gallery) {
            return NextResponse.json(
                { error: 'Galeri tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json(gallery, { status: 200 });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const galleryId = parseInt(id);

        if (isNaN(galleryId)) {
            return NextResponse.json(
                { error: 'ID galeri tidak valid' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description } = body;

        if (!title?.trim()) {
            return NextResponse.json(
                { error: 'Judul galeri tidak boleh kosong' },
                { status: 400 }
            );
        }

        const gallery = await GalleryService.update(galleryId, {
            title: title.trim(),
            description: description?.trim() || null
        });

        return NextResponse.json(gallery, { status: 200 });
    } catch (error) {
        console.error('Error updating gallery:', error);
        return NextResponse.json(
            { error: 'Failed to update gallery' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const galleryId = parseInt(id);

        if (isNaN(galleryId)) {
            return NextResponse.json(
                { error: 'ID galeri tidak valid' },
                { status: 400 }
            );
        }

        await GalleryService.delete(galleryId);

        return NextResponse.json(
            { message: 'Galeri berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting gallery:', error);
        return NextResponse.json(
            { error: 'Failed to delete gallery' },
            { status: 500 }
        );
    }
}
