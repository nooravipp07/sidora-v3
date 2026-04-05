import { NextRequest, NextResponse } from 'next/server';
import { KecamatanService } from '@/services/kecamatan.service';

/**
 * GET /api/kecamatan/summary
 * Fetch kecamatan summary with athlete counts by category and medal counts
 * Grouped by kecamatan, filtered by organization if provided
 *
 * Query params:
 * - organization: KONI | NPCI | etc (optional)
 *
 * Response: Array of kecamatan data with summary statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get organization filter from query params
    const { searchParams } = new URL(request.url);
    const organization = searchParams.get('organization');

    // Fetch summary from service
    const summaryData = await KecamatanService.getSummary(organization);

    return NextResponse.json(
      {
        success: true,
        data: summaryData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching kecamatan summary:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch kecamatan summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
