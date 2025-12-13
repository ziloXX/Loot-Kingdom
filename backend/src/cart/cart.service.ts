import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    // 🛒 Agregar al carrito con validación de stock atómica
    async addToCart(userId: string, addToCartDto: AddToCartDto) {
        const { variantId, quantity } = addToCartDto;

        // 🔒 SECURITY: Transaction para prevenir race conditions
        return await this.prisma.$transaction(async (tx) => {
            // 1. Verificar que la variante existe y tiene stock
            const variant = await tx.productVariant.findUnique({
                where: { id: variantId },
                include: { product: true },
            });

            if (!variant) {
                throw new NotFoundException('Product variant not found');
            }

            if (variant.stock < quantity) {
                throw new BadRequestException(
                    `Insufficient stock. Available: ${variant.stock}, Requested: ${quantity}`
                );
            }

            // 2. Verificar si el item ya existe en el carrito
            const existingCartItem = await tx.cartItem.findFirst({
                where: {
                    userId,
                    variantId,
                },
            });

            if (existingCartItem) {
                // Actualizar cantidad existente
                const newQuantity = existingCartItem.quantity + quantity;

                if (variant.stock < newQuantity) {
                    throw new BadRequestException(
                        `Insufficient stock. You already have ${existingCartItem.quantity} in cart. ` +
                        `Available: ${variant.stock}, Total requested: ${newQuantity}`
                    );
                }

                return tx.cartItem.update({
                    where: { id: existingCartItem.id },
                    data: { quantity: newQuantity },
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                });
            }

            // 3. Crear nuevo item en el carrito
            return tx.cartItem.create({
                data: {
                    userId,
                    variantId,
                    quantity,
                },
                include: {
                    variant: {
                        include: { product: true },
                    },
                },
            });
        });
    }

    // 📋 Obtener carrito del usuario
    async getCart(userId: string) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                variant: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Calcular total
        const total = cartItems.reduce((sum, item) => {
            return sum + Number(item.variant.price) * item.quantity;
        }, 0);

        return {
            items: cartItems,
            total,
            itemCount: cartItems.length,
        };
    }

    // ✏️ Actualizar cantidad de un item
    async updateCartItem(userId: string, itemId: string, quantity: number) {
        return await this.prisma.$transaction(async (tx) => {
            const cartItem = await tx.cartItem.findFirst({
                where: { id: itemId, userId },
                include: { variant: true },
            });

            if (!cartItem) {
                throw new NotFoundException('Cart item not found');
            }

            if (cartItem.variant.stock < quantity) {
                throw new BadRequestException(
                    `Insufficient stock. Available: ${cartItem.variant.stock}, Requested: ${quantity}`
                );
            }

            return tx.cartItem.update({
                where: { id: itemId },
                data: { quantity },
                include: {
                    variant: {
                        include: { product: true },
                    },
                },
            });
        });
    }

    // 🗑️ Eliminar item del carrito
    async removeCartItem(userId: string, itemId: string) {
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { id: itemId, userId },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }

    // 🧹 Limpiar carrito completo
    async clearCart(userId: string) {
        return this.prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
}
