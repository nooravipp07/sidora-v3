import { NextRequest, NextResponse } from 'next/server';
import { DesaKelurahanService } from '@/services/desa-kelurahan.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const result = await DesaKelurahanService.getById(idNum);

    if (!result) {
      return NextResponse.json(
        { error: 'Desa kelurahan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching desa kelurahan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch desa kelurahan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const body = await request.json();
    const result = await DesaKelurahanService.update(idNum, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating desa kelurahan:', error);
    return NextResponse.json(
      { error: 'Failed to update desa kelurahan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const result = await DesaKelurahanService.delete(idNum);

    return NextResponse.json({ message: 'Desa kelurahan deleted successfully' });
  } catch (error) {
    console.error('Error deleting desa kelurahan:', error);
    return NextResponse.json(
      { error: 'Failed to delete desa kelurahan' },
      { status: 500 }
    );
  }
}
