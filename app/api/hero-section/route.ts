import { NextRequest, NextResponse } from 'next/server';
import { HeroSectionService } from '@/services/hero-section.service';

/**
 * GET /api/hero-section - Get all hero section configs with pagination
 * Query params: page, limit, status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status')
      ? parseInt(searchParams.get('status')!)
      : undefined;

    const result = await HeroSectionService.getAll(
      { status },
      { page, limit }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/hero-section - Create new hero section config
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const config = await HeroSectionService.create({
      title: body.title,
      description: body.description,
      bannerImageUrl: body.bannerImageUrl,
      displayOrder: body.displayOrder,
      status: body.status,
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
