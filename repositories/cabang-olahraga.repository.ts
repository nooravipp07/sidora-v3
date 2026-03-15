import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { CabangOlahraga } from '@/types/masterdata';

class CabangOlahragaRepository extends AbstractRepository<CabangOlahraga> {
    constructor() {
        super(prisma.cabangOlahraga);
    }
}

export const CabangOlahragaRepo = new CabangOlahragaRepository();
