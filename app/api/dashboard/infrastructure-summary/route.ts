import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId');
    const condition = searchParams.get('condition');

    const whereClause: any = {};
    if (year) {
      whereClause.year = parseInt(year);
    }
    if (condition) {
      whereClause.condition = condition;
    }

    let equipmentWhere: any = { deletedAt: null };
    let sportsGroupWhere: any = { deletedAt: null };
    let athleteWhere: any = { deletedAt: null };

    if (kecamatanId) {
      const desaIds = await prisma.desaKelurahan.findMany({
        where: { kecamatanId: parseInt(kecamatanId) },
        select: { id: true }
      }).then(result => result.map(d => d.id));

      equipmentWhere.desaKelurahanId = { in: desaIds };
      sportsGroupWhere.desaKelurahanId = { in: desaIds };
      athleteWhere.desaKelurahanId = { in: desaIds };

      whereClause.desaKelurahanId = { in: desaIds };
    }

    const [totalEquipment, totalPrasarana, totalSportsGroups, totalAthletes] = await Promise.all([
      prisma.equipment.count({ where: equipmentWhere }),
      prisma.facilityRecord.count({ where: whereClause }),
      prisma.sportsGroup.count({ where: sportsGroupWhere }),
      prisma.athlete.count({ where: athleteWhere })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalEquipment,
        totalPrasarana,
        totalSportsGroups,
        totalAthletes
      },
    });
  } catch (error) {
    console.error('Error fetching infrastructure summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infrastructure summary data' },
      { status: 500 }
    );
  }
}
