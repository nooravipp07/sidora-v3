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
  rejectionReason?: string;
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
      rejectionReason: athleteStaging.rejectionReason || undefined,
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
      actionType,
      referenceId,
    } = body;

    // Validation
    if (!nationalId || !fullName || !birthDate || !desaKelurahanId || !fullAddress || !sportId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const athleteStaging = await prisma.athleteStaging.findUnique({
      where: { id: parsedId },
    });

    if (!athleteStaging) {
      return NextResponse.json(
        { message: 'Athlete staging record not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (athleteStaging.submittedBy !== auth.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized to edit this record' },
        { status: 403 }
      );
    }

    // Update athlete staging record
    const updatedAthleteStaging = await prisma.athleteStaging.update({
      where: { id: parsedId },
      data: {
        nationalId,
        fullName,
        birthPlace: birthPlace || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        desaKelurahanId: parseInt(desaKelurahanId),
        fullAddress,
        organization: organization || null,
        category: category || null,
        statusAthlete: statusAthlete || 'aktif',
        sportId: parseInt(sportId),
        photoUrl: photo?.fileUrl || null,
        actionType: actionType || 'UPDATE',
        referenceId: referenceId || null,
        status: 'PENDING', // Reset to pending for re-verification
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null, // Clear rejection reason
        updatedAt: new Date(),
        achievements: {
          deleteMany: {},
          create: achievements?.map((achievement: any) => ({
            achievementName: achievement.achievementName,
            category: achievement.category || null,
            medal: achievement.medal || null,
            year: achievement.year || null,
          })) || [],
        },
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
      id: updatedAthleteStaging.id,
      nationalId: updatedAthleteStaging.nationalId,
      fullName: updatedAthleteStaging.fullName,
      birthPlace: updatedAthleteStaging.birthPlace || undefined,
      birthDate: updatedAthleteStaging.birthDate?.toISOString().split('T')[0],
      gender: updatedAthleteStaging.gender || undefined,
      fullAddress: updatedAthleteStaging.fullAddress || undefined,
      organization: updatedAthleteStaging.organization || undefined,
      category: updatedAthleteStaging.category || undefined,
      statusAthlete: updatedAthleteStaging.statusAthlete,
      photoUrl: updatedAthleteStaging.photoUrl || undefined,
      achievements: updatedAthleteStaging.achievements?.map((achievement) => ({
        id: achievement.id,
        achievementName: achievement.achievementName,
        category: achievement.category || undefined,
        medal: achievement.medal || undefined,
        year: achievement.year || undefined,
      })),
      status: updatedAthleteStaging.status,
      createdAt: updatedAthleteStaging.createdAt.toISOString(),
      desaKelurahanName: updatedAthleteStaging.desaKelurahan.nama,
      kecamatanName: updatedAthleteStaging.desaKelurahan.kecamatan?.nama || '',
      cabangOlahragaName: updatedAthleteStaging.sport?.nama || '',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/staging/athlete/[id] error:', error);
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
