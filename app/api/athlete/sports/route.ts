import { NextResponse } from 'next/server';
import { CabangOlahragaService } from '@/services/cabang-olahraga.service';

export async function GET() {
  try {
    const result = await CabangOlahragaService.getAll(
      {},
      { page: 1, limit: 1000 }
    );

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sports' },
      { status: 500 }
    );
  }
}
