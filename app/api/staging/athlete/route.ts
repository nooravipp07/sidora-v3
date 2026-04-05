import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface AthleteResponse {
  id: number;
  nationalId: string;
  fullName: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  fullAddress?: string;
  organization?: string;
  category?: string;
  statusAthlete: string;
  photoUrl?: string;
  achievements?: Array<{
    id: number;
    achievementName: string;
    category?: string;
    medal?: string;
    year?: number;
  }>;
  status: string;
  createdAt: string;
  desaKelurahanName: string;
  kecamatanName: string;
  cabangOlahragaName: string;
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
        desaKelurahan: {
          include: {
            kecamatan: {
              select: { nama: true },
            },
          },
        },
        sport: {
          select: { nama: true },
        },
        achievements: {
          select: {
            id: true,
            achievementName: true,
            category: true,
            medal: true,
            year: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Transform to response format
    const data: AthleteResponse[] = records.map(record => {
      const statusMap = {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
      };

      return {
        id: record.id,
        nationalId: record.nationalId,
        fullName: record.fullName,
        birthPlace: record.birthPlace || undefined,
        birthDate: record.birthDate?.toISOString().split('T')[0],
        gender: record.gender || undefined,
        fullAddress: record.fullAddress || undefined,
        organization: record.organization || undefined,
        category: record.category || undefined,
        statusAthlete: record.statusAthlete,
        photoUrl: record.photoUrl || undefined,
        achievements: record.achievements.map(achievement => ({
          id: achievement.id,
          achievementName: achievement.achievementName,
          category: achievement.category || undefined,
          medal: achievement.medal || undefined,
          year: achievement.year || undefined,
        })),
        status: statusMap[record.status as keyof typeof statusMap],
        createdAt: record.createdAt.toISOString(),
        desaKelurahanName: record.desaKelurahan.nama,
        kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
        cabangOlahragaName: record.sport?.nama || '',
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
    console.error('GET /api/staging/athlete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      nationalId,
      fullName,
      birthPlace,
      birthDate,
      gender,
      desaKelurahanId,
      fullAddress,
      organization,
      sportId,
      category,
      statusAthlete,
      photo,
      achievements,
    } = body;

    // Validation
    if (!nationalId || !fullName || !birthDate || !desaKelurahanId || !fullAddress || !sportId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create athlete staging record
    const athleteStaging = await prisma.athleteStaging.create({
      data: {
        nationalId,
        fullName,
        birthPlace: birthPlace || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        desaKelurahanId,
        fullAddress,
        organization: organization || null,
        sportId: sportId || null,
        category: category || null,
        statusAthlete: statusAthlete || 'aktif',
        photoUrl: photo?.fileUrl || null,
        actionType: 'CREATE',
        status: 'PENDING',
        submittedBy: user.email,
        achievements: achievements && achievements.length > 0 ? {
          create: achievements.map((achievement: any) => ({
            achievementName: achievement.achievementName,
            category: achievement.category || null,
            medal: achievement.medal || null,
            year: achievement.year || null,
          })),
        } : undefined,
      },
      include: {
        desaKelurahan: {
          include: {
            kecamatan: {
              select: { nama: true },
            },
          },
        },
        sport: {
          select: { nama: true },
        },
        achievements: {
          select: {
            id: true,
            achievementName: true,
            category: true,
            medal: true,
            year: true,
          },
        },
      },
    });

    const response: AthleteResponse = {
      id: athleteStaging.id,
      nationalId: athleteStaging.nationalId,
      fullName: athleteStaging.fullName,
      birthPlace: athleteStaging.birthPlace || undefined,
      birthDate: athleteStaging.birthDate?.toISOString().split('T')[0],
      gender: athleteStaging.gender || undefined,
      fullAddress: athleteStaging.fullAddress || undefined,
      organization: athleteStaging.organization || undefined,
      category: athleteStaging.category || undefined,
      statusAthlete: athleteStaging.statusAthlete,
      photoUrl: athleteStaging.photoUrl || undefined,
      achievements: athleteStaging.achievements.map(achievement => ({
        id: achievement.id,
        achievementName: achievement.achievementName,
        category: achievement.category || undefined,
        medal: achievement.medal || undefined,
        year: achievement.year || undefined,
      })),
      status: athleteStaging.status,
      createdAt: athleteStaging.createdAt.toISOString(),
      desaKelurahanName: athleteStaging.desaKelurahan.nama,
      kecamatanName: athleteStaging.desaKelurahan.kecamatan?.nama || '',
      cabangOlahragaName: athleteStaging.sport?.nama || '',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/staging/athlete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
