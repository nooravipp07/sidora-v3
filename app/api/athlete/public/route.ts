import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const organization = searchParams.get('organization') || '';
    const category = searchParams.get('category') || '';
    const sport = searchParams.get('sport') || '';

    const skip = (page - 1) * limit;
    const where: any = {
      deletedAt: null,
    };

    // Filter by organization (KONI, NPCI)
    if (organization) {
      where.organization = organization;
    } else {
      // Default: show both KONI and NPCI
      where.organization = {
        in: ['KONI', 'NPCI']
      };
    }

    // Filter by category (ATLET, PELATIH, WASIT - JURI)
    if (category) {
      where.category = category;
    }

    // Filter by sport
    if (sport) {
      where.sportId = parseInt(sport);
    }

    // Search by name or NIK
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { nationalId: { contains: search } }
      ];
    }

    const [athletes, total] = await Promise.all([
      prisma.athlete.findMany({
        where,
        skip,
        take: limit,
        include: {
          desaKelurahan: {
            include: {
              kecamatan: true
            }
          },
          sport: true,
          achievements: {
            orderBy: { year: 'desc' }
          }
        },
        orderBy: { fullName: 'asc' }
      }),
      prisma.athlete.count({ where })
    ]);

    return NextResponse.json(
      {
        data: athletes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page < Math.ceil(total / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}
