import { NextRequest, NextResponse } from 'next/server';
import { KecamatanService } from '@/services/kecamatan.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const nama = searchParams.get('nama') || undefined;

    const result = await KecamatanService.getAll(
      { nama },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching kecamatan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kecamatan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await KecamatanService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating kecamatan:', error);
    return NextResponse.json(
      { error: 'Failed to create kecamatan' },
      { status: 500 }
    );
  }
}
