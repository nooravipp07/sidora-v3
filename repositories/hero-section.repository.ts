import { prisma } from '@/lib/prisma';
import { AbstractRepository, PaginationParams } from './abstract.repository';

export const HeroSectionConfigRepository = {
  ...AbstractRepository,

  /**
   * Dapatkan semua konfigurasi hero section dengan filter dan pagination
   */
  async findAll(filter: { status?: number }, pagination: PaginationParams) {
    const where: any = {};

    if (filter.status !== undefined) {
      where.status = filter.status;
    }

    const skip = ((pagination.page || 1) - 1) * (pagination.limit || 10);
    const take = pagination.limit || 10;

    const [data, total] = await Promise.all([
      prisma.heroSectionConfig.findMany({
        where,
        skip,
        take,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.heroSectionConfig.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total,
        totalPages: Math.ceil(total / (pagination.limit || 10)),
      },
    };
  },

  /**
   * Dapatkan konfigurasi hero section by ID
   */
  async findById(id: number) {
    return prisma.heroSectionConfig.findUnique({
      where: { id },
    });
  },

  /**
   * Dapatkan semua hero section yang aktif, diurutkan by displayOrder
   */
  async findActive() {
    return prisma.heroSectionConfig.findMany({
      where: { status: 1 },
      orderBy: [{ displayOrder: 'asc' }],
    });
  },

  /**
   * Create new hero section config
   */
  async create(data: {
    title: string;
    description: string;
    bannerImageUrl: string;
    displayOrder?: number;
    status?: number;
  }) {
    return prisma.heroSectionConfig.create({
      data: {
        title: data.title,
        description: data.description,
        bannerImageUrl: data.bannerImageUrl,
        displayOrder: data.displayOrder || 0,
        status: data.status !== undefined ? data.status : 1,
      },
    });
  },

  /**
   * Update hero section config
   */
  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      bannerImageUrl?: string;
      displayOrder?: number;
      status?: number;
    }
  ) {
    return prisma.heroSectionConfig.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.bannerImageUrl && { bannerImageUrl: data.bannerImageUrl }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  },

  /**
   * Delete hero section config
   */
  async delete(id: number) {
    return prisma.heroSectionConfig.delete({
      where: { id },
    });
  },

  /**
   * Update status (aktif/non-aktif)
   */
  async updateStatus(id: number, status: number) {
    return prisma.heroSectionConfig.update({
      where: { id },
      data: { status },
    });
  },

  /**
   * Reorder hero sections
   */
  async reorder(items: Array<{ id: number; displayOrder: number }>) {
    return Promise.all(
      items.map((item) =>
        prisma.heroSectionConfig.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );
  },
};
