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
          select: { nama: true },
        },        achievements: {
          select: {
            id: true,
            achievementName: true,
            category: true,
            medal: true,
            year: true,
          },
        },      },
    });

    if (!athleteStaging) {
      return NextResponse.json(
        { message: 'Athlete not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/staging/athlete/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    });

    if (!athleteStaging) {
      return NextResponse.json(
        { message: 'Athlete not found' },
        { status: 404 }
      );
    }

    await prisma.athleteStaging.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: 'Athlete deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/staging/athlete/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
