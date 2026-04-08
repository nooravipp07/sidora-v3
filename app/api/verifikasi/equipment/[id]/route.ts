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
        { message: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    const equipmentStaging = await prisma.equipmentStaging.findUnique({
      where: { id: parsedId },
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
    });

    if (!equipmentStaging) {
      return NextResponse.json(
        { message: 'Equipment not found' },
        { status: 404 }
      );
    }

    const statusMap = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
    };

    const response: EquipmentResponse = {
      id: equipmentStaging.id,
      type: 'equipment' as const,
      status: statusMap[equipmentStaging.status as keyof typeof statusMap],
      createdAt: equipmentStaging.createdAt.toISOString(),
      saranaName: equipmentStaging.sarana.nama,
      quantity: equipmentStaging.quantity,
      unit: equipmentStaging.unit || undefined,
      isUsable: equipmentStaging.isUsable,
      isGovernmentGrant: equipmentStaging.isGovernmentGrant,
      year: equipmentStaging.year || undefined,
      desaKelurahanName: equipmentStaging.desaKelurahan.nama,
      kecamatanName: equipmentStaging.desaKelurahan.kecamatan?.nama || '',
      rejectionReason: equipmentStaging.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/verifikasi/equipment/[id] error:', error);
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
        { message: 'Invalid equipment ID' },
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

    const equipmentStaging = await prisma.equipmentStaging.findUnique({
      where: { id: parsedId },
    });

    if (!equipmentStaging) {
      return NextResponse.json(
        { message: 'Equipment not found' },
        { status: 404 }
      );
    }

    if (status === 'APPROVED') {
      const existingEquipment = equipmentStaging.actionType === 'UPDATE' && equipmentStaging.referenceId
        ? await prisma.equipment.findUnique({ where: { id: equipmentStaging.referenceId } })
        : await prisma.equipment.findFirst({
            where: {
              desaKelurahanId: equipmentStaging.desaKelurahanId,
              saranaId: equipmentStaging.saranaId,
              year: equipmentStaging.year,
            },
          });

      if (existingEquipment) {
        await prisma.equipment.update({
          where: { id: existingEquipment.id },
          data: {
            quantity: equipmentStaging.quantity,
            unit: equipmentStaging.unit || null,
            isUsable: equipmentStaging.isUsable,
            isGovernmentGrant: equipmentStaging.isGovernmentGrant,
          },
        });
      } else {
        await prisma.equipment.create({
          data: {
            desaKelurahanId: equipmentStaging.desaKelurahanId,
            saranaId: equipmentStaging.saranaId,
            quantity: equipmentStaging.quantity,
            unit: equipmentStaging.unit || null,
            isUsable: equipmentStaging.isUsable,
            isGovernmentGrant: equipmentStaging.isGovernmentGrant,
            year: equipmentStaging.year || null,
          },
        });
      }
    }

    const updated = await prisma.equipmentStaging.update({
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
        sarana: {
          select: { id: true, nama: true },
        },
      },
    });

    const statusMap = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
    };

    const response: EquipmentResponse = {
      id: updated.id,
      type: 'equipment' as const,
      status: statusMap[updated.status as keyof typeof statusMap],
      createdAt: updated.createdAt.toISOString(),
      saranaName: updated.sarana.nama,
      quantity: updated.quantity,
      unit: updated.unit || undefined,
      isUsable: updated.isUsable,
      isGovernmentGrant: updated.isGovernmentGrant,
      year: updated.year || undefined,
      desaKelurahanName: updated.desaKelurahan.nama,
      kecamatanName: updated.desaKelurahan.kecamatan?.nama || '',
      rejectionReason: updated.rejectionReason || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/verifikasi/equipment/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}