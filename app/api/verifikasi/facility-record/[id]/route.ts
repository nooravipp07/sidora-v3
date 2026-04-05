import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

export async function POST(
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

    // Only admin can verify
    if (user.roleId !== 1) {
      return NextResponse.json(
        { message: 'Only admins can verify data' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const parsedId = parseInt(id);
    const body = await request.json();
    const { action, rejectionReason } = body;

    // Get staging record
    const stagingRecord = await prisma.facilityRecordStaging.findUnique({
      where: { id: parsedId },
      include: {
        photos: {
          select: {
            id: true,
            fileUrl: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
            photoType: true,
            description: true,
            takenAt: true,
            uploadedBy: true,
            isPrimary: true,
          },
        },
      },
    });

    if (!stagingRecord) {
      return NextResponse.json(
        { message: 'Record not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Check if record already exists in main table
      const existingRecord = await prisma.facilityRecord.findFirst({
        where: {
          desaKelurahanId: stagingRecord.desaKelurahanId,
          prasaranaId: stagingRecord.prasaranaId,
          year: stagingRecord.year,
        },
      });

      const photoCreateData = stagingRecord.photos?.length
        ? stagingRecord.photos.map(photo => ({
            fileUrl: photo.fileUrl,
            fileName: photo.fileName || null,
            fileSize: photo.fileSize || null,
            mimeType: photo.mimeType || null,
            photoType: photo.photoType || null,
            description: photo.description || null,
            takenAt: photo.takenAt || null,
            uploadedBy: photo.uploadedBy || null,
            isPrimary: photo.isPrimary,
          }))
        : [];

      // If UPDATE action and referenceId, update existing record
      if (stagingRecord.actionType === 'UPDATE' && stagingRecord.referenceId) {
        await prisma.facilityRecord.update({
          where: { id: stagingRecord.referenceId },
          data: {
            condition: stagingRecord.condition,
            ownershipStatus: stagingRecord.ownershipStatus,
            address: stagingRecord.address,
            notes: stagingRecord.notes,
            isActive: stagingRecord.isActive,
            photos: photoCreateData.length
              ? {
                  deleteMany: {},
                  create: photoCreateData,
                }
              : undefined,
          },
        });
      } else if (!existingRecord) {
        // CREATE action - add to main table
        await prisma.facilityRecord.create({
          data: {
            desaKelurahanId: stagingRecord.desaKelurahanId,
            prasaranaId: stagingRecord.prasaranaId,
            year: stagingRecord.year,
            condition: stagingRecord.condition,
            ownershipStatus: stagingRecord.ownershipStatus,
            address: stagingRecord.address,
            notes: stagingRecord.notes,
            isActive: stagingRecord.isActive,
            photos: photoCreateData.length
              ? {
                  create: photoCreateData,
                }
              : undefined,
          },
        });
      }

      // Update staging record
      const updated = await prisma.facilityRecordStaging.update({
        where: { id: parsedId },
        data: {
          status: 'APPROVED',
          reviewedBy: user.email,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Data approved and moved to main table',
        data: updated,
      });
    } else if (action === 'reject') {
      if (!rejectionReason?.trim()) {
        return NextResponse.json(
          { message: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      // Update staging record with rejection
      const updated = await prisma.facilityRecordStaging.update({
        where: { id: parsedId },
        data: {
          status: 'REJECTED',
          rejectionReason,
          reviewedBy: user.email,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Data rejected',
        data: updated,
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('POST /api/verifikasi/facility-record/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
