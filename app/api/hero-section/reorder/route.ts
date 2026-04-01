import { NextRequest, NextResponse } from 'next/server';
import { HeroSectionService } from '@/services/hero-section.service';

/**
 * POST /api/hero-section/reorder - Reorder hero sections
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Items harus berupa array' },
        { status: 400 }
      );
    }

    const result = await HeroSectionService.reorder(body.items);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
