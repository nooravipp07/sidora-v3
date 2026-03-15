export type PaginationParams = {
    page?: number;
    limit?: number;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }
}

export class AbstractRepository<T> {
    constructor(private model: any) {}

    async create(data: any): Promise<T> {
        return this.model.create({ data })
    }

    async findById(id: number): Promise<T | null> {
        return this.model.findUnique({
        where: { id }
        })
    }

    async findAll(
        where: any = {},
        pagination: PaginationParams = { page: 1, limit: 10 }
    ): Promise<PaginatedResponse<T>> {

        const page = pagination.page || 1
        const limit = pagination.limit || 10
        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
        this.model.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        }),
        this.model.count({ where })
        ])

        const totalPages = Math.ceil(total / limit)

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasMore: page < totalPages
            }
        }
    }

    async update(id: number, data: any): Promise<T> {
        return this.model.update({
            where: { id },
            data
        })
    }

    async delete(id: number): Promise<T> {
        return this.model.delete({
            where: { id }
        })
    }

    async softDelete(id: number): Promise<T> {
        return this.model.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    }

    async restore(id: number): Promise<T> {
        return this.model.update({
            where: { id },
            data: { deletedAt: null }
        })
    }
}