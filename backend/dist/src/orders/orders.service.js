"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const payments_service_1 = require("../payments/payments.service");
const prisma = new client_1.PrismaClient();
let OrdersService = class OrdersService {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createOrder(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (cartItems.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let total = 0;
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                throw new common_1.BadRequestException(`Not enough stock for ${item.product.title}`);
            }
            total += item.product.price * item.quantity;
        }
        const lootCoinsEarned = Math.floor(total / 2000);
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                lootCoinsEarned,
                status: 'PENDING',
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
        const paymentUrl = await this.paymentsService.createPreference({
            orderId: order.id,
            items: order.items,
            total: order.total,
            payerEmail: user?.email,
        });
        return {
            ...order,
            paymentUrl,
        };
    }
    async confirmPayment(orderId, paymentStatus) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (order.status !== 'PENDING') {
            return order;
        }
        if (paymentStatus === 'approved') {
            const updatedOrder = await prisma.$transaction(async (tx) => {
                const confirmedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: { status: 'CONFIRMED' },
                    include: { items: { include: { product: true } } },
                });
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                await tx.user.update({
                    where: { id: order.userId },
                    data: { lootCoins: { increment: order.lootCoinsEarned } },
                });
                await tx.cartItem.deleteMany({ where: { userId: order.userId } });
                return confirmedOrder;
            });
            return updatedOrder;
        }
        else {
            return prisma.order.update({
                where: { id: orderId },
                data: { status: paymentStatus === 'pending' ? 'PENDING' : 'CANCELLED' },
                include: { items: { include: { product: true } } },
            });
        }
    }
    async getOrders(userId) {
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
    async getOrder(userId, orderId) {
        return prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map