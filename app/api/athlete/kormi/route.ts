import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE));
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sport = searchParams.get('sport') || '';

    // Build where clause
    const whereClause: any = {
      organization: 'KORMI',
      category: {
        in: ['ATLET', 'PELATIH'],
      },
      deletedAt: null,
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add sport filter
    if (sport) {
      whereClause.sportId = sport;
    }

    // Get total count
    const total = await prisma.athlete.count({ where: whereClause });

    // Get paginated data
    const athletes = await prisma.athlete.findMany({
      where: whereClause,
      include: {
        desaKelurahan: {
          include: {
            kecamatan: true,
          },
        },
        sport: true,
        achievements: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: athletes,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching KORMI athletes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}
