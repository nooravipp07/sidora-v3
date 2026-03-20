import { PrismaClient } from '@prisma/client';
import { AbstractRepository } from './abstract.repository';

const prisma = new PrismaClient();

export class AthleteRepository extends AbstractRepository<any> {
  constructor() {
    super(prisma.athlete);
  }

  async findAll(where: any = {}, pagination: any = { page: 1, limit: 10 }) {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const data = await prisma.athlete.findMany({
      where: {
        deletedAt: null,
        ...where,
      },
      include: {
        desaKelurahan: {
          include: {
            kecamatan: true,
          },
        },
        sport: true,
        achievements: {
          orderBy: {
            year: 'desc',
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.athlete.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasMore: pagination.page < totalPages,
      },
    };
  }

  async findById(id: number) {
    return await prisma.athlete.findUnique({
      where: { id },
      include: {
        desaKelurahan: {
          include: {
            kecamatan: true,
          },
        },
        sport: true,
        achievements: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });
  }

  async create(data: any) {
    const { achievements, ...athleteData } = data;

    return await prisma.athlete.create({
      data: {
        ...athleteData,
        achievements: achievements && achievements.length > 0 ? {
          createMany: {
            data: achievements,
          },
        } : undefined,
      },
      include: {
        desaKelurahan: {
          include: {
            kecamatan: true,
          },
        },
        sport: true,
        achievements: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });
  }

  async update(id: number, data: any) {
    const { achievements, ...athleteData } = data;

    // Delete existing achievements and create new ones if provided
    if (achievements) {
      await prisma.athleteAchievement.deleteMany({
        where: {
          athleteId: id,
        },
      });
    }

    return await prisma.athlete.update({
      where: { id },
      data: {
        ...athleteData,
        achievements: achievements && achievements.length > 0 ? {
          createMany: {
            data: achievements,
          },
        } : undefined,
      },
      include: {
        desaKelurahan: {
          include: {
            kecamatan: true,
          },
        },
        sport: true,
        achievements: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });
  }

  async softDelete(id: number) {
    return await prisma.athlete.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async delete(id: number) {
    return await prisma.athlete.delete({
      where: { id },
    });
  }
}
