import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

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

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);
    const record = await prisma.facilityRecordStaging.findUnique({
      where: { id: parsedId },
      include: {
        desaKelurahan: { select: { id: true, nama: true } },
        prasarana: { select: { id: true, nama: true } },
        photos: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Record not found' },
        { status: 404 }
      );
    }

    // Check authorization - only submitter or admin can view
    if (user.roleId !== 1 && record.submittedBy !== user.email) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error('GET /api/staging/facility-record/[id] error:', error);
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

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { message: 'Invalid facility record ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      desaKelurahanId,
      prasaranaId,
      year,
      condition,
      ownershipStatus,
      address,
      notes,
      isActive,
      photos,
      actionType,
      referenceId,
    } = body;

    if (!desaKelurahanId || !prasaranaId || !address || !condition) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const record = await prisma.facilityRecordStaging.findUnique({
      where: { id: parsedId },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Record not found' },
        { status: 404 }
      );
    }

    if (record.submittedBy !== auth.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized to edit this record' },
        { status: 403 }
      );
    }

    const photoData = Array.isArray(photos)
      ? photos
          .filter((photo: any) => photo?.fileUrl)
          .map((photo: any) => ({
            fileUrl: photo.fileUrl,
            fileName: photo.fileName || null,
            fileSize: photo.fileSize || null,
            mimeType: photo.mimeType || null,
            uploadedBy: auth.user.email,
          }))
      : [];

    const updatedRecord = await prisma.facilityRecordStaging.update({
      where: { id: parsedId },
      data: {
        desaKelurahanId,
        prasaranaId,
        year,
        condition,
        ownershipStatus: ownershipStatus || 'OWNED',
        address,
        notes: notes || '',
        isActive: isActive !== false,
        actionType: actionType || 'UPDATE',
        referenceId: referenceId || record.referenceId || record.id,
        status: 'PENDING',
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        updatedAt: new Date(),
        photos: {
          deleteMany: {},
          create: photoData,
        },
      },
      include: {
        desaKelurahan: { select: { id: true, nama: true } },
        prasarana: { select: { id: true, nama: true } },
        photos: true,
      },
    });

    return NextResponse.json({ data: updatedRecord });
  } catch (error) {
    console.error('PUT /api/staging/facility-record/[id] error:', error);
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

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);
    const record = await prisma.facilityRecordStaging.findUnique({
      where: { id: parsedId },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Record not found' },
        { status: 404 }
      );
    }

    // Check authorization - only submitter or admin can delete
    if (user.roleId !== 1 && record.submittedBy !== user.email) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Can only delete PENDING or REJECTED records
    if (!['PENDING', 'REJECTED'].includes(record.status)) {
      return NextResponse.json(
        { message: 'Can only delete PENDING or REJECTED records' },
        { status: 400 }
      );
    }

    // Delete record and associated photos
    await prisma.facilityRecordStaging.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({
      message: 'Record deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/staging/facility-record/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
