import { prisma } from '@/lib/prisma';
import { AbstractRepository, PaginationParams, PaginatedResponse } from './abstract.repository';
import { hashPassword } from '@/lib/auth/bcrypt';

export interface UserWithRole {
  id: number;
  name: string;
  email: string;
  namaLengkap?: string;
  noTelepon?: string;
  roleId?: number;
  kecamatanId?: number;
  status?: number;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  role?: { id: number; name: string };
}

class UserRepository extends AbstractRepository<UserWithRole> {
  constructor() {
    super(prisma.user);
  }

  async findAll(
    where: any = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<any>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...where,
          // Exclude certain fields or add custom filters
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { role: true }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(user => ({
        ...user,
        password: undefined // Don't expose passwords
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    };
  }

  async findById(id: number): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });
    
    if (user) {
      return {
        ...user,
        password: undefined // Don't expose password
      };
    }
    return null;
  }

  async update(id: number, data: any): Promise<any> {
    const { password, ...updateData } = data;
    
    // Map fields explicitly to avoid Prisma issues
    const finalData: any = {};
    
    // Map each field individually
    if (updateData.name !== undefined) finalData.name = updateData.name;
    if (updateData.email !== undefined) finalData.email = updateData.email;
    if (updateData.namaLengkap !== undefined) finalData.namaLengkap = updateData.namaLengkap;
    if (updateData.noTelepon !== undefined) finalData.noTelepon = updateData.noTelepon;
    if (updateData.roleId !== undefined) finalData.roleId = updateData.roleId;
    if (updateData.kecamatanId !== undefined) finalData.kecamatanId = updateData.kecamatanId;
    if (updateData.jenisAkun !== undefined) finalData.jenisAkun = updateData.jenisAkun;
    if (updateData.status !== undefined) finalData.status = updateData.status;
    if (password) finalData.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: finalData,
      include: { role: true }
    });

    return {
      ...updatedUser,
      password: undefined
    };
  }

  async create(data: any): Promise<any> {
    const { password, ...userData } = data;
    
    // Map fields explicitly
    const createData: any = {
      name: userData.name,
      email: userData.email,
      password: await hashPassword(password)
    };
    
    // Optional fields
    if (userData.namaLengkap) createData.namaLengkap = userData.namaLengkap;
    if (userData.noTelepon) createData.noTelepon = userData.noTelepon;
    if (userData.roleId) createData.roleId = userData.roleId;
    if (userData.kecamatanId) createData.kecamatanId = userData.kecamatanId;
    if (userData.jenisAkun) createData.jenisAkun = userData.jenisAkun;
    if (userData.status !== undefined) createData.status = userData.status;
    
    const createdUser = await prisma.user.create({
      data: createData,
      include: { role: true }
    });

    return {
      ...createdUser,
      password: undefined
    };
  }

  async getStats() {
    const total = await prisma.user.count();
    const active = await prisma.user.count({ where: { status: 1 } });
    const inactive = await prisma.user.count({ where: { status: 0 } });

    return {
      total,
      active,
      inactive
    };
  }

  async updateStatus(id: number, status: number): Promise<any> {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true }
    });

    return {
      ...user,
      password: undefined
    };
  }

  async resetPassword(id: number, newPassword: string): Promise<any> {
    const hashedPassword = await hashPassword(newPassword);

    const user = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      include: { role: true }
    });

    return {
      ...user,
      password: undefined
    };
  }
}

export const UserRepo = new UserRepository();
