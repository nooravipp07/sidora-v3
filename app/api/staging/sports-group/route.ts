import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface SportsGroupResponse {
  id: number;
  desaKelurahanId: number;
  groupName: string;
  leaderName?: string;
  memberCount: number;
  isVerified: boolean;
  decreeNumber?: string;
  secretariatAddress?: string;
  year?: number;
  sportId?: number;
  status: string;
  submittedBy: string;
  createdAt: string;
  desaKelurahanName: string;
  kecamatanName: string;
  sportName?: string;
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

    // Get user from database using email from JWT token
    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build filter - kecamatan users see their own submissions, admins see all
    const filter: any = {};
    if (user.roleId === 3 && user.kecamatanId) {
      // Kecamatan user - filter by their kecamatan
      filter.desaKelurahan = {
        kecamatanId: user.kecamatanId,
      };
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
    const data: SportsGroupResponse[] = records.map(record => ({
      id: record.id,
      desaKelurahanId: record.desaKelurahanId,
      groupName: record.groupName,
      leaderName: record.leaderName || undefined,
      memberCount: record.memberCount,
      isVerified: record.isVerified,
      decreeNumber: record.decreeNumber || undefined,
      secretariatAddress: record.secretariatAddress || undefined,
      year: record.year || undefined,
      sportId: record.sportId || undefined,
      status: record.status,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt.toISOString(),
      desaKelurahanName: record.desaKelurahan.nama,
      kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
      sportName: record.sport?.nama || undefined,
    }));

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
    console.error('GET /api/staging/sports-group error:', error);
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

    // Get user from database using email from JWT token
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
      desaKelurahanId,
      groupName,
      leaderName,
      memberCount,
      isVerified,
      decreeNumber,
      secretariatAddress,
      year,
      sportId,
    } = body;

    // Validation
    if (!desaKelurahanId) {
      return NextResponse.json(
        { message: 'Desa/Kelurahan harus dipilih' },
        { status: 400 }
      );
    }

    if (!groupName || groupName.trim() === '') {
      return NextResponse.json(
        { message: 'Nama grup harus diisi' },
        { status: 400 }
      );
    }

    if (memberCount < 0) {
      return NextResponse.json(
        { message: 'Jumlah anggota tidak boleh negatif' },
        { status: 400 }
      );
    }

    // Check if user has access to the selected desa/kelurahan
    if (user.roleId === 3 && user.kecamatanId) {
      const desaKelurahan = await prisma.desaKelurahan.findUnique({
        where: { id: parseInt(desaKelurahanId) },
      });

      if (!desaKelurahan || desaKelurahan.kecamatanId !== user.kecamatanId) {
        return NextResponse.json(
          { message: 'Tidak memiliki akses ke desa/kelurahan tersebut' },
          { status: 403 }
        );
      }
    }

    // Create staging record
    const stagingRecord = await prisma.sportsGroupStaging.create({
      data: {
        desaKelurahanId: parseInt(desaKelurahanId),
        groupName: groupName.trim(),
        leaderName: leaderName?.trim() || null,
        memberCount: parseInt(memberCount) || 0,
        isVerified: Boolean(isVerified),
        decreeNumber: decreeNumber?.trim() || null,
        secretariatAddress: secretariatAddress?.trim() || null,
        year: year ? parseInt(year) : null,
        sportId: sportId ? parseInt(sportId) : null,
        actionType: 'CREATE',
        status: 'PENDING',
        submittedBy: user.email,
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

    const response: SportsGroupResponse = {
      id: stagingRecord.id,
      desaKelurahanId: stagingRecord.desaKelurahanId,
      groupName: stagingRecord.groupName,
      leaderName: stagingRecord.leaderName || undefined,
      memberCount: stagingRecord.memberCount,
      isVerified: stagingRecord.isVerified,
      decreeNumber: stagingRecord.decreeNumber || undefined,
      secretariatAddress: stagingRecord.secretariatAddress || undefined,
      year: stagingRecord.year || undefined,
      sportId: stagingRecord.sportId || undefined,
      status: stagingRecord.status,
      submittedBy: stagingRecord.submittedBy,
      createdAt: stagingRecord.createdAt.toISOString(),
      desaKelurahanName: stagingRecord.desaKelurahan.nama,
      kecamatanName: stagingRecord.desaKelurahan.kecamatan?.nama || '',
      sportName: stagingRecord.sport?.nama || undefined,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/staging/sports-group error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}