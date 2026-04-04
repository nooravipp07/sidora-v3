import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { FacilityRecord } from '@/types/masterdata';

class FacilityRecordRepository extends AbstractRepository<FacilityRecord> {
    constructor() {
        super(prisma.facilityRecord);
    }

    async findWithRelations(
        where: any = {},
        pagination: any = { page: 1, limit: 10 }
    ) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;

        const whereClause = {
            ...where,
        };

        const [data, total] = await Promise.all([
            prisma.facilityRecord.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    prasarana: true,
                    desaKelurahan: {
                        include: {
                            kecamatan: true
                        }
                    },
                    photos: true
                },
                orderBy: { year: 'desc' }
            }),
            prisma.facilityRecord.count({ where: whereClause })
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page < Math.ceil(total / limit)
            }
        };
    }

    async findByIdWithRelations(id: number) {
        return prisma.facilityRecord.findUnique({
            where: { id },
            include: {
                prasarana: true,
                desaKelurahan: {
                    include: {
                        kecamatan: true
                    }
                },
                photos: true
            }
        });
    }

    async getFacilitiesPerKecamatan(filters?: { year?: number; kecamatanId?: number; condition?: string }) {
        const whereClause: any = {};
        if (filters?.year) {
            whereClause.year = filters.year;
        }
        if (filters?.kecamatanId) {
            whereClause.desaKelurahanId = {
                in: await prisma.desaKelurahan.findMany({
                    where: { kecamatanId: filters.kecamatanId },
                    select: { id: true }
                }).then(result => result.map(d => d.id))
            };
        }
        if (filters?.condition) {
            whereClause.condition = filters.condition;
        }

        const facilities = await prisma.facilityRecord.findMany({
            where: whereClause,
            include: {
                desaKelurahan: {
                    include: {
                        kecamatan: true
                    }
                }
            }
        });

        // Group by kecamatan
        const groupedByKecamatan = new Map<number, { nama: string; count: number }>();

        facilities.forEach(facility => {
            const kecamatan = facility.desaKelurahan?.kecamatan;
            if (!kecamatan) return;

            const key = kecamatan.id;
            if (!groupedByKecamatan.has(key)) {
                groupedByKecamatan.set(key, { nama: kecamatan.nama, count: 0 });
            }
            const current = groupedByKecamatan.get(key)!;
            current.count += 1;
        });

        // Convert to array and sort
        return Array.from(groupedByKecamatan.values())
            .sort((a, b) => a.nama.localeCompare(b.nama));
    }

    async getFacilitiesPerCondition(filters?: { year?: number; kecamatanId?: number; condition?: string }) {
        const whereClause: any = {};
        if (filters?.year) {
            whereClause.year = filters.year;
        }
        if (filters?.kecamatanId) {
            whereClause.desaKelurahanId = {
                in: await prisma.desaKelurahan.findMany({
                    where: { kecamatanId: filters.kecamatanId },
                    select: { id: true }
                }).then(result => result.map(d => d.id))
            };
        }
        if (filters?.condition) {
            whereClause.condition = filters.condition;
        }

        const facilities = await prisma.facilityRecord.findMany({
            where: whereClause,
            select: { condition: true }
        });

        // Map condition codes to labels
        const conditionMap: Record<string, string> = {
            '1': 'Baik',
            '2': 'Cukup',
            '3': 'Rusak Ringan',
            '4': 'Rusak Berat'
        };

        // Group by condition
        const grouped: Record<string, { label: string; count: number }> = {
            '1': { label: 'Baik', count: 0 },
            '2': { label: 'Cukup', count: 0 },
            '3': { label: 'Rusak Ringan', count: 0 },
            '4': { label: 'Rusak Berat', count: 0 }
        };

        facilities.forEach(facility => {
            if (facility.condition && grouped[facility.condition]) {
                grouped[facility.condition].count += 1;
            }
        });

        return Object.entries(grouped).map(([key, value]) => ({
            condition: key,
            label: value.label,
            count: value.count
        }));
    }

    async getKecamatanSummary(filters?: { year?: number; kecamatanId?: number; condition?: string }) {
        const baseWhereClause: any = {};
        if (filters?.year) {
            baseWhereClause.year = filters.year;
        }
        if (filters?.condition) {
            baseWhereClause.condition = filters.condition;
        }

        // Get all kecamatan
        const kecamatanList = await prisma.kecamatan.findMany({
            where: { deletedAt: null },
            select: { id: true, nama: true },
            orderBy: { nama: 'asc' }
        });

        // For each kecamatan, get facility counts
        const summaryData = await Promise.all(
            kecamatanList.map(async (kecamatan) => {
                const desaIds = await prisma.desaKelurahan.findMany({
                    where: { kecamatanId: kecamatan.id },
                    select: { id: true }
                }).then(result => result.map(d => d.id));

                const whereClause = {
                    ...baseWhereClause,
                    desaKelurahanId: { in: desaIds }
                };

                // Get facility records with prasarana details
                const facilities = await prisma.facilityRecord.findMany({
                    where: whereClause,
                    include: {
                        prasarana: {
                            select: { jenis: true }
                        }
                    }
                });

                // Count manually
                let baik = 0;
                let rusaBerat = 0;
                let lapangan = 0;
                let gedung = 0;
                let kolam = 0;

                facilities.forEach(facility => {
                    if (facility.condition === '1') baik++;
                    if (facility.condition === '4') rusaBerat++;

                    const jenis = facility.prasarana?.jenis?.toLowerCase() || '';
                    if (jenis.includes('lapangan')) lapangan++;
                    else if (jenis.includes('gedung')) gedung++;
                    else if (jenis.includes('kolam') || jenis.includes('renang')) kolam++;
                });

                return {
                    id: kecamatan.id,
                    nama: kecamatan.nama,
                    totalFasility: facilities.length,
                    baik,
                    rusaBerat,
                    lapangan,
                    gedung,
                    kolam
                };
            })
        );

        return summaryData;
    }

    async getFacilitiesPerOwnership(filters?: { year?: number; kecamatanId?: number; ownership?: string }) {
        const whereClause: any = {};
        if (filters?.year) {
            whereClause.year = filters.year;
        }
        if (filters?.kecamatanId) {
            whereClause.desaKelurahanId = {
                in: await prisma.desaKelurahan.findMany({
                    where: { kecamatanId: filters.kecamatanId },
                    select: { id: true }
                }).then(result => result.map(d => d.id))
            };
        }
        if (filters?.ownership) {
            whereClause.ownershipStatus = filters.ownership;
        }

        const facilities = await prisma.facilityRecord.findMany({
            where: whereClause,
            select: { ownershipStatus: true }
        });

        // Map ownership codes to labels
        const ownershipMap: Record<string, string> = {
            '1': 'Milik Pribadi',
            '2': 'Sewa',
            '4': 'Bersama',
            '5': 'Pemerintah'
        };

        // Group by ownership
        const grouped: Record<string, { label: string; count: number }> = {
            '1': { label: 'Milik Pribadi', count: 0 },
            '2': { label: 'Sewa', count: 0 },
            '4': { label: 'Bersama', count: 0 },
            '5': { label: 'Pemerintah', count: 0 }
        };

        facilities.forEach(facility => {
            if (facility.ownershipStatus && grouped[facility.ownershipStatus]) {
                grouped[facility.ownershipStatus].count += 1;
            }
        });

        return Object.entries(grouped).map(([key, value]) => ({
            ownership: key,
            label: value.label,
            count: value.count
        }));
    }
}

export const FacilityRecordRepo = new FacilityRecordRepository();
