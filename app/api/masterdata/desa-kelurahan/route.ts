import { NextRequest, NextResponse } from 'next/server';
import { DesaKelurahanService } from '@/services/desa-kelurahan.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const nama = searchParams.get('nama') || undefined;
    const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!, 10) : undefined;
    const tipe = searchParams.get('tipe') as any || undefined;

    const result = await DesaKelurahanService.getAll(
      { nama, kecamatanId, tipe },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching desa kelurahan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch desa kelurahan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await DesaKelurahanService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating desa kelurahan:', error);
    return NextResponse.json(
      { error: 'Failed to create desa kelurahan' },
      { status: 500 }
    );
  }
}
