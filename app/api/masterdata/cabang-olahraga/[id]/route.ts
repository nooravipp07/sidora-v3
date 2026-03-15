import { NextRequest, NextResponse } from 'next/server';
import { CabangOlahragaService } from '@/services/cabang-olahraga.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const result = await CabangOlahragaService.getById(idNum);

    if (!result) {
      return NextResponse.json(
        { error: 'Cabang olahraga not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching cabang olahraga:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cabang olahraga' },
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
    const result = await CabangOlahragaService.update(idNum, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating cabang olahraga:', error);
    return NextResponse.json(
      { error: 'Failed to update cabang olahraga' },
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
    const result = await CabangOlahragaService.delete(idNum);

    return NextResponse.json({ message: 'Cabang olahraga deleted successfully' });
  } catch (error) {
    console.error('Error deleting cabang olahraga:', error);
    return NextResponse.json(
      { error: 'Failed to delete cabang olahraga' },
      { status: 500 }
    );
  }
}
