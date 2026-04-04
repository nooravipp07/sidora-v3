import { NextRequest, NextResponse } from 'next/server';
import { AthleteAchievementRepo } from '@/repositories/athlete-achievement.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const medal = searchParams.get('medal');
    const year = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId');

    const filters = {
      category: category || undefined,
      medal: medal || undefined,
      year: year ? parseInt(year) : undefined,
      kecamatanId: kecamatanId ? parseInt(kecamatanId) : undefined
    };

    const stats = await AthleteAchievementRepo.getAchievementStats(filters);
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching athlete stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
