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
   * Export athlete data to Excel format
   */
  async exportToExcel(filter: { kecamatanId?: number; desaKelurahanId?: number } = {}) {
    const where: any = {
      deletedAt: null,
    };

    if (filter.desaKelurahanId !== undefined) {
      where.desaKelurahanId = filter.desaKelurahanId;
    } else if (filter.kecamatanId !== undefined) {
      const desaList = await prisma.desaKelurahan.findMany({
        where: { kecamatanId: filter.kecamatanId },
        select: { id: true }
      });
      const desaIds = desaList.map(d => d.id);
      if (desaIds.length > 0) {
        where.desaKelurahanId = { in: desaIds };
      } else {
        return [];
      }
    }

    // Get all athlete records with relations
    const records = await prisma.athlete.findMany({
      where,
      include: {
        sport: {
          select: { nama: true }
        },
        desaKelurahan: {
          select: {
            nama: true,
            kecamatan: {
              select: { nama: true }
            }
          }
        },
        achievements: {
          select: {
            achievementName: true,
            category: true,
            medal: true,
            year: true
          }
        }
      },
      orderBy: [{ fullName: 'asc' }]
    });

    // Transform data for Excel export
    const excelData = records.map((record, index) => ({
      'No': index + 1,
      'NIK': record.nationalId,
      'Nama Lengkap': record.fullName,
      'Tempat Lahir': record.birthPlace || '-',
      'Tanggal Lahir': record.birthDate ? new Date(record.birthDate).toLocaleDateString('id-ID') : '-',
      'Jenis Kelamin': record.gender || '-',
      'Organisasi': record.organization || '-',
      'Kategori': record.category || '-',
      'Cabang Olahraga': record.sport?.nama || '-',
      'Alamat': record.fullAddress || '-',
      'Desa/Kelurahan': record.desaKelurahan.nama,
      'Kecamatan': record.desaKelurahan.kecamatan.nama,
      'Status': record.status,
      'Prestasi': record.achievements.length > 0 ? record.achievements[0].achievementName : '-',
      'Tanggal Dibuat': new Date(record.createdAt).toLocaleDateString('id-ID'),
      'Tanggal Diperbarui': new Date(record.updatedAt).toLocaleDateString('id-ID')
    }));

    return excelData;
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
