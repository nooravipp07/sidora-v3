import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all KORMI athletes with ATLET & PELATIH categories
    const kormiAthletes = await prisma.athlete.findMany({
      where: {
        organization: 'KORMI',
        category: {
          in: ['ATLET', 'PELATIH'],
        },
        deletedAt: null,
      },
      include: {
        achievements: true,
      },
    });

    // Calculate stats
    const athletes = kormiAthletes.filter((a) => a.category === 'ATLET').length;
    const coaches = kormiAthletes.filter((a) => a.category === 'PELATIH').length;
    const totalAchievements = kormiAthletes.reduce((sum, a) => sum + a.achievements.length, 0);

    return NextResponse.json({
      kormi: {
        total: kormiAthletes.length,
        athletes,
        coaches,
        achievements: totalAchievements,
      },
    });
  } catch (error) {
    console.error('Error fetching KORMI stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
