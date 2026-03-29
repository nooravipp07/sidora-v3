import { NextRequest, NextResponse } from 'next/server';
import { AthleteService } from '@/services/athlete.service';

const athleteService = new AthleteService();

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const athlete = await athleteService.getById(id);

    if (!athlete) {
      return NextResponse.json({ error: 'Atlet tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(athlete, { status: 200 });
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return NextResponse.json({ error: 'Gagal mengambil data atlet' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

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

    const result = await athleteService.update(id, body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error updating athlete:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('nationalId')) {
      return NextResponse.json({ error: 'NIK sudah terdaftar' }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || 'Gagal mengubah data atlet' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await athleteService.delete(id);

    return NextResponse.json({ message: 'Atlet berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting athlete:', error);
    return NextResponse.json({ error: 'Gagal menghapus atlet' }, { status: 500 });
  }
}
