import { NextRequest, NextResponse } from 'next/server';
import { AthleteService } from '@/services/athlete.service';
import { prisma } from '@/lib/prisma';

interface AthleteWithSport {
  id: number;
  nationalId: string;
  fullName: string;
  birthPlace: string | null;
  birthDate: Date | null;
  gender: string | null;
  organization: string | null;
  category: string | null;
  status: string;
  sport: { id: number; nama: string } | null;
  achievements: { year: number; medal: string }[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get filter parameters
    const organization = searchParams.get('organization');
    const sportId = searchParams.get('sportId');
    const year = searchParams.get('year');
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Filter by organization
    if (organization && organization !== 'all') {
      where.organization = organization;
    }

    // Filter by sport (cabang olahraga)
    if (sportId && sportId !== 'all') {
      where.sportId = parseInt(sportId);
    }

    // Search filter
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { nationalId: { contains: search } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.athlete.count({ where });

    // Get athletes with sport relation and achievements
    let athletes: AthleteWithSport[] = await prisma.athlete.findMany({
      where,
      include: {
        sport: {
          select: { id: true, nama: true },
        },
        achievements: {
          select: { year: true, medal: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }) as AthleteWithSport[];

    // Filter by year if specified (after fetching to avoid complex queries)
    if (year && year !== 'all') {
      const yearNum = parseInt(year);
      athletes = athletes.filter((athlete) =>
        athlete.achievements.some((achievement) => achievement.year === yearNum)
      );
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      data: {
        athletes,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}
