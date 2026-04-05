import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface AthleteResponse {
  id: number;
  type: 'athlete';
  status: number; // 1 = PENDING, 2 = APPROVED, 3 = REJECTED
  createdAt: string;
  nationalId: string;
  fullName: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  fullAddress?: string;
  organization?: string;
  athleteCategory?: string;
  photoUrl?: string;
  achievements?: Array<{
    id: number;
    achievementName: string;
    category?: string;
    medal?: string;
    year?: number;
  }>;
  desaKelurahanName: string;
  kecamatanName: string;
  cabangOlahragaName: string;
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
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
      const statusMap: { [key: string]: string } = {
        '1': 'PENDING',
        '2': 'APPROVED',
        '3': 'REJECTED',
      };
      if (statusMap[status]) {
        filter.status = statusMap[status];
      }
    }

    // Fetch athlete records from staging
    const records = await prisma.athleteStaging.findMany({
      where: filter,
      include: {
        achievements: {
          select: {
            id: true,
            achievementName: true,
            category: true,
            medal: true,
            year: true,
          },
        },
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
    const data: AthleteResponse[] = records.map(record => {
      const statusMap = {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3,
      };

      return {
        id: record.id,
        type: 'athlete' as const,
        status: statusMap[record.status as keyof typeof statusMap],
        createdAt: record.createdAt.toISOString(),
        nationalId: record.nationalId,
        fullName: record.fullName,
        birthPlace: record.birthPlace || undefined,
        birthDate: record.birthDate?.toISOString().split('T')[0],
        gender: record.gender || undefined,
        fullAddress: record.fullAddress || undefined,
        organization: record.organization || undefined,
        athleteCategory: record.category || undefined,
        photoUrl: record.photoUrl || undefined,
        achievements: record.achievements?.map(achievement => ({
          id: achievement.id,
          achievementName: achievement.achievementName,
          category: achievement.category || undefined,
          medal: achievement.medal || undefined,
          year: achievement.year || undefined,
        })),
        desaKelurahanName: record.desaKelurahan.nama,
        kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
        cabangOlahragaName: record.sport?.nama || '',
        rejectionReason: record.rejectionReason || undefined,
      };
    });

    // Get total count
    const total = await prisma.athleteStaging.count({ where: filter });

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
    console.error('GET /api/verifikasi/athlete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
