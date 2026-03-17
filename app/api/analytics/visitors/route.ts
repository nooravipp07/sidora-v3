import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';

export async function GET(request: NextRequest) {
  try {
    const visitorStats = await AnalyticsService.getVisitorStats();
    return NextResponse.json(visitorStats);
  } catch (error) {
    console.error('Error in visitor statistics endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor statistics' },
      { status: 500 }
    );
  }
}
