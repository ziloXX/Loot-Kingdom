import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductFilters {
    category?: string;
    condition?: string;
    tier?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

@Injectable()
export class ProductsService {
    async findAll(filters?: ProductFilters) {
        const where: Prisma.ProductWhereInput = {};

        if (filters?.category) {
            where.category = filters.category as Prisma.EnumCategoryFilter['equals'];
        }

        if (filters?.condition) {
            where.condition = filters.condition as Prisma.EnumConditionFilter['equals'];
        }

        if (filters?.tier) {
            where.tier = filters.tier as Prisma.EnumTierFilter['equals'];
        }

        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice) where.price.gte = filters.minPrice;
            if (filters.maxPrice) where.price.lte = filters.maxPrice;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { franchise: { contains: filters.search, mode: 'insensitive' } },
                { brand: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findBySlug(slug: string) {
        return prisma.product.findUnique({
            where: { slug },
        });
    }

    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
        });
    }
}
