import { prisma } from '@/lib/prisma';

export const RegistrationRepo = {
  async create(data: any) {
    return prisma.registration.create({
      data,
    });
  },
};
