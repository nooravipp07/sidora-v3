import { NextRequest, NextResponse } from 'next/server';
import { HeroSectionService } from '@/services/hero-section.service';

/**
 * GET /api/hero-section/[id] - Get hero section config by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const config = await HeroSectionService.getById(id);

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/hero-section/[id] - Update hero section config
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();

    const config = await HeroSectionService.update(id, {
      title: body.title,
      description: body.description,
      bannerImageUrl: body.bannerImageUrl,
      displayOrder: body.displayOrder,
      status: body.status,
    });

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/hero-section/[id] - Delete hero section config
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await HeroSectionService.delete(id);

    return NextResponse.json(
      { message: 'Hero section config berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 404 }
    );
  }
}
