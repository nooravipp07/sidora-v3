import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';

export async function GET(request: NextRequest) {
  try {
    const result = await DashboardService.getKecamatanSummary();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching kecamatan summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch kecamatan summary data' },
      { status: 500 }
    );
  }
}
