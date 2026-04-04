import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';

class AthleteAchievementRepository extends AbstractRepository<any> {
    constructor() {
        super(prisma.athleteAchievement);
    }

    async getAchievementsWithFilters(filters?: {
        category?: string;
        sportId?: number;
        medal?: string;
        year?: number;
        kecamatanId?: number;
        skip?: number;
        take?: number;
    }) {
        const whereClause: any = {};

        // Filter berdasarkan category (untuk backward compatibility) atau sportId
        if (filters?.sportId) {
            whereClause.athlete = {
                sportId: filters.sportId
            };
        } else if (filters?.category) {
            whereClause.category = filters.category;
        }

        if (filters?.medal) {
            whereClause.medal = filters.medal;
        }
        if (filters?.year) {
            whereClause.year = filters.year;
        }

        // Pagination configuration
        const skip = filters?.skip || 0;
        const take = filters?.take || 999999; // Default unlimited

        let achievements = await prisma.athleteAchievement.findMany({
            where: whereClause,
            include: {
                athlete: {
                    include: {
                        desaKelurahan: {
                            include: {
                                kecamatan: true
                            }
                        },
                        sport: true
                    }
                }
            },
            orderBy: [
                { year: 'desc' },
                { medal: 'asc' },
                { id: 'desc' }
            ],
            skip: skip,
            take: take
        });

        // Filter by kecamatan if provided
        if (filters?.kecamatanId) {
            achievements = achievements.filter(
                a => a.athlete?.desaKelurahan?.kecamatan?.id === filters.kecamatanId
            );
        }

        return achievements.map(a => ({
            id: a.id,
            athleteId: a.athleteId,
            athleteName: a.athlete?.fullName || '',
            sportId: a.athlete?.sportId || 0,
            sportName: a.athlete?.sport?.nama || a.category || '',
            category: a.category || '',
            medal: a.medal || '',
            achievementName: a.achievementName,
            year: a.year || 0,
            district: a.athlete?.desaKelurahan?.kecamatan?.nama || ''
        }));
    }

    async getAchievementsCount(filters?: {
        category?: string;
        sportId?: number;
        medal?: string;
        year?: number;
        kecamatanId?: number;
    }) {
        const whereClause: any = {};

        if (filters?.sportId) {
            whereClause.athlete = {
                sportId: filters.sportId
            };
        } else if (filters?.category) {
            whereClause.category = filters.category;
        }

        if (filters?.medal) {
            whereClause.medal = filters.medal;
        }
        if (filters?.year) {
            whereClause.year = filters.year;
        }

        let count = await prisma.athleteAchievement.count({
            where: whereClause
        });

        // Filter by kecamatan if provided (client-side filtering)
        if (filters?.kecamatanId) {
            const achievements = await prisma.athleteAchievement.findMany({
                where: whereClause,
                include: {
                    athlete: {
                        include: {
                            desaKelurahan: {
                                include: {
                                    kecamatan: true
                                }
                            }
                        }
                    }
                }
            });
            count = achievements.filter(
                a => a.athlete?.desaKelurahan?.kecamatan?.id === filters.kecamatanId
            ).length;
        }

        return count;
    }

    async getUniqueCategoriesFromAchievements() {
        const achievements = await prisma.athleteAchievement.findMany({
            distinct: ['category'],
            select: { category: true },
            where: { category: { not: null } }
        });

        return achievements
            .map(a => a.category)
            .filter(c => c && c.trim() !== '')
            .sort();
    }

    async getUniqueSportsFromAchievements() {
        const achievements = await prisma.athleteAchievement.findMany({
            include: {
                athlete: {
                    include: {
                        sport: true
                    }
                }
            }
        });

        const sportsMap = new Map<number, { id: number; name: string }>();
        achievements.forEach(a => {
            if (a.athlete?.sport) {
                sportsMap.set(a.athlete.sport.id, {
                    id: a.athlete.sport.id,
                    name: a.athlete.sport.nama
                });
            }
        });

        return Array.from(sportsMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    async getUniqueYearsFromAchievements() {
        const achievements = await prisma.athleteAchievement.findMany({
            distinct: ['year'],
            select: { year: true },
            where: { year: { not: null } },
            orderBy: { year: 'desc' }
        });

        return achievements
            .map(a => a.year)
            .filter(y => y && y > 0)
            .sort((a, b) => b - a);
    }

    async getKecamatanWithAchievements() {
        const achievements = await prisma.athleteAchievement.findMany({
            include: {
                athlete: {
                    include: {
                        desaKelurahan: {
                            include: {
                                kecamatan: true
                            }
                        }
                    }
                }
            }
        });

        const kecamatanSet = new Map<number, string>();
        achievements.forEach(a => {
            const kecamatan = a.athlete?.desaKelurahan?.kecamatan;
            if (kecamatan) {
                kecamatanSet.set(kecamatan.id, kecamatan.nama);
            }
        });

        return Array.from(kecamatanSet.entries())
            .map(([id, nama]) => ({ id, nama }))
            .sort((a, b) => a.nama.localeCompare(b.nama));
    }

    async getAchievementStats(filters?: {
        category?: string;
        sportId?: number;
        medal?: string;
        year?: number;
        kecamatanId?: number;
    }) {
        const achievements = await this.getAchievementsWithFilters(filters);

        const athletesSet = new Set(achievements.map(a => a.athleteId));
        const goldCount = achievements.filter(a => a.medal === 'gold').length;
        const silverCount = achievements.filter(a => a.medal === 'silver').length;
        const bronzeCount = achievements.filter(a => a.medal === 'bronze').length;

        return {
            totalAthletes: athletesSet.size,
            totalAchievements: achievements.length,
            goldMedals: goldCount,
            silverMedals: silverCount,
            bronzeMedals: bronzeCount
        };
    }
}

export const AthleteAchievementRepo = new AthleteAchievementRepository();
