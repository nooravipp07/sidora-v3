import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get summary statistics
    const [
      totalAthletes,
      totalAchievements,
      totalEquipment,
      totalPrasarana,
      totalSportsGroups
    ] = await Promise.all([
      prisma.athlete.count({
        where: { deletedAt: null }
      }),
      prisma.athleteAchievement.count(),
      prisma.equipment.count({
        where: { deletedAt: null }
      }),
      prisma.facilityRecord.count(),
      prisma.sportsGroup.count({
        where: { deletedAt: null }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAthletes,
        totalAchievements,
        totalEquipment,
        totalPrasarana,
        totalSportsGroups
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
