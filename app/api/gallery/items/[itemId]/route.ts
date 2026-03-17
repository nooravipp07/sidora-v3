import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/services/gallery.service';

interface RouteParams {
    params: Promise<{ itemId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { itemId } = await params;
        const id = parseInt(itemId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Item ID tidak valid' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { caption } = body;

        const item = await GalleryService.updateItem(id, { caption });

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error('Error updating gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to update gallery item' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { itemId } = await params;
        const id = parseInt(itemId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Item ID tidak valid' },
                { status: 400 }
            );
        }

        await GalleryService.removeItem(id);

        return NextResponse.json(
            { message: 'Item berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to delete gallery item' },
            { status: 500 }
        );
    }
}
