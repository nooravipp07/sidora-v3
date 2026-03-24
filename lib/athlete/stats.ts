import { prisma } from '@/lib/prisma';

export interface AthleteStats {
  total: number;
  athletes: number;
  coaches: number;
  referees: number;
  achievements: number;
}

/**
 * Get statistics for a specific organization
 */
export async function getOrganizationStats(organization: 'KONI' | 'NPCI'): Promise<AthleteStats> {
  const where = {
    organization,
    deletedAt: null
  };

  const [total, athletes, coaches, referees, achievements] = await Promise.all([
    prisma.athlete.count({ where }),
    prisma.athlete.count({ where: { ...where, category: 'ATLET' } }),
    prisma.athlete.count({ where: { ...where, category: 'PELATIH' } }),
    prisma.athlete.count({ where: { ...where, category: 'WASIT - JURI' } }),
    prisma.athleteAchievement.count({
      where: {
        athlete: where
      }
    })
  ]);

  return {
    total,
    athletes,
    coaches,
    referees,
    achievements
  };
}

/**
 * Get combined stats for both KONI and NPCI
 */
export async function getCombinedStats() {
  const [koniStats, npciStats] = await Promise.all([
    getOrganizationStats('KONI'),
    getOrganizationStats('NPCI')
  ]);

  return {
    koni: koniStats,
    npci: npciStats,
    combined: {
      total: koniStats.total + npciStats.total,
      athletes: koniStats.athletes + npciStats.athletes,
      coaches: koniStats.coaches + npciStats.coaches,
      referees: koniStats.referees + npciStats.referees,
      achievements: koniStats.achievements + npciStats.achievements
    }
  };
}

/**
 * Get all sports used by athletes
 */
export async function getAthletesSports() {
  return prisma.cabangOlahraga.findMany({
    where: {
      athletes: {
        some: {
          organization: { in: ['KONI', 'NPCI'] },
          deletedAt: null
        }
      }
    },
    orderBy: { nama: 'asc' }
  });
}
