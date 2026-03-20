import { NextRequest, NextResponse } from 'next/server';
import { SportsGroupService } from '@/services/sports-group.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid sports group ID' },
        { status: 400 }
      );
    }

    const result = await SportsGroupService.getById(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Sports group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sports group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sports group' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid sports group ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await SportsGroupService.update(id, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating sports group:', error);
    return NextResponse.json(
      { error: 'Failed to update sports group' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid sports group ID' },
        { status: 400 }
      );
    }

    await SportsGroupService.delete(id);

    return NextResponse.json({ message: 'Sports group deleted successfully' });
  } catch (error) {
    console.error('Error deleting sports group:', error);
    return NextResponse.json(
      { error: 'Failed to delete sports group' },
      { status: 500 }
    );
  }
}
