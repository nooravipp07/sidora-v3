import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { Prasarana } from '@/types/masterdata';

class PrasaranaRepository extends AbstractRepository<Prasarana> {
    constructor() {
        super(prisma.prasarana);
    }
}

export const PrasaranaRepo = new PrasaranaRepository();
