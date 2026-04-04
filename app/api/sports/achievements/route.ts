import { NextRequest, NextResponse } from 'next/server';
import { AthleteAchievementRepo } from '@/repositories/athlete-achievement.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sportId = searchParams.get('sportId');
    const medal = searchParams.get('medal');
    const year = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId');
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    const skip = (page - 1) * limit;

    const filters = {
      category: category || undefined,
      sportId: sportId ? parseInt(sportId) : undefined,
      medal: medal || undefined,
      year: year ? parseInt(year) : undefined,
      kecamatanId: kecamatanId ? parseInt(kecamatanId) : undefined,
      skip,
      take: limit
    };

    const [achievements, total] = await Promise.all([
      AthleteAchievementRepo.getAchievementsWithFilters(filters),
      AthleteAchievementRepo.getAchievementsCount({
        category: filters.category,
        sportId: filters.sportId,
        medal: filters.medal,
        year: filters.year,
        kecamatanId: filters.kecamatanId
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: achievements,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
