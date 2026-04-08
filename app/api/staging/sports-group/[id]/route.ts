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
  rejectionReason?: string;
  submittedBy: string;
  createdAt: string;
  desaKelurahanName: string;
  kecamatanName: string;
  sportName?: string;
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

    const record = await prisma.sportsGroupStaging.findUnique({
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

    if (!record) {
      return NextResponse.json(
        { message: 'Sports group not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this record
    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Kecamatan users can only access their own kecamatan's records
    if (user.roleId === 3 && user.kecamatanId) {
      if (record.desaKelurahan.kecamatanId !== user.kecamatanId) {
        return NextResponse.json(
          { message: 'Access denied' },
          { status: 403 }
        );
      }
    }

    const response: SportsGroupResponse = {
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
      rejectionReason: record.rejectionReason || undefined,
      submittedBy: record.submittedBy,
      createdAt: record.createdAt.toISOString(),
      desaKelurahanName: record.desaKelurahan.nama,
      kecamatanName: record.desaKelurahan.kecamatan?.nama || '',
      sportName: record.sport?.nama || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/staging/sports-group/[id] error:', error);
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
      actionType,
      referenceId,
    } = body;

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

    const existingRecord = await prisma.sportsGroupStaging.findUnique({
      where: { id: parsedId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { message: 'Sports group not found' },
        { status: 404 }
      );
    }

    if (existingRecord.submittedBy !== auth.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized to edit this record' },
        { status: 403 }
      );
    }

    const updatedRecord = await prisma.sportsGroupStaging.update({
      where: { id: parsedId },
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
        actionType: actionType || 'UPDATE',
        referenceId: referenceId || existingRecord.referenceId || existingRecord.id,
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
        sport: {
          select: { id: true, nama: true },
        },
      },
    });

    const response: SportsGroupResponse = {
      id: updatedRecord.id,
      desaKelurahanId: updatedRecord.desaKelurahanId,
      groupName: updatedRecord.groupName,
      leaderName: updatedRecord.leaderName || undefined,
      memberCount: updatedRecord.memberCount,
      isVerified: updatedRecord.isVerified,
      decreeNumber: updatedRecord.decreeNumber || undefined,
      secretariatAddress: updatedRecord.secretariatAddress || undefined,
      year: updatedRecord.year || undefined,
      sportId: updatedRecord.sportId || undefined,
      status: updatedRecord.status,
      rejectionReason: updatedRecord.rejectionReason || undefined,
      submittedBy: updatedRecord.submittedBy,
      createdAt: updatedRecord.createdAt.toISOString(),
      desaKelurahanName: updatedRecord.desaKelurahan.nama,
      kecamatanName: updatedRecord.desaKelurahan.kecamatan?.nama || '',
      sportName: updatedRecord.sport?.nama || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/staging/sports-group/[id] error:', error);
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
        { message: 'Invalid sports group ID' },
        { status: 400 }
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

    // Find the record first to check ownership
    const record = await prisma.sportsGroupStaging.findUnique({
      where: { id: parsedId },
      include: {
        desaKelurahan: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: 'Sports group not found' },
        { status: 404 }
      );
    }

    // Check if user owns this record (kecamatan users can only delete their own kecamatan's records)
    if (user.roleId === 3 && user.kecamatanId) {
      if (record.desaKelurahan.kecamatanId !== user.kecamatanId) {
        return NextResponse.json(
          { message: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Only allow deletion of pending records
    if (record.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Cannot delete non-pending records' },
        { status: 400 }
      );
    }

    // Delete the record
    await prisma.sportsGroupStaging.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: 'Sports group deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/staging/sports-group/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}