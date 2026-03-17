import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/services/gallery.service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const title = searchParams.get('title') || '';

        const result = await GalleryService.getAll(
            { title },
            { page, limit }
        );

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching galleries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch galleries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description } = body;

        if (!title?.trim()) {
            return NextResponse.json(
                { error: 'Judul galeri tidak boleh kosong' },
                { status: 400 }
            );
        }

        const gallery = await GalleryService.create({
            title: title.trim(),
            description: description?.trim() || null
        });

        return NextResponse.json(gallery, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery:', error);
        return NextResponse.json(
            { error: 'Failed to create gallery' },
            { status: 500 }
        );
    }
}
