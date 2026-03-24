import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kecamatanId = searchParams.get('kecamatanId');

    if (!kecamatanId) {
      return NextResponse.json(
        { error: 'kecamatanId is required' },
        { status: 400 }
      );
    }

    const kecamatanIdNum = parseInt(kecamatanId);

    // Get kecamatan info
    const kecamatan = await prisma.kecamatan.findUnique({
      where: { id: kecamatanIdNum },
    });

    if (!kecamatan) {
      return NextResponse.json(
        { error: 'Kecamatan not found' },
        { status: 404 }
      );
    }

    // Get desa/kelurahan data
    const desaKelurahan = await prisma.desaKelurahan.findMany({
      where: {
        kecamatanId: kecamatanIdNum,
        deletedAt: null,
      },
    });

    // Get facility records (prasarana) for this kecamatan
    const facilityRecords = await prisma.facilityRecord.findMany({
      where: {
        desaKelurahan: {
          kecamatanId: kecamatanIdNum,
        },
      },
      include: {
        desaKelurahan: true,
        prasarana: true,
      },
    });

    // Get sports groups for this kecamatan
    const sportsGroups = await prisma.sportsGroup.findMany({
      where: {
        desaKelurahan: {
          kecamatanId: kecamatanIdNum,
        },
        deletedAt: null,
      },
      include: {
        desaKelurahan: true,
      },
    });

    // Get athletes for this kecamatan
    const athletes = await prisma.athlete.findMany({
      where: {
        desaKelurahan: {
          kecamatanId: kecamatanIdNum,
        },
        deletedAt: null,
      },
      include: {
        desaKelurahan: true,
        sport: true,
        achievements: true,
      },
    });

    // Calculate summary statistics
    const totalDesaKelurahan = desaKelurahan.length;
    const totalInfrastructure = facilityRecords.length;
    const totalSportsGroups = sportsGroups.length;
    const totalAthletes = athletes.length;

    // Group athletes by category
    const athletesByCategory = {
      atlet: athletes.filter(a => a.category === 'ATLET').length,
      pelatih: athletes.filter(a => a.category === 'PELATIH').length,
      wasitJuri: athletes.filter(a => a.category === 'WASIT - JURI').length,
    };

    return NextResponse.json({
      success: true,
      kecamatan,
      summary: {
        totalDesaKelurahan,
        totalInfrastructure,
        totalSportsGroups,
        totalAthletes,
        athletesByCategory,
      },
      data: {
        desaKelurahan,
        facilityRecords,
        sportsGroups,
        athletes,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard kecamatan data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
