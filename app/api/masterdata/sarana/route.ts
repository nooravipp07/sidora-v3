import { NextRequest, NextResponse } from 'next/server';
import { SaranaService } from '@/services/sarana.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const nama = searchParams.get('nama') || undefined;
    const jenis = searchParams.get('jenis') || undefined;

    const result = await SaranaService.getAll(
      { nama, jenis },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sarana:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sarana' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await SaranaService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating sarana:', error);
    return NextResponse.json(
      { error: 'Failed to create sarana' },
      { status: 500 }
    );
  }
}
