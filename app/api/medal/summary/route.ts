import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';

/**
 * GET /api/medal/summary
 * Fetch total medal counts grouped by medal type
 * Filtered by organization and optional year
 *
 * Query params:
 * - organization: KONI | NPCI | etc (optional)
 * - year: number (optional, default: current year)
 *
 * Response: {
 *   success: boolean,
 *   data: {
 *     emasCount: number,
 *     perakCount: number,
 *     perungguCount: number,
 *     totalMedals: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get filters from query params
    const { searchParams } = new URL(request.url);
    const organization = searchParams.get('organization');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    // Fetch summary from service
    const medalSummary = await DashboardService.getMedalSummary(organization, year);

    return NextResponse.json(
      {
        success: true,
        data: medalSummary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching medal summary:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch medal summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
