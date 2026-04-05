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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuth(request);

    if (!auth.isValid || !auth.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { message: 'Invalid athlete ID' },
        { status: 400 }
      );
    }

    const athleteStaging = await prisma.athleteStaging.findUnique({
      where: { id: parsedId },
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

    if (!athleteStaging) {
      return NextResponse.json(
        { message: 'Athlete not found' },
        { status: 404 }
      );
    }

    const statusMap = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
    };

    const response: AthleteResponse = {
      id: athleteStaging.id,
      type: 'athlete' as const,
      status: statusMap[athleteStaging.status as keyof typeof statusMap],
      createdAt: athleteStaging.createdAt.toISOString(),
      nationalId: athleteStaging.nationalId,
      fullName: athleteStaging.fullName,
      birthPlace: athleteStaging.birthPlace || undefined,
      birthDate: athleteStaging.birthDate?.toISOString().split('T')[0],
      gender: athleteStaging.gender || undefined,
      fullAddress: athleteStaging.fullAddress || undefined,
      organization: athleteStaging.organization || undefined,
      athleteCategory: athleteStaging.category || undefined,
      photoUrl: athleteStaging.photoUrl || undefined,
      achievements: athleteStaging.achievements?.map((achievement) => ({
        id: achievement.id,
        achievementName: achievement.achievementName,
        category: achievement.category || undefined,
        medal: achievement.medal || undefined,
        year: achievement.year || undefined,
      })),
      desaKelurahanName: athleteStaging.desaKelurahan.nama,
      kecamatanName: athleteStaging.desaKelurahan.kecamatan?.nama || '',
      cabangOlahragaName: athleteStaging.sport?.nama || '',
      rejectionReason: athleteStaging.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/verifikasi/athlete/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuth(request);

    if (!auth.isValid || !auth.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { message: 'Invalid athlete ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json(
        { message: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const athleteStaging = await prisma.athleteStaging.findUnique({
      where: { id: parsedId },
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
      },
    });

    if (!athleteStaging) {
      return NextResponse.json(
        { message: 'Athlete not found' },
        { status: 404 }
      );
    }

    if (status === 'APPROVED') {
      const existingAthlete = athleteStaging.actionType === 'UPDATE' && athleteStaging.referenceId
        ? await prisma.athlete.findUnique({ where: { id: athleteStaging.referenceId } })
        : await prisma.athlete.findUnique({ where: { nationalId: athleteStaging.nationalId } });

      if (existingAthlete) {
        await prisma.athlete.update({
          where: { id: existingAthlete.id },
          data: {
            nationalId: athleteStaging.nationalId,
            fullName: athleteStaging.fullName,
            birthPlace: athleteStaging.birthPlace || null,
            birthDate: athleteStaging.birthDate || null,
            gender: athleteStaging.gender || null,
            desaKelurahanId: athleteStaging.desaKelurahanId,
            fullAddress: athleteStaging.fullAddress || null,
            organization: athleteStaging.organization || null,
            category: athleteStaging.category || null,
            sportId: athleteStaging.sportId || null,
            photoUrl: athleteStaging.photoUrl || null,
            achievements: {
              deleteMany: {},
              create: athleteStaging.achievements.map((achievement) => ({
                achievementName: achievement.achievementName,
                category: achievement.category || null,
                medal: achievement.medal || null,
                year: achievement.year || null,
              })),
            },
          },
        });
      } else {
        await prisma.athlete.create({
          data: {
            nationalId: athleteStaging.nationalId,
            fullName: athleteStaging.fullName,
            birthPlace: athleteStaging.birthPlace || null,
            birthDate: athleteStaging.birthDate || null,
            gender: athleteStaging.gender || null,
            desaKelurahanId: athleteStaging.desaKelurahanId,
            fullAddress: athleteStaging.fullAddress || null,
            organization: athleteStaging.organization || null,
            category: athleteStaging.category || null,
            sportId: athleteStaging.sportId || null,
            photoUrl: athleteStaging.photoUrl || null,
            achievements: {
              create: athleteStaging.achievements.map((achievement) => ({
                achievementName: achievement.achievementName,
                category: achievement.category || null,
                medal: achievement.medal || null,
                year: achievement.year || null,
              })),
            },
          },
        });
      }
    }

    const updated = await prisma.athleteStaging.update({
      where: { id: parsedId },
      data: {
        status: status,
        reviewedBy: auth.user.email,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
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
          select: { id: true, nama: true },
        },
      },
    });

    const statusMap = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
    };

    const response: AthleteResponse = {
      id: updated.id,
      type: 'athlete' as const,
      status: statusMap[updated.status as keyof typeof statusMap],
      createdAt: updated.createdAt.toISOString(),
      nationalId: updated.nationalId,
      fullName: updated.fullName,
      birthPlace: updated.birthPlace || undefined,
      birthDate: updated.birthDate?.toISOString().split('T')[0],
      gender: updated.gender || undefined,
      fullAddress: updated.fullAddress || undefined,
      organization: updated.organization || undefined,
      athleteCategory: updated.category || undefined,
      photoUrl: updated.photoUrl || undefined,
      desaKelurahanName: updated.desaKelurahan.nama,
      kecamatanName: updated.desaKelurahan.kecamatan?.nama || '',
      cabangOlahragaName: updated.sport?.nama || '',
      rejectionReason: updated.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/verifikasi/athlete/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
