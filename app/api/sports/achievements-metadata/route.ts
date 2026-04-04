import { NextRequest, NextResponse } from 'next/server';
import { AthleteAchievementRepo } from '@/repositories/athlete-achievement.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = await AthleteAchievementRepo.getUniqueCategoriesFromAchievements();
      return NextResponse.json({ success: true, data: categories });
    }

    if (type === 'sports') {
      const sports = await AthleteAchievementRepo.getUniqueSportsFromAchievements();
      return NextResponse.json({ success: true, data: sports });
    }

    if (type === 'years') {
      // Get last 5 years from current year
      const currentYear = new Date().getFullYear();
      const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
      return NextResponse.json({ success: true, data: lastFiveYears });
    }

    if (type === 'kecamatan') {
      const kecamatan = await AthleteAchievementRepo.getKecamatanWithAchievements();
      return NextResponse.json({ success: true, data: kecamatan });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching achievement metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
