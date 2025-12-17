import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AddToCartDto {
    productId: string;
    quantity?: number;
}

@Injectable()
export class CartService {
    async getCart(userId: string) {
        const items = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const total = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        return {
            items: items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                product: item.product,
            })),
            total,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }

    async addToCart(userId: string, dto: AddToCartDto) {
        const product = await prisma.product.findUnique({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock <= 0) {
            throw new BadRequestException('Product out of stock');
        }

        const quantity = dto.quantity || 1;

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: dto.productId,
                },
            },
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
                throw new BadRequestException('Not enough stock');
            }

            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: { product: true },
            });
        }

        // Add new item
        return prisma.cartItem.create({
            data: {
                userId,
                productId: dto.productId,
                quantity,
            },
            include: { product: true },
        });
    }

    async updateQuantity(userId: string, itemId: string, quantity: number) {
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, userId },
            include: { product: true },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }

        if (quantity > item.product.stock) {
            throw new BadRequestException('Not enough stock');
        }

        return prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true },
        });
    }

    async removeItem(userId: string, itemId: string) {
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, userId },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        return prisma.cartItem.delete({
            where: { id: itemId },
        });
    }

    async clearCart(userId: string) {
        return prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
}
