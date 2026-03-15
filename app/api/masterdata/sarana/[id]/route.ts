import { NextRequest, NextResponse } from 'next/server';
import { SaranaService } from '@/services/sarana.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const result = await SaranaService.getById(idNum);

    if (!result) {
      return NextResponse.json(
        { error: 'Sarana not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sarana:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sarana' },
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
    const result = await SaranaService.update(idNum, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating sarana:', error);
    return NextResponse.json(
      { error: 'Failed to update sarana' },
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
    const result = await SaranaService.delete(idNum);

    return NextResponse.json({ message: 'Sarana deleted successfully' });
  } catch (error) {
    console.error('Error deleting sarana:', error);
    return NextResponse.json(
      { error: 'Failed to delete sarana' },
      { status: 500 }
    );
  }
}
