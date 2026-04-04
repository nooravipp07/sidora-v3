import { AthleteRepository } from '@/repositories/athlete.repository';
import { prisma } from '@/lib/prisma';

const athleteRepository = new AthleteRepository();

export class AthleteService {
  async getAll(filters: any = {}, pagination: any = { page: 1, limit: 10 }) {
    const where: any = {};

    // Search by name
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search } },
        { nationalId: { contains: filters.search } },
      ];
    }

    // Filter by desaKelurahanId atau kecamatanId (desa prioritas)
    if (filters.desaKelurahanId) {
      where.desaKelurahanId = parseInt(filters.desaKelurahanId);
    } else if (filters.kecamatanId) {
      const kecId = parseInt(filters.kecamatanId);
      const desaList = await prisma.desaKelurahan.findMany({
        where: { kecamatanId: kecId },
        select: { id: true }
      });
      const desaIds = desaList.map(d => d.id);
      if (desaIds.length > 0) {
        where.desaKelurahanId = { in: desaIds };
      } else {
        return {
          data: [],
          meta: {
            total: 0,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: 0,
            hasMore: false,
          },
        };
      }
    }

    // Filter by sportId
    if (filters.sportId) {
      where.sportId = parseInt(filters.sportId);
    }

    // Filter by gender
    if (filters.gender) {
      where.gender = filters.gender;
    }

    // Filter by status
    if (filters.status) {
      where.status = filters.status;
    }

    // Filter by year (birth year)
    if (filters.birthYear) {
      const year = parseInt(filters.birthYear);
      where.birthDate = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    }

    return await athleteRepository.findAll(where, pagination);
  }

  async getById(id: number) {
    return await athleteRepository.findById(id);
  }

  async create(data: any) {
    return await athleteRepository.create({
      nationalId: data.nationalId.trim(),
      fullName: data.fullName.trim(),
      birthPlace: data.birthPlace?.trim() || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: data.gender || null,
      desaKelurahanId: parseInt(data.desaKelurahanId),
      fullAddress: data.fullAddress?.trim() || null,
      organization: data.organization?.trim() || null,
      category: data.category?.trim() || null,
      status: data.status || 'aktif',
      sportId: data.sportId ? parseInt(data.sportId) : null,
      photoUrl: data.photoUrl || null,
      achievements: data.achievements || [],
    });
  }

  async update(id: number, data: any) {
    return await athleteRepository.update(id, {
      nationalId: data.nationalId.trim(),
      fullName: data.fullName.trim(),
      birthPlace: data.birthPlace?.trim() || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: data.gender || null,
      desaKelurahanId: parseInt(data.desaKelurahanId),
      fullAddress: data.fullAddress?.trim() || null,
      organization: data.organization?.trim() || null,
      category: data.category?.trim() || null,
      status: data.status || 'aktif',
      sportId: data.sportId ? parseInt(data.sportId) : null,
      photoUrl: data.photoUrl || null,
      achievements: data.achievements || [],
    });
  }

  async delete(id: number) {
    return await athleteRepository.softDelete(id);
  }

  /**
   * Get athlete summary grouped by category
   * @param organization Filter by organization (KONI, NPCI, etc.)
   * @returns Summary with counts by category
   */
  async getSummary(organization?: string | null) {
    const where: any = {
      deletedAt: null,
    };

    // Filter by organization if provided
    if (organization) {
      where.organization = organization;
    }

    // Fetch all athletes matching the filter
    const athletes = await prisma.athlete.findMany({
      where,
      select: {
        id: true,
        category: true,
      },
    });

    // Count by category
    const summary = {
      totalAtlet: athletes.filter(a => a.category === 'ATLET').length,
      totalPelatih: athletes.filter(a => a.category === 'PELATIH').length,
      totalWasit: athletes.filter(a => a.category === 'WASIT').length,
      total: athletes.length,
    };

    return summary;
  }
}
