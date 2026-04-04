import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const kecamatan = await prisma.kecamatan.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        nama: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: kecamatan
    });
  } catch (error) {
    console.error('Error fetching kecamatan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch kecamatan data' },
      { status: 500 }
    );
  }
}
