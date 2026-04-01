import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all kecamatan with their equipment and facility data
    const kecamatanData = await prisma.kecamatan.findMany({
      where: { deletedAt: null },
      orderBy: { nama: 'asc' },
      include: {
        desaKelurahanList: {
          where: { deletedAt: null },
          select: {
            id: true,
            equipment: {
              where: { deletedAt: null },
              include: {
                sarana: {
                  select: {
                    id: true,
                    nama: true,
                    jenis: true
                  }
                }
              }
            },
            facilityRecords: {
              select: {
                id: true,
                condition: true,
                prasarana: {
                  select: {
                    id: true,
                    nama: true,
                    jenis: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Transform data to match Sarana table format
    const saranaByKecamatan = kecamatanData.map(kecamatan => {
      // Count equipment by type
      const equipment: { [key: string]: number } = {
        lapangan: 0,
        gedung: 0,
        kolam: 0
      };

      kecamatan.desaKelurahanList.forEach(desa => {
        desa.equipment.forEach(eq => {
          const jenis = eq.sarana.jenis?.toLowerCase() || '';
          const nama = eq.sarana.nama?.toLowerCase() || '';
          
          if (jenis.includes('lapangan') || nama.includes('lapangan')) {
            equipment.lapangan += eq.quantity;
          } else if (jenis.includes('gedung') || nama.includes('gedung')) {
            equipment.gedung += eq.quantity;
          } else if (jenis.includes('kolam') || jenis.includes('renang') || nama.includes('kolam') || nama.includes('renang')) {
            equipment.kolam += eq.quantity;
          }
        });
      });

      // Count facility conditions
      let kondisiBaik = 0;
      let kondisiRusak = 0;

      kecamatan.desaKelurahanList.forEach(desa => {
        desa.facilityRecords.forEach(fr => {
          const condition = fr.condition?.toLowerCase() || '';
          if (condition === 'baik' || condition === 'baik/berfungsi') {
            kondisiBaik++;
          } else if (condition === 'rusak' || condition === 'buruk' || condition === 'rusak berat') {
            kondisiRusak++;
          }
        });
      });

      return {
        kecamatan: kecamatan.nama,
        lapangan: equipment.lapangan,
        gedung: equipment.gedung,
        kolam: equipment.kolam,
        kondisiBaik,
        kondisiRusak
      };
    });

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
