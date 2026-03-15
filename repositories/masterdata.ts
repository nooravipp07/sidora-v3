import { PrismaClient } from '@prisma/client';
import { Kecamatan, KecamatanCreateInput, KecamatanUpdateInput, KecamatanFilter, PaginationParams, PaginatedResponse } from '@/types/masterdata';

const prisma = new PrismaClient();

export class KecamatanRepository {
  async create(data: KecamatanCreateInput): Promise<Kecamatan> {
    return await prisma.kecamatan.create({
      data,
    });
  }

  async findById(id: number): Promise<Kecamatan | null> {
    return await prisma.kecamatan.findUnique({
      where: { id },
    });
  }

  async findAll(
    filter: KecamatanFilter = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<Kecamatan>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (filter.nama) {
      whereClause.nama = {
        contains: filter.nama,
      };
    }

    const [data, total] = await Promise.all([
      prisma.kecamatan.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.kecamatan.count({ where: whereClause }),
    ]);

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

  async update(id: number, data: KecamatanUpdateInput): Promise<Kecamatan> {
    return await prisma.kecamatan.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Kecamatan> {
    return await prisma.kecamatan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<Kecamatan> {
    return await prisma.kecamatan.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: number): Promise<boolean> {
    await prisma.kecamatan.delete({
      where: { id },
    });
    return true;
  }
}

export class DesaKelurahanRepository {
  async create(data: any): Promise<any> {
    return await prisma.desaKelurahan.create({
      data,
      include: { kecamatan: true },
    });
  }

  async findById(id: number): Promise<any> {
    return await prisma.desaKelurahan.findUnique({
      where: { id },
      include: { kecamatan: true },
    });
  }

  async findAll(
    filter: any = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<any>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (filter.nama) {
      whereClause.nama = {
        contains: filter.nama,
      };
    }

    if (filter.kecamatanId) {
      whereClause.kecamatanId = filter.kecamatanId;
    }

    if (filter.tipe) {
      whereClause.tipe = filter.tipe;
    }

    const [data, total] = await Promise.all([
      prisma.desaKelurahan.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        include: { kecamatan: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.desaKelurahan.count({ where: whereClause }),
    ]);

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

  async update(id: number, data: any): Promise<any> {
    return await prisma.desaKelurahan.update({
      where: { id },
      data,
      include: { kecamatan: true },
    });
  }

  async softDelete(id: number): Promise<any> {
    return await prisma.desaKelurahan.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { kecamatan: true },
    });
  }

  async restore(id: number): Promise<any> {
    return await prisma.desaKelurahan.update({
      where: { id },
      data: { deletedAt: null },
      include: { kecamatan: true },
    });
  }

  async hardDelete(id: number): Promise<boolean> {
    await prisma.desaKelurahan.delete({
      where: { id },
    });
    return true;
  }
}

export class CabangOlahragaRepository {
  async create(data: any): Promise<any> {
    return await prisma.cabangOlahraga.create({
      data,
    });
  }

  async findById(id: number): Promise<any> {
    return await prisma.cabangOlahraga.findUnique({
      where: { id },
    });
  }

  async findAll(
    filter: any = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<any>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (filter.nama) {
      whereClause.nama = {
        contains: filter.nama,
      };
    }

    const [data, total] = await Promise.all([
      prisma.cabangOlahraga.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cabangOlahraga.count({ where: whereClause }),
    ]);

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

  async update(id: number, data: any): Promise<any> {
    return await prisma.cabangOlahraga.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<any> {
    return await prisma.cabangOlahraga.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<any> {
    return await prisma.cabangOlahraga.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: number): Promise<boolean> {
    await prisma.cabangOlahraga.delete({
      where: { id },
    });
    return true;
  }
}

export class SaranaRepository {
  async create(data: any): Promise<any> {
    return await prisma.sarana.create({
      data,
    });
  }

  async findById(id: number): Promise<any> {
    return await prisma.sarana.findUnique({
      where: { id },
    });
  }

  async findAll(
    filter: any = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<any>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (filter.nama) {
      whereClause.nama = {
        contains: filter.nama,
      };
    }

    if (filter.jenis) {
      whereClause.jenis = {
        contains: filter.jenis,
      };
    }

    const [data, total] = await Promise.all([
      prisma.sarana.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sarana.count({ where: whereClause }),
    ]);

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

  async update(id: number, data: any): Promise<any> {
    return await prisma.sarana.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<any> {
    return await prisma.sarana.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<any> {
    return await prisma.sarana.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: number): Promise<boolean> {
    await prisma.sarana.delete({
      where: { id },
    });
    return true;
  }
}

export class PrasaranaRepository {
  async create(data: any): Promise<any> {
    return await prisma.prasarana.create({
      data,
    });
  }

  async findById(id: number): Promise<any> {
    return await prisma.prasarana.findUnique({
      where: { id },
    });
  }

  async findAll(
    filter: any = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<any>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (filter.nama) {
      whereClause.nama = {
        contains: filter.nama,
      };
    }

    if (filter.jenis) {
      whereClause.jenis = {
        contains: filter.jenis,
      };
    }

    const [data, total] = await Promise.all([
      prisma.prasarana.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.prasarana.count({ where: whereClause }),
    ]);

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

  async update(id: number, data: any): Promise<any> {
    return await prisma.prasarana.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<any> {
    return await prisma.prasarana.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<any> {
    return await prisma.prasarana.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: number): Promise<boolean> {
    await prisma.prasarana.delete({
      where: { id },
    });
    return true;
  }
}
