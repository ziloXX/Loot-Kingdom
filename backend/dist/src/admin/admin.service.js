"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let AdminService = class AdminService {
    async getDashboardStats() {
        const [totalSales, activeOrders, totalUsers, lowStockProducts] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true },
            }),
            prisma.order.count({
                where: {
                    status: { in: ['CONFIRMED', 'SHIPPED'] },
                },
            }),
            prisma.user.count(),
            prisma.product.findMany({
                where: { stock: { lt: 3 } },
                select: { id: true, title: true, stock: true, images: true },
                orderBy: { stock: 'asc' },
            }),
        ]);
        return {
            totalSales: totalSales._sum.total || 0,
            activeOrders,
            totalUsers,
            lowStockProducts,
        };
    }
    async getAllProducts() {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProduct(data) {
        return prisma.product.create({
            data: {
                ...data,
                condition: data.condition || 'NEW',
                images: data.images || [],
            },
        });
    }
    async updateProduct(id, data) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        return prisma.product.delete({
            where: { id },
        });
    }
    async getAllOrders() {
        return prisma.order.findMany({
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(orderId, status) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)()
], AdminService);
//# sourceMappingURL=admin.service.js.map