import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface EquipmentResponse {
  id: number;
  desaKelurahanId: number;
  saranaId: number;
  quantity: number;
  unit?: string;
  isUsable: boolean;
  isGovernmentGrant: boolean;
  year?: number;
  status: string;
  submittedBy: string;
  createdAt: string;
  desaKelurahanName: string;
  kecamatanName: string;
  saranaName: string;
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
    const records = await prisma.equipmentStaging.findMany({
      where: filter,
      include: {
        desaKelurahan: {
          include: {
            kecamatan: {
              select: { nama: true },
            },
          },
        },
        sarana: {
          select: { id: true, nama: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Transform to response format
    const data: EquipmentResponse[] = records.map(record => ({
      id: record.id,
      desaKelurahanId: record.desaKelurahanId,
      saranaId: record.saranaId,
      quantity: record.quantity,
      unit: record.unit || undefined,
      isUsable: record.isUsable,
      isGovernmentGrant: record.isGovernmentGrant,
      year: record.year || undefined,
      status: record.status,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt.toISOString(),
      desaKelurahanName: record.desaKelurahan.nama,
      kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
      saranaName: record.sarana.nama,
    }));

    // Get total count
    const total = await prisma.equipmentStaging.count({ where: filter });

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
    console.error('GET /api/staging/equipment error:', error);
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
      saranaId,
      quantity,
      unit,
      isUsable,
      isGovernmentGrant,
      year,
    } = body;

    // Validation
    if (!desaKelurahanId || !saranaId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { message: 'Missing required fields or invalid quantity' },
        { status: 400 }
      );
    }

    // Get desaKelurahan to verify kecamatan access
    const desaKelurahan = await prisma.desaKelurahan.findUnique({
      where: { id: desaKelurahanId },
      include: { kecamatan: true },
    });

    if (!desaKelurahan) {
      return NextResponse.json(
        { message: 'Desa/Kelurahan not found' },
        { status: 404 }
      );
    }

    // For kecamatan users, verify they can only submit for their kecamatan
    if (user.roleId === 3 && desaKelurahan.kecamatanId !== user.kecamatanId) {
      return NextResponse.json(
        { message: 'You can only submit data for your kecamatan' },
        { status: 403 }
      );
    }

    // Create staging record
    const record = await prisma.equipmentStaging.create({
      data: {
        desaKelurahanId,
        saranaId,
        quantity,
        unit: unit || null,
        isUsable: isUsable !== false,
        isGovernmentGrant: isGovernmentGrant || false,
        year: year || null,
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
        sarana: {
          select: { nama: true },
        },
      },
    });

    const response: EquipmentResponse = {
      id: record.id,
      desaKelurahanId: record.desaKelurahanId,
      saranaId: record.saranaId,
      quantity: record.quantity,
      unit: record.unit || undefined,
      isUsable: record.isUsable,
      isGovernmentGrant: record.isGovernmentGrant,
      year: record.year || undefined,
      status: record.status,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt.toISOString(),
      desaKelurahanName: record.desaKelurahan.nama,
      kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
      saranaName: record.sarana.nama,
    };

    return NextResponse.json({
      message: 'Data submitted successfully',
      data: response,
    });
  } catch (error) {
    console.error('POST /api/staging/equipment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}