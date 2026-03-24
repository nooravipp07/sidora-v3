import { NextRequest, NextResponse } from 'next/server';
import { getCombinedStats } from '@/lib/athlete/stats';

export async function GET(request: NextRequest) {
  try {
    const stats = await getCombinedStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching athlete stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athlete stats' },
      { status: 500 }
    );
  }
}
