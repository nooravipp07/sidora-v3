import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

interface FacilityRecordResponse {
  id: number;
  type: 'facility';
  status: number; // 1 = PENDING, 2 = APPROVED, 3 = REJECTED
  createdAt: string;
  prasaranaName: string;
  year: number;
  condition: string;
  ownershipStatus: string;
  address: string;
  notes: string;
  isActive: boolean;
  desaKelurahanName: string;
  kecamatanName: string;
  photos?: Array<{ id: number; fileUrl: string; fileName?: string }>;
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

    // Fetch facility records from staging
    const records = await prisma.facilityRecordStaging.findMany({
      where: filter,
      include: {
        desaKelurahan: {
          include: {
            kecamatan: {
              select: { nama: true },
            },
          },
        },
        prasarana: {
          select: { id: true, nama: true },
        },
        photos: {
          select: { id: true, fileUrl: true, fileName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Transform to response format
    const data: FacilityRecordResponse[] = records.map(record => {
      const statusMap = {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3,
      };

      return {
        id: record.id,
        type: 'facility' as const,
        status: statusMap[record.status as keyof typeof statusMap],
        createdAt: record.createdAt.toISOString(),
        prasaranaName: record.prasarana.nama,
        year: record.year,
        condition: record.condition || '',
        ownershipStatus: record.ownershipStatus || '',
        address: record.address || '',
        notes: record.notes || '',
        isActive: record.isActive,
        desaKelurahanName: record.desaKelurahan.nama,
        kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
        photos: record.photos.map(photo => ({
          id: photo.id,
          fileUrl: photo.fileUrl,
          fileName: photo.fileName || undefined,
        })),
        rejectionReason: record.rejectionReason || undefined,
      };
    });

    // Get total count
    const total = await prisma.facilityRecordStaging.count({ where: filter });

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
    console.error('GET /api/verifikasi/facility-record error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
