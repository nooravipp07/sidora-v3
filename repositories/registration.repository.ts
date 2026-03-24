import { prisma } from '@/lib/prisma';

export const RegistrationRepo = {
  async create(data: any) {
    return prisma.registration.create({
      data,
    });
  },

  async findAll(
    where: any = {},
    pagination: { page?: number; limit?: number } = { page: 1, limit: 10 }
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limit,
        include: {
          kecamatan: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.registration.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  },

  async findById(id: number) {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        kecamatan: true,
      },
    });
  },

  async update(id: number, data: any) {
    return prisma.registration.update({
      where: { id },
      data,
      include: {
        kecamatan: true,
      },
    });
  },
};
