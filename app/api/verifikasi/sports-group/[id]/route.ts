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
        { message: 'Invalid sports group ID' },
        { status: 400 }
      );
    }

    const sportsGroupStaging = await prisma.sportsGroupStaging.findUnique({
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
      },
    });

    if (!sportsGroupStaging) {
      return NextResponse.json(
        { message: 'Sports group not found' },
        { status: 404 }
      );
    }

    const statusMap = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
    };

    const response: SportsGroupResponse = {
      id: sportsGroupStaging.id,
      type: 'sport_group' as const,
      status: statusMap[sportsGroupStaging.status as keyof typeof statusMap],
      createdAt: sportsGroupStaging.createdAt.toISOString(),
      groupName: sportsGroupStaging.groupName,
      leaderName: sportsGroupStaging.leaderName || undefined,
      memberCount: sportsGroupStaging.memberCount,
      isVerified: sportsGroupStaging.isVerified,
      decreeNumber: sportsGroupStaging.decreeNumber || undefined,
      secretariatAddress: sportsGroupStaging.secretariatAddress || undefined,
      year: sportsGroupStaging.year || undefined,
      desaKelurahanName: sportsGroupStaging.desaKelurahan.nama,
      kecamatanName: sportsGroupStaging.desaKelurahan.kecamatan?.nama || '',
      sportName: sportsGroupStaging.sport?.nama || undefined,
      rejectionReason: sportsGroupStaging.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/verifikasi/sports-group/[id] error:', error);
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
        { message: 'Invalid sports group ID' },
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

    const sportsGroupStaging = await prisma.sportsGroupStaging.findUnique({
      where: { id: parsedId },
    });

    if (!sportsGroupStaging) {
      return NextResponse.json(
        { message: 'Sports group not found' },
        { status: 404 }
      );
    }

    if (status === 'APPROVED') {
      const existingSportsGroup = sportsGroupStaging.actionType === 'UPDATE' && sportsGroupStaging.referenceId
        ? await prisma.sportsGroup.findUnique({ where: { id: sportsGroupStaging.referenceId } })
        : await prisma.sportsGroup.findFirst({
            where: {
              desaKelurahanId: sportsGroupStaging.desaKelurahanId,
              groupName: sportsGroupStaging.groupName,
              year: sportsGroupStaging.year,
            },
          });

      if (existingSportsGroup) {
        await prisma.sportsGroup.update({
          where: { id: existingSportsGroup.id },
          data: {
            leaderName: sportsGroupStaging.leaderName || null,
            memberCount: sportsGroupStaging.memberCount,
            isVerified: sportsGroupStaging.isVerified,
            decreeNumber: sportsGroupStaging.decreeNumber || null,
            secretariatAddress: sportsGroupStaging.secretariatAddress || null,
            sportId: sportsGroupStaging.sportId || null,
          },
        });
      } else {
        await prisma.sportsGroup.create({
          data: {
            desaKelurahanId: sportsGroupStaging.desaKelurahanId,
            groupName: sportsGroupStaging.groupName,
            leaderName: sportsGroupStaging.leaderName || null,
            memberCount: sportsGroupStaging.memberCount,
            isVerified: sportsGroupStaging.isVerified,
            decreeNumber: sportsGroupStaging.decreeNumber || null,
            secretariatAddress: sportsGroupStaging.secretariatAddress || null,
            year: sportsGroupStaging.year || null,
            sportId: sportsGroupStaging.sportId || null,
          },
        });
      }
    }

    const updated = await prisma.sportsGroupStaging.update({
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

    const response: SportsGroupResponse = {
      id: updated.id,
      type: 'sport_group' as const,
      status: statusMap[updated.status as keyof typeof statusMap],
      createdAt: updated.createdAt.toISOString(),
      groupName: updated.groupName,
      leaderName: updated.leaderName || undefined,
      memberCount: updated.memberCount,
      isVerified: updated.isVerified,
      decreeNumber: updated.decreeNumber || undefined,
      secretariatAddress: updated.secretariatAddress || undefined,
      year: updated.year || undefined,
      desaKelurahanName: updated.desaKelurahan.nama,
      kecamatanName: updated.desaKelurahan.kecamatan?.nama || '',
      sportName: updated.sport?.nama || undefined,
      rejectionReason: updated.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/verifikasi/sports-group/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}