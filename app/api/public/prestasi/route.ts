import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get recent achievements
    const achievements = await prisma.athleteAchievement.findMany({
      take: 5,
      orderBy: { year: 'desc' },
      include: {
        athlete: {
          select: {
            fullName: true,
            sport: {
              select: {
                nama: true
              }
            }
          }
        }
      }
    });

    // Transform data to match Prestasi table format
    const prestasiData = achievements.map(achievement => ({
      nama: achievement.athlete.fullName,
      cabor: achievement.athlete.sport?.nama || 'Tidak Ditentukan',
      kategori: achievement.category || 'Atlet',
      prestasi: achievement.achievementName,
      medali: achievement.medal || '-',
      tahun: achievement.year?.toString() || new Date().getFullYear().toString()
    }));

    return NextResponse.json({
      success: true,
      data: prestasiData
    });
  } catch (error) {
    console.error('Error fetching prestasi data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prestasi data' },
      { status: 500 }
    );
  }
}
