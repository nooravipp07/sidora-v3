import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/middleware';

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
    const records = await prisma.facilityRecordStaging.findMany({
      where: filter,
      include: {
        desaKelurahan: {
          select: { id: true, nama: true },
        },
        prasarana: {
          select: { id: true, nama: true },
        },
        photos: {
          select: { id: true, fileUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await prisma.facilityRecordStaging.count({ where: filter });

    return NextResponse.json({
      data: records,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/staging/facility-record error:', error);
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

    // Parse request body
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
    } = body;

    // Validate required fields
    if (!desaKelurahanId || !prasaranaId || !address || !condition) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify desa/kelurahan and prasarana exist
    const [desaKelurahan, prasarana] = await Promise.all([
      prisma.desaKelurahan.findUnique({ where: { id: desaKelurahanId } }),
      prisma.prasarana.findUnique({ where: { id: prasaranaId } }),
    ]);

    if (!desaKelurahan || !prasarana) {
      return NextResponse.json(
        { message: 'Invalid desa/kelurahan or prasarana' },
        { status: 400 }
      );
    }

    // For kecamatan users, verify they can only submit for their kecamatan
    if (user.roleId === 3 && desaKelurahan.kecamatanId !== user.kecamatanId) {
      return NextResponse.json(
        { message: 'You can only submit data for your kecamatan' },
        { status: 403 }
      );
    }

    // Prepare photo data if any
    const photoData = Array.isArray(photos)
      ? photos
          .filter(photo => photo?.fileUrl)
          .map(photo => ({
            fileUrl: photo.fileUrl,
            fileName: photo.fileName || null,
            fileSize: photo.fileSize || null,
            mimeType: photo.mimeType || null,
            uploadedBy: user.email,
          }))
      : [];

    // Create staging record
    const record = await prisma.facilityRecordStaging.create({
      data: {
        desaKelurahanId,
        prasaranaId,
        year,
        condition,
        ownershipStatus: ownershipStatus || 'OWNED',
        address,
        notes: notes || '',
        isActive: isActive !== false,
        actionType: 'CREATE',
        status: 'PENDING',
        submittedBy: user.email,
        photos: photoData.length
          ? {
              create: photoData,
            }
          : undefined,
      },
      include: {
        desaKelurahan: { select: { id: true, nama: true } },
        prasarana: { select: { id: true, nama: true } },
      },
    });

    return NextResponse.json({
      message: 'Data submitted successfully',
      data: record,
    });
  } catch (error) {
    console.error('POST /api/staging/facility-record error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
