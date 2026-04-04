import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all kecamatan
    const kecamatanList = await prisma.kecamatan.findMany({
      where: { deletedAt: null },
      select: { id: true, nama: true },
      orderBy: { nama: 'asc' }
    });

    // For each kecamatan, get facility record data
    const saranaByKecamatan = await Promise.all(
      kecamatanList.map(async (kecamatan) => {
        // Get all desa in this kecamatan
        const desaIds = await prisma.desaKelurahan.findMany({
          where: { kecamatanId: kecamatan.id },
          select: { id: true }
        }).then(result => result.map(d => d.id));

        // Get all facility records for this kecamatan
        const facilities = await prisma.facilityRecord.findMany({
          where: {
            desaKelurahanId: { in: desaIds }
          },
          include: {
            prasarana: {
              select: { jenis: true }
            }
          }
        });

        // Count by condition and type
        let kondisiBaik = 0;
        let kondisiRusak = 0;
        let lapangan = 0;
        let gedung = 0;
        let kolam = 0;

        facilities.forEach(facility => {
          // Count by condition
          if (facility.condition === '1') {
            kondisiBaik++;
          } else if (facility.condition === '4') {
            kondisiRusak++;
          }

          // Count by prasarana type
          const jenis = facility.prasarana?.jenis?.toLowerCase() || '';
          if (jenis.includes('lapangan')) {
            lapangan++;
          } else if (jenis.includes('gedung')) {
            gedung++;
          } else if (jenis.includes('kolam') || jenis.includes('renang')) {
            kolam++;
          }
        });

        return {
          kecamatan: kecamatan.nama,
          totalFacilitas: facilities.length,
          lapangan,
          gedung,
          kolam,
          kondisiBaik,
          kondisiRusak
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: saranaByKecamatan
    });
  } catch (error) {
    console.error('Error fetching sarana data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sarana data' },
      { status: 500 }
    );
  }
}
