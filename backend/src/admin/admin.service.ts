import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AdminService {
    // Dashboard Stats
    async getDashboardStats() {
        const [totalSales, activeOrders, totalUsers, lowStockProducts] = await Promise.all([
            // Total Sales
            prisma.order.aggregate({
                _sum: { total: true },
            }),
            // Active Orders (CONFIRMED or SHIPPED)
            prisma.order.count({
                where: {
                    status: { in: ['CONFIRMED', 'SHIPPED'] },
                },
            }),
            // Total Users
            prisma.user.count(),
            // Low Stock Products (<3 units)
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

    // All Products
    async getAllProducts() {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    // Create Product
    async createProduct(data: {
        title: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        tier: 'OFFICIAL' | 'BOOTLEG';
        category: 'FIGURE' | 'CARD' | 'PLUSH' | 'DECOR' | 'OTHER';
        condition?: 'NEW' | 'USED' | 'DAMAGED';
        brand?: string;
        franchise?: string;
        images?: string[];
    }) {
        return prisma.product.create({
            data: {
                ...data,
                condition: data.condition || 'NEW',
                images: data.images || [],
            },
        });
    }

    // Update Product
    async updateProduct(id: string, data: Partial<{
        title: string;
        price: number;
        stock: number;
        tier: 'OFFICIAL' | 'BOOTLEG';
        category: 'FIGURE' | 'CARD' | 'PLUSH' | 'DECOR' | 'OTHER';
        condition: 'NEW' | 'USED' | 'DAMAGED';
        brand: string;
        franchise: string;
        images: string[];
        description: string;
    }>) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    // Delete Product
    async deleteProduct(id: string) {
        return prisma.product.delete({
            where: { id },
        });
    }

    // All Orders
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

    // Update Order Status
    async updateOrderStatus(orderId: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
        return prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
}
