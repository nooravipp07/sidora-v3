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
  async getKecamatanSummary(): Promise<DashboardKecamatanSummaryResult> {
    const kecamatans = await prisma.kecamatan.findMany({
      where: { deletedAt: null },
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
      kec.totalAthletes += 1;
      kec.totalAchievement += athlete.achievements.length;
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
}

export const DashboardRepo = new DashboardRepository();
export type { KecamatanSummary, DashboardKecamatanSummaryResult };
