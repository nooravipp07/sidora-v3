import { NextRequest, NextResponse } from 'next/server';
import { PrasaranaService } from '@/services/prasarana.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    const result = await PrasaranaService.getById(idNum);

    if (!result) {
      return NextResponse.json(
        { error: 'Prasarana not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching prasarana:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prasarana' },
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
    const result = await PrasaranaService.update(idNum, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating prasarana:', error);
    return NextResponse.json(
      { error: 'Failed to update prasarana' },
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
    const result = await PrasaranaService.delete(idNum);

    return NextResponse.json({ message: 'Prasarana deleted successfully' });
  } catch (error) {
    console.error('Error deleting prasarana:', error);
    return NextResponse.json(
      { error: 'Failed to delete prasarana' },
      { status: 500 }
    );
  }
}
