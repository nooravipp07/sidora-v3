import { NextRequest, NextResponse } from 'next/server';
import { HeroSectionService } from '@/services/hero-section.service';

/**
 * PUT /api/hero-section/[id]/status - Update hero section status
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

    if (body.status === undefined) {
      return NextResponse.json(
        { error: 'Status tidak boleh kosong' },
        { status: 400 }
      );
    }

    const config = await HeroSectionService.updateStatus(id, body.status);

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
