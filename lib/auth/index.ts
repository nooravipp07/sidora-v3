// Re-export from new locations for backward compatibility
export * from '@/types/auth';
export * from './jwt';
export * from './bcrypt';
export { prisma, default as defaultPrisma } from '../prisma';
export * from './useAuth';
