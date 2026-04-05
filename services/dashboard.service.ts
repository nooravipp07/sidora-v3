import { DashboardRepo } from '@/repositories/dashboard.repository';
import { prisma } from '@/lib/prisma';

export const DashboardService = {
  async getKecamatanSummary(filters?: { kecamatanId?: number; year?: number }) {
    return DashboardRepo.getKecamatanSummary(filters);
  },

  async getInfrastructureSummary() {
    return DashboardRepo.getInfrastructureSummary();
  },

  async getAchievementTrendsByYear(filters?: { kecamatanId?: number }) {
    return DashboardRepo.getAchievementTrendsByYear(filters);
  },

  /**
   * Get medal summary counts grouped by medal type
   * @param organization Filter by organization (KONI, NPCI, etc.)
   * @param year Filter by year (default: current year)
   * @returns Summary with medal counts
   */
  async getMedalSummary(organization?: string | null, year?: number) {
    const currentYear = year || new Date().getFullYear();

    // Build where clause for athletes
    const athleteWhere: any = {
      deletedAt: null,
    };

    if (organization) {
      athleteWhere.organization = organization;
    }

    // Fetch achievements with filtered athletes
    const achievements = await prisma.athleteAchievement.findMany({
      where: {
        athlete: athleteWhere,
        year: currentYear,
      },
      select: {
        medal: true,
      },
    });

    // Count by medal type
    let emasCount = 0;
    let perakCount = 0;
    let perungguCount = 0;

    achievements.forEach((achievement) => {
      const medal = achievement.medal?.toUpperCase();
      if (medal === 'EMAS') {
        emasCount++;
      } else if (medal === 'PERAK') {
        perakCount++;
      } else if (medal === 'PERUNGGU') {
        perungguCount++;
      }
    });

    return {
      emasCount,
      perakCount,
      perungguCount,
      totalMedals: emasCount + perakCount + perungguCount,
    };
  },
};
