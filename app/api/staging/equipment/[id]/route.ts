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
  rejectionReason?: string;
  submittedBy: string;
  createdAt: string;
  desaKelurahanName: string;
  kecamatanName: string;
  saranaName: string;
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

    const record = await prisma.equipmentStaging.findUnique({
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

    if (!record) {
      return NextResponse.json(
        { message: 'Equipment not found' },
        { status: 404 }
      );
    }

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
      rejectionReason: record.rejectionReason || undefined,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt.toISOString(),
      desaKelurahanName: record.desaKelurahan.nama,
      kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
      saranaName: record.sarana.nama,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/staging/equipment/[id] error:', error);
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
    const {
      desaKelurahanId,
      saranaId,
      quantity,
      unit,
      isUsable,
      isGovernmentGrant,
      year,
      actionType,
      referenceId,
    } = body;

    if (!desaKelurahanId || !saranaId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { message: 'Missing required fields or invalid quantity' },
        { status: 400 }
      );
    }

    const record = await prisma.equipmentStaging.findUnique({
      where: { id: parsedId },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Equipment not found' },
        { status: 404 }
      );
    }

    if (record.submittedBy !== auth.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized to edit this record' },
        { status: 403 }
      );
    }

    const updatedRecord = await prisma.equipmentStaging.update({
      where: { id: parsedId },
      data: {
        desaKelurahanId,
        saranaId,
        quantity,
        unit: unit || null,
        isUsable: isUsable !== false,
        isGovernmentGrant: isGovernmentGrant || false,
        year: year || null,
        actionType: actionType || 'UPDATE',
        referenceId: referenceId || record.referenceId || record.id,
        status: 'PENDING',
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        updatedAt: new Date(),
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

    const response: EquipmentResponse = {
      id: updatedRecord.id,
      desaKelurahanId: updatedRecord.desaKelurahanId,
      saranaId: updatedRecord.saranaId,
      quantity: updatedRecord.quantity,
      unit: updatedRecord.unit || undefined,
      isUsable: updatedRecord.isUsable,
      isGovernmentGrant: updatedRecord.isGovernmentGrant,
      year: updatedRecord.year || undefined,
      status: updatedRecord.status,
      rejectionReason: updatedRecord.rejectionReason || undefined,
      submittedBy: updatedRecord.submittedBy,
      createdAt: updatedRecord.createdAt.toISOString(),
      desaKelurahanName: updatedRecord.desaKelurahan.nama,
      kecamatanName: updatedRecord.desaKelurahan.kecamatan?.nama || '',
      saranaName: updatedRecord.sarana.nama,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/staging/equipment/[id] error:', error);
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
        { message: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    const record = await prisma.equipmentStaging.findUnique({
      where: { id: parsedId },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Equipment not found' },
        { status: 404 }
      );
    }

    await prisma.equipmentStaging.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/staging/equipment/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}