import { NextRequest, NextResponse } from 'next/server';
import { EquipmentService } from '@/services/equipment.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const desaKelurahanId = searchParams.get('desaKelurahanId') || undefined;
    const saranaId = searchParams.get('saranaId') || undefined;
    const year = searchParams.get('year') || undefined;
    const isUsable = searchParams.get('isUsable') || undefined;

    const result = await EquipmentService.getAll(
      { desaKelurahanId, saranaId, year, isUsable },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await EquipmentService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
}
