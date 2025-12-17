"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let CartService = class CartService {
    async getCart(userId) {
        const items = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
    async addToCart(userId, dto) {
        const product = await prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock <= 0) {
            throw new common_1.BadRequestException('Product out of stock');
        }
        const quantity = dto.quantity || 1;
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: dto.productId,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                throw new common_1.BadRequestException('Not enough stock');
            }
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: { product: true },
            });
        }
        return prisma.cartItem.create({
            data: {
                userId,
                productId: dto.productId,
                quantity,
            },
            include: { product: true },
        });
    }
    async updateQuantity(userId, itemId, quantity) {
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, userId },
            include: { product: true },
        });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }
        if (quantity > item.product.stock) {
            throw new common_1.BadRequestException('Not enough stock');
        }
        return prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true },
        });
    }
    async removeItem(userId, itemId) {
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, userId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        return prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    async clearCart(userId) {
        return prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map