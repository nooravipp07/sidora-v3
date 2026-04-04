import { NextRequest, NextResponse } from 'next/server';
import { AthleteService } from '@/services/athlete.service';

const athleteService = new AthleteService();

/**
 * GET /api/athlete/summary
 * Fetch athlete summary grouped by category (ATLET, PELATIH, WASIT) 
 * Filtered by organization based on user's roleId
 * 
 * Query params:
 * - organization: KONI | NPCI | etc (optional)
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     totalAtlet: number,
 *     totalPelatih: number,
 *     totalWasit: number,
 *     total: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get organization filter from query params
    const { searchParams } = new URL(request.url);
    const organization = searchParams.get('organization');

    // Fetch summary from service
    const summary = await athleteService.getSummary(organization);

    return NextResponse.json(
      {
        success: true,
        data: summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching athlete summary:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch athlete summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

