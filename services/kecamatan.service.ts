import { PaginationParams } from "@/repositories/abstract.repository";
import { KecamatanRepo } from "@/repositories/kecamatan.repository";
import { prisma } from "@/lib/prisma";

export const KecamatanService = {
    async getAll(filter: { nama: any; }, pagination: PaginationParams) {

        const where = {
        deletedAt: null,
        ...(filter.nama && {
            nama: {
            contains: filter.nama,
            mode: "insensitive"
            }
        })
        }

        return KecamatanRepo.findAll(where, pagination)
    },

    async getById(id: number) {
        return KecamatanRepo.findById(id)
    },

    async create(data: any) {
        return KecamatanRepo.create(data)
    },

    async update(id: number, data: any) {
        return KecamatanRepo.update(id, data)
    },

    async delete(id: number) {
        return KecamatanRepo.softDelete(id)
    },

    /**
     * Get summary of athletes and achievements grouped by kecamatan
     * @param organization Filter by organization (KONI, NPCI, etc.)
     * @returns Array of kecamatan with summary statistics
     */
    async getSummary(organization?: string | null) {
        // Build where clause for athletes
        const athleteWhere: any = {
            deletedAt: null,
        };

        if (organization) {
            athleteWhere.organization = organization;
        }

        // Fetch all kecamatan
        const kecamatanList = await prisma.kecamatan.findMany();

        // For each kecamatan, get summary
        const summaries = await Promise.all(
            kecamatanList.map(async (kecamatan) => {
                // Get all desa in this kecamatan
                const desaList = await prisma.desaKelurahan.findMany({
                    where: { kecamatanId: kecamatan.id },
                    select: { id: true },
                });

                const desaIds = desaList.map((d) => d.id);

                if (desaIds.length === 0) {
                    return null;
                }

                // Get athletes in this kecamatan
                const athletes = await prisma.athlete.findMany({
                    where: {
                        ...athleteWhere,
                        desaKelurahanId: { in: desaIds },
                    },
                    select: {
                        id: true,
                        category: true,
                        achievements: {
                            select: {
                                medal: true,
                            },
                        },
                    },
                });

                if (athletes.length === 0) {
                    return null;
                }

                // Count by category
                const totalAtlet = athletes.filter((a) => a.category === 'ATLET').length;
                const totalPelatih = athletes.filter((a) => a.category === 'PELATIH').length;
                const totalWasit = athletes.filter((a) => a.category === 'WASIT').length;

                // Count medals from achievements
                let emasCount = 0;
                let perakCount = 0;
                let perungguCount = 0;

                athletes.forEach((athlete) => {
                    athlete.achievements.forEach((achievement) => {
                        if (achievement.medal === 'EMAS' || achievement.medal === 'Emas') {
                            emasCount++;
                        } else if (achievement.medal === 'PERAK' || achievement.medal === 'Perak') {
                            perakCount++;
                        } else if (achievement.medal === 'PERUNGGU' || achievement.medal === 'Perunggu') {
                            perungguCount++;
                        }
                    });
                });

                return {
                    kecamatan: kecamatan.nama,
                    latitude: '0',
                    longitude: '0',
                    totalAthletes: athletes.length,
                    totalCoaches: totalPelatih,
                    totalReferees: totalWasit,
                    emasCount,
                    perakCount,
                    perungguCount,
                    totalAtlet,
                    totalPelatih,
                    totalWasit,
                };
            })
        );

        // Filter out null entries (kecamatan with no data)
        return summaries.filter((s) => s !== null);
    }
};