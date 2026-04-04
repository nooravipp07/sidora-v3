import { NextRequest, NextResponse } from 'next/server';
import { FacilityRecordRepo } from '@/repositories/facility-record.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId');
    const condition = searchParams.get('condition');

    const filters = {
      year: year ? parseInt(year) : undefined,
      kecamatanId: kecamatanId ? parseInt(kecamatanId) : undefined,
      condition: condition || undefined,
    };

    const data = await FacilityRecordRepo.getKecamatanSummary(filters);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching kecamatan summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
