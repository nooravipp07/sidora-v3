import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kecamatanId = searchParams.get('kecamatanId');
    const year = searchParams.get('year');
    const desaKelurahanId = searchParams.get('desaKelurahanId');

    if (!kecamatanId) {
      return NextResponse.json(
        { error: 'kecamatanId is required' },
        { status: 400 }
      );
    }

    const kecamatanIdNum = parseInt(kecamatanId);
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

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

    // Get desa/kelurahan data with filter
    const desaKelurahanWhere: any = {
      kecamatanId: kecamatanIdNum,
      deletedAt: null,
    };

    if (desaKelurahanId) {
      desaKelurahanWhere.id = parseInt(desaKelurahanId);
    }

    const desaKelurahan = await prisma.desaKelurahan.findMany({
      where: desaKelurahanWhere,
    });

    const desaIds = desaKelurahan.map((d) => d.id);

    // Get facility records (prasarana) for selected desa/kelurahan
    const facilityRecords = await prisma.facilityRecord.findMany({
      where: {
        desaKelurahanId: {
          in: desaIds,
        },
      },
      include: {
        desaKelurahan: true,
        prasarana: true,
        photos: true,
      },
    });

    // Get sarana (equipment) for selected desa/kelurahan
    const equipments = await prisma.equipment.findMany({
      where: {
        desaKelurahanId: {
          in: desaIds,
        },
        deletedAt: null,
      },
      include: {
        desaKelurahan: true,
        sarana: true,
      },
    });

    // Get sports groups for selected desa/kelurahan
    const sportsGroups = await prisma.sportsGroup.findMany({
      where: {
        desaKelurahanId: {
          in: desaIds,
        },
        deletedAt: null,
      },
      include: {
        desaKelurahan: true,
      },
    });

    // Get athletes for selected desa/kelurahan with achievements filtered by year
    const athletes = await prisma.athlete.findMany({
      where: {
        desaKelurahanId: {
          in: desaIds,
        },
        deletedAt: null,
      },
      include: {
        desaKelurahan: true,
        sport: true,
        achievements: {
          where: {
            year: currentYear,
          },
        },
      },
    });

    // Calculate summary statistics per desa/kelurahan
    const desaSummary = desaKelurahan.map((desa) => {
      const desaFacilities = facilityRecords.filter((f) => f.desaKelurahanId === desa.id);
      const desaSportsGroups = sportsGroups.filter((s) => s.desaKelurahanId === desa.id);
      const desaAthletes = athletes.filter((a) => a.desaKelurahanId === desa.id);
      const desaAchievements = desaAthletes.reduce((total, athlete) => total + athlete.achievements.length, 0);

      return {
        id: desa.id,
        nama: desa.nama,
        tipe: desa.tipe,
        totalFacility: desaFacilities.length,
        totalSportsGroups: desaSportsGroups.length,
        totalAthlete: desaAthletes.length,
        totalAchievement: desaAchievements,
        latitude: desa.latitude,
        longitude: desa.longitude,
      };
    });

    // Calculate overall summary statistics
    const totalDesaKelurahan = desaKelurahan.length;
    const totalInfrastructure = facilityRecords.length;
    const totalSarana = equipments.length;
    const totalSportsGroups = sportsGroups.length;
    const totalAthletes = athletes.length;
    const totalAchievement = desaSummary.reduce((acc, item) => acc + item.totalAchievement, 0);

    // Group athletes by category
    const athletesByCategory = {
      atlet: athletes.filter((a) => a.category === 'ATLET').length,
      pelatih: athletes.filter((a) => a.category === 'PELATIH').length,
      wasitJuri: athletes.filter((a) => a.category === 'WASIT - JURI').length,
    };

    return NextResponse.json({
      success: true,
      kecamatan,
      summary: {
        totalDesaKelurahan,
        totalInfrastructure,
        totalSarana,
        totalSportsGroups,
        totalAthletes,
        totalAchievement,
        athletesByCategory,
      },
      data: {
        desaKelurahan: desaSummary,
        facilityRecords,
        sportsGroups,
        athletes,
        equipments,
      },
      filters: {
        year: currentYear,
        desaKelurahanId: desaKelurahanId ? parseInt(desaKelurahanId) : null,
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
