import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface SportsGroupResponse {
  id: number;
  type: 'sport_group';
  status: number; // 1 = PENDING, 2 = APPROVED, 3 = REJECTED
  createdAt: string;
  groupName: string;
  leaderName?: string;
  memberCount: number;
  isVerified: boolean;
  decreeNumber?: string;
  secretariatAddress?: string;
  year?: number;
  desaKelurahanName: string;
  kecamatanName: string;
  sportName?: string;
  rejectionReason?: string;
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);

    if (!auth.isValid || !auth.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get pagination and filter parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const status = searchParams.get('status');

    // Build filter
    const filter: any = {};
    if (status) {
      if (status === '1') filter.status = 'PENDING';
      else if (status === '2') filter.status = 'APPROVED';
      else if (status === '3') filter.status = 'REJECTED';
    }

    // Fetch records
    const records = await prisma.sportsGroupStaging.findMany({
      where: filter,
      include: {
        desaKelurahan: {
          include: {
            kecamatan: {
              select: { nama: true },
            },
          },
        },
        sport: {
          select: { id: true, nama: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Transform to response format
    const data: SportsGroupResponse[] = records.map(record => {
      const statusMap = {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3,
      };

      return {
        id: record.id,
        type: 'sport_group' as const,
        status: statusMap[record.status as keyof typeof statusMap],
        createdAt: record.createdAt.toISOString(),
        groupName: record.groupName,
        leaderName: record.leaderName || undefined,
        memberCount: record.memberCount,
        isVerified: record.isVerified,
        decreeNumber: record.decreeNumber || undefined,
        secretariatAddress: record.secretariatAddress || undefined,
        year: record.year || undefined,
        desaKelurahanName: record.desaKelurahan.nama,
        kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
        sportName: record.sport?.nama || undefined,
        rejectionReason: record.rejectionReason || undefined,
      };
    });

    // Get total count
    const total = await prisma.sportsGroupStaging.count({ where: filter });

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/verifikasi/sports-group error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}