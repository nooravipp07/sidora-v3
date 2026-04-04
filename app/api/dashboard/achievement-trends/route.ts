import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kecamatanId = searchParams.get('kecamatanId');

    const filters = {
      kecamatanId: kecamatanId ? Number(kecamatanId) : undefined,
    };

    const result = await DashboardService.getAchievementTrendsByYear(filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching achievement trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievement trends' },
      { status: 500 }
    );
  }
}
