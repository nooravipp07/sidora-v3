import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all sports groups with their related location data
    const sportsGroups = await prisma.sportsGroup.findMany({
      include: {
        desaKelurahan: {
          select: {
            nama: true,
            kecamatan: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
      orderBy: [
        { groupName: 'asc' },
      ],
    });

    // Transform data to match UI requirements
    const transformedData = sportsGroups.map(group => ({
      id: group.id,
      namaKelompok: group.groupName,
      cabor: 'Umum', // SportsGroup tidak memiliki info cabor, set sebagai 'Umum'
      lokasi: `${group.desaKelurahan.nama}, ${group.desaKelurahan.kecamatan.nama}`,
      ketua: group.leaderName || 'Belum ditentukan',
      anggota: group.memberCount,
    }));

    // Calculate summary statistics
    const totalKelompok = transformedData.length;
    const totalAnggota = transformedData.reduce((sum, group) => sum + group.anggota, 0);

    return NextResponse.json({
      success: true,
      data: transformedData,
      summary: {
        totalKelompok,
        totalAnggota,
      },
      total: transformedData.length,
    });
  } catch (error) {
    console.error('Error fetching sports groups:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sports groups', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
