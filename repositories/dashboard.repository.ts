import { prisma } from '@/lib/prisma';

interface KecamatanSummaryBase {
  id: number;
  nama: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface KecamatanSummary extends KecamatanSummaryBase {
  totalEquipment: number;
  totalEquipmentQuantity: number;
  totalPrasarana: number;
  totalSportsGroups: number;
  totalAthletes: number;
  totalAchievement: number;
}

interface DashboardKecamatanSummaryResult {
  summary: {
    totalKecamatan: number;
    totalEquipment: number;
    totalEquipmentQuantity: number;
    totalPrasarana: number;
    totalSportsGroups: number;
    totalAthletes: number;
    totalAchievement: number;
  };
  kecamatan: KecamatanSummary[];
}

class DashboardRepository {
  async getKecamatanSummary(filters?: { kecamatanId?: number; year?: number }): Promise<DashboardKecamatanSummaryResult> {
    const { kecamatanId, year } = filters || {};

    const kecamatans = await prisma.kecamatan.findMany({
      where: {
        deletedAt: null,
        ...(kecamatanId ? { id: kecamatanId } : {}),
      },
      orderBy: { nama: 'asc' },
      select: {
        id: true,
        nama: true,
        latitude: true,
        longitude: true,
      },
    });

    const kecamatanIds = kecamatans.map((k) => k.id);

    const desaList = await prisma.desaKelurahan.findMany({
      where: {
        kecamatanId: { in: kecamatanIds },
        deletedAt: null,
      },
      select: {
        id: true,
        kecamatanId: true,
        nama: true,
        tipe: true,
        latitude: true,
        longitude: true,
      },
    });

    const desaIdToKecamatanId = new Map<number, number>();
    desaList.forEach((desa) => {
      desaIdToKecamatanId.set(desa.id, desa.kecamatanId);
    });

    const desaIds = desaList.map((desa) => desa.id);

    const equipmentGroup = await prisma.equipment.groupBy({
      by: ['desaKelurahanId'],
      where: {
        desaKelurahanId: { in: desaIds },
        deletedAt: null,
      },
      _count: {
        id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    const facilityRecordGroup = await prisma.facilityRecord.groupBy({
      by: ['desaKelurahanId'],
      where: {
        desaKelurahanId: { in: desaIds },
        ...(year ? { year } : {}),
      },
      _count: {
        id: true,
      },
    });

    const sportsGroupGroup = await prisma.sportsGroup.groupBy({
      by: ['desaKelurahanId'],
      where: {
        desaKelurahanId: { in: desaIds },
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });

    const athletesWithAchievements = await prisma.athlete.findMany({
      where: {
        desaKelurahanId: { in: desaIds },
        deletedAt: null,
      },
      select: {
        id: true,
        desaKelurahanId: true,
        achievements: {
          where: year ? { year } : {},
          select: {
            id: true,
          },
        },
      },
    });

    const kecamatanMap = new Map<number, KecamatanSummary>(
      kecamatans.map((kecamatan) => [
        kecamatan.id,
        {
          id: kecamatan.id,
          nama: kecamatan.nama,
          latitude: kecamatan.latitude,
          longitude: kecamatan.longitude,
          totalEquipment: 0,
          totalEquipmentQuantity: 0,
          totalPrasarana: 0,
          totalSportsGroups: 0,
          totalAthletes: 0,
          totalAchievement: 0,
        },
      ])
    );

    // equipment
    equipmentGroup.forEach((row) => {
      const kecamatanId = desaIdToKecamatanId.get(row.desaKelurahanId);
      if (!kecamatanId) return;
      const kec = kecamatanMap.get(kecamatanId);
      if (!kec) return;

      kec.totalEquipment += row._count.id;
      kec.totalEquipmentQuantity += row._sum.quantity ?? 0;
    });

    // facility records (prasarana)
    facilityRecordGroup.forEach((row) => {
      const kecamatanId = desaIdToKecamatanId.get(row.desaKelurahanId);
      if (!kecamatanId) return;
      const kec = kecamatanMap.get(kecamatanId);
      if (!kec) return;
      kec.totalPrasarana += row._count.id;
    });

    // sports groups
    sportsGroupGroup.forEach((row) => {
      const kecamatanId = desaIdToKecamatanId.get(row.desaKelurahanId);
      if (!kecamatanId) return;
      const kec = kecamatanMap.get(kecamatanId);
      if (!kec) return;
      kec.totalSportsGroups += row._count.id;
    });

    // athletes + achievement
    athletesWithAchievements.forEach((athlete) => {
      const kecamatanId = desaIdToKecamatanId.get(athlete.desaKelurahanId);
      if (!kecamatanId) return;
      const kec = kecamatanMap.get(kecamatanId);
      if (!kec) return;

      const achievementsCount = athlete.achievements.length;
      if (year) {
        if (achievementsCount > 0) {
          kec.totalAthletes += 1;
        }
      } else {
        kec.totalAthletes += 1;
      }

      kec.totalAchievement += achievementsCount;
    });

    const kecamatanSummary = Array.from(kecamatanMap.values());

    const totals = kecamatanSummary.reduce(
      (acc, item) => {
        acc.totalEquipment += item.totalEquipment;
        acc.totalEquipmentQuantity += item.totalEquipmentQuantity;
        acc.totalPrasarana += item.totalPrasarana;
        acc.totalSportsGroups += item.totalSportsGroups;
        acc.totalAthletes += item.totalAthletes;
        acc.totalAchievement += item.totalAchievement;
        return acc;
      },
      {
        totalKecamatan: kecamatanSummary.length,
        totalEquipment: 0,
        totalEquipmentQuantity: 0,
        totalPrasarana: 0,
        totalSportsGroups: 0,
        totalAthletes: 0,
        totalAchievement: 0,
      }
    );

    return {
      summary: totals,
      kecamatan: kecamatanSummary,
    };
  }

  async getInfrastructureSummary() {
    const [totalEquipment, totalPrasarana, totalSportsGroups, totalAthletes] = await Promise.all([
      prisma.equipment.count({
        where: { deletedAt: null }
      }),
      prisma.facilityRecord.count(),
      prisma.sportsGroup.count({
        where: { deletedAt: null }
      }),
      prisma.athlete.count({
        where: { deletedAt: null }
      })
    ]);

    return {
      totalEquipment,
      totalPrasarana,
      totalSportsGroups,
      totalAthletes
    };
  }

  async getAchievementTrendsByYear(filters?: { kecamatanId?: number }): Promise<{ years: number[]; counts: number[] }> {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    
    const { kecamatanId } = filters || {};

    // Get kecamatan IDs based on filter
    let kecamatanIds: number[] = [];
    if (kecamatanId) {
      kecamatanIds = [kecamatanId];
    } else {
      const kecamatans = await prisma.kecamatan.findMany({
        where: { deletedAt: null },
        select: { id: true },
      });
      kecamatanIds = kecamatans.map((k) => k.id);
    }

    // Get desa IDs
    const desaList = await prisma.desaKelurahan.findMany({
      where: {
        kecamatanId: { in: kecamatanIds },
        deletedAt: null,
      },
      select: { id: true },
    });

    const desaIds = desaList.map((desa) => desa.id);

    if (desaIds.length === 0) {
      return {
        years,
        counts: Array(years.length).fill(0),
      };
    }

    // Count achievements by year
    const achievementCounts = await prisma.athleteAchievement.groupBy({
      by: ['year'],
      where: {
        year: { in: years },
        athlete: {
          desaKelurahanId: { in: desaIds },
          deletedAt: null,
        },
      },
      _count: {
        id: true,
      },
    });

    // Create a map of year to count
    const yearCountMap = new Map<number, number>();
    years.forEach((year) => yearCountMap.set(year, 0));
    
    achievementCounts.forEach((row) => {
      if (row.year && years.includes(row.year)) {
        yearCountMap.set(row.year, row._count.id);
      }
    });

    const counts = years.map((year) => yearCountMap.get(year) || 0);

    return {
      years,
      counts,
    };
  }
}

export const DashboardRepo = new DashboardRepository();
export type { KecamatanSummary, DashboardKecamatanSummaryResult };
