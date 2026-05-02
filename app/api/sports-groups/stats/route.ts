import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!) : null;

    // Build filter for sports groups
    const whereClause: any = {
      deletedAt: null,
    };

    if (yearParam) {
      const year = parseInt(yearParam);
      if (!Number.isNaN(year)) {
        whereClause.year = year;
      }
    }

    if (kecamatanId) {
      whereClause.desaKelurahan = {
        kecamatanId,
      };
    }

    // Get total sports groups
    const total = await prisma.sportsGroup.count({
      where: {
        ...whereClause,
        deletedAt: null,
      },
    });

    // Get verified sports groups
    const verified = await prisma.sportsGroup.count({
      where: {
        ...whereClause,
        isVerified: true,
        deletedAt: null,
      },
    });

    // Get unverified sports groups
    const unverified = await prisma.sportsGroup.count({
      where: {
        ...whereClause,
        isVerified: false,
        deletedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        verified,
        unverified,
      },
    });
  } catch (error) {
    console.error('Error fetching sports groups stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch sports groups stats',
      },
      { status: 500 }
    );
  }
}
