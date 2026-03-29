import { NextRequest, NextResponse } from 'next/server';
import { SportsGroupService } from '@/services/sports-group.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const filter = {
      kecamatanId: searchParams.get('kecamatanId') || undefined,
      desaKelurahanId: searchParams.get('desaKelurahanId') || undefined,
      year: searchParams.get('year') || undefined,
      isVerified: searchParams.get('isVerified') || undefined,
    };

    const result = await SportsGroupService.getAll(filter, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sports groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sports groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.groupName) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    if (!body.desaKelurahanId) {
      return NextResponse.json(
        { error: 'Desa/Kelurahan is required' },
        { status: 400 }
      );
    }

    const result = await SportsGroupService.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating sports group:', error);
    return NextResponse.json(
      { error: 'Failed to create sports group' },
      { status: 500 }
    );
  }
}
