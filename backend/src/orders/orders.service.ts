import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';

const prisma = new PrismaClient();

@Injectable()
export class OrdersService {
    constructor(private paymentsService: PaymentsService) { }

    async createOrder(userId: string) {
        // Get user and cart
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Validate stock and calculate total
        let total = 0;
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                throw new BadRequestException(`Not enough stock for ${item.product.title}`);
            }
            total += item.product.price * item.quantity;
        }

        // Calculate LootCoins to earn (5% of total, 1 LC per $20 ARS)
        const lootCoinsEarned = Math.floor(total / 2000);

        // Create order with PENDING status (not confirmed until payment)
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                lootCoinsEarned,
                status: 'PENDING', // Changed from CONFIRMED
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        priceAtOrder: item.product.price,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        // Generate MP preference and get payment URL
        const paymentUrl = await this.paymentsService.createPreference({
            orderId: order.id,
            items: order.items,
            total: order.total,
            payerEmail: user?.email,
        });

        // Return order with payment URL
        return {
            ...order,
            paymentUrl,
        };
    }

    async confirmPayment(orderId: string, paymentStatus: string) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            throw new BadRequestException('Order not found');
        }

        if (order.status !== 'PENDING') {
            // Already processed
            return order;
        }

        if (paymentStatus === 'approved') {
            // Payment successful - complete the order
            const updatedOrder = await prisma.$transaction(async (tx) => {
                // Update order status
                const confirmedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: { status: 'CONFIRMED' },
                    include: { items: { include: { product: true } } },
                });

                // Decrement stock
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }

                // Add LootCoins to user
                await tx.user.update({
                    where: { id: order.userId },
                    data: { lootCoins: { increment: order.lootCoinsEarned } },
                });

                // Clear cart
                await tx.cartItem.deleteMany({ where: { userId: order.userId } });

                return confirmedOrder;
            });

            return updatedOrder;
        } else {
            // Payment failed or pending - update status
            return prisma.order.update({
                where: { id: orderId },
                data: { status: paymentStatus === 'pending' ? 'PENDING' : 'CANCELLED' },
                include: { items: { include: { product: true } } },
            });
        }
    }

    async getOrders(userId: string) {
        return prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getOrder(userId: string, orderId: string) {
        return prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
    }
}
