import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface EquipmentResponse {
  id: number;
  type: 'equipment';
  status: number; // 1 = PENDING, 2 = APPROVED, 3 = REJECTED
  createdAt: string;
  saranaName: string;
  quantity: number;
  unit?: string;
  isUsable: boolean;
  isGovernmentGrant: boolean;
  year?: number;
  desaKelurahanName: string;
  kecamatanName: string;
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
    const data: EquipmentResponse[] = records.map(record => {
      const statusMap = {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3,
      };

      return {
        id: record.id,
        type: 'equipment' as const,
        status: statusMap[record.status as keyof typeof statusMap],
        createdAt: record.createdAt.toISOString(),
        saranaName: record.sarana.nama,
        quantity: record.quantity,
        unit: record.unit || undefined,
        isUsable: record.isUsable,
        isGovernmentGrant: record.isGovernmentGrant,
        year: record.year || undefined,
        desaKelurahanName: record.desaKelurahan.nama,
        kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
        rejectionReason: record.rejectionReason || undefined,
      };
    });

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
    console.error('GET /api/verifikasi/equipment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}