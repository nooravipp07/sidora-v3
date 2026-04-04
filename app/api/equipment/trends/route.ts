import { NextRequest, NextResponse } from 'next/server';
import { EquipmentRepo } from '@/repositories/equipment.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const kecamatanId = searchParams.get('kecamatanId');

    const filters = {
      year: year ? parseInt(year) : undefined,
      kecamatanId: kecamatanId ? parseInt(kecamatanId) : undefined,
    };

    const data = await EquipmentRepo.getEquipmentTrends(filters);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching equipment trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment trends data' },
      { status: 500 }
    );
  }
}
