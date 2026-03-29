import { NextRequest, NextResponse } from 'next/server';
import { AthleteService } from '@/services/athlete.service';

const athleteService = new AthleteService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters = {
      kecamatanId: searchParams.get('kecamatanId'),
      desaKelurahanId: searchParams.get('desaKelurahanId'),
      sportId: searchParams.get('sportId'),
      gender: searchParams.get('gender'),
      status: searchParams.get('status'),
      birthYear: searchParams.get('birthYear'),
      search: searchParams.get('search'),
    };

    const result = await athleteService.getAll(filters, { page, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.nationalId?.trim()) {
      return NextResponse.json({ error: 'NIK harus diisi' }, { status: 400 });
    }

    if (!body.fullName?.trim()) {
      return NextResponse.json({ error: 'Nama Lengkap harus diisi' }, { status: 400 });
    }

    if (!body.desaKelurahanId) {
      return NextResponse.json({ error: 'Desa/Kelurahan harus dipilih' }, { status: 400 });
    }

    if (body.status && !['aktif', 'non-aktif'].includes(String(body.status).toLowerCase())) {
      return NextResponse.json({ error: 'Status harus "aktif" atau "non-aktif"' }, { status: 400 });
    }

    const result = await athleteService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating athlete:', error);
    
    // Handle unique constraint violation for nationalId
    if (error.code === 'P2002' && error.meta?.target?.includes('nationalId')) {
      return NextResponse.json({ error: 'NIK sudah terdaftar' }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || 'Gagal menambah atlet' }, { status: 500 });
  }
}
