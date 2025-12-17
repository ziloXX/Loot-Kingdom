"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ProductsService = class ProductsService {
    async findAll(filters) {
        const where = {};
        if (filters?.category) {
            where.category = filters.category;
        }
        if (filters?.condition) {
            where.condition = filters.condition;
        }
        if (filters?.tier) {
            where.tier = filters.tier;
        }
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
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
    async findBySlug(slug) {
        return prisma.product.findUnique({
            where: { slug },
        });
    }
    async findById(id) {
        return prisma.product.findUnique({
            where: { id },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map