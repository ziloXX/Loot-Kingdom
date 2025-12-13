import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    // 🛍️ Crear orden desde el carrito (Checkout)
    async createOrder(userId: string) {
        // 🔒 CRITICAL: Transaction atómica para evitar race conditions
        return await this.prisma.$transaction(async (tx) => {
            // 1. Obtener items del carrito
            const cartItems = await tx.cartItem.findMany({
                where: { userId },
                include: {
                    variant: {
                        include: { product: true },
                    },
                },
            });

            if (cartItems.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            // 2. Verificar stock disponible para TODOS los items
            for (const item of cartItems) {
                const currentVariant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                });

                if (!currentVariant) {
                    throw new BadRequestException(`Product variant ${item.variantId} not found`);
                }

                if (currentVariant.stock < item.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for "${item.variant.product.title}". ` +
                        `Available: ${currentVariant.stock}, Requested: ${item.quantity}`
                    );
                }
            }

            // 3. Calcular total y XP/Coins rewards
            const total = cartItems.reduce(
                (sum, item) => sum + Number(item.variant.price) * item.quantity,
                0
            );

            const awardedXp = Math.floor(total / 100);  // 1 XP por cada $100
            const awardedCoins = Math.floor(total / 1000);  // 1 Coin por cada $1000

            // 4. Crear la orden con precios SNAPSHOT (freeze)
            const order = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'PENDING',
                    awardedXp,
                    awardedCoins,
                    items: {
                        create: cartItems.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.variant.price,  // 🔒 Price frozen
                            productTitle: item.variant.product.title,
                            condition: item.variant.condition,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: { product: true },
                            },
                        },
                    },
                },
            });

            // 5. Decrementar stock de forma atómica
            for (const item of cartItems) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: { decrement: item.quantity },
                    },
                });
            }

            // 6. Limpiar el carrito
            await tx.cartItem.deleteMany({
                where: { userId },
            });

            // 7. Otorgar recompensas al usuario (gamificación)
            await tx.user.update({
                where: { id: userId },
                data: {
                    xpPoints: { increment: awardedXp },
                    lootCoins: { increment: awardedCoins },
                    coinHistory: {
                        create: {
                            amount: awardedCoins,
                            reason: `Order #${order.id.substring(0, 8)} completed`,
                        },
                    },
                },
            });

            return order;
        });
    }

    // 📋 Obtener todas las órdenes de un usuario
    async getUserOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // 🔍 Obtener una orden específica
    async getOrderById(orderId: string, userId: string) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,  // Security: Solo puede ver sus propias órdenes
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });

        if (!order) {
            throw new BadRequestException('Order not found');
        }

        return order;
    }

    // 🎯 Actualizar estado de orden (Admin)
    async updateOrderStatus(orderId: string, status: string) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: status as any },  // TODO: Validar con enum
        });
    }
}
