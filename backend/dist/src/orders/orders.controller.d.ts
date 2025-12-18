import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        paymentUrl: string | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                title: string;
                description: string;
                price: number;
                stock: number;
                brand: string | null;
                franchise: string | null;
                condition: import(".prisma/client").$Enums.Condition;
                tier: import(".prisma/client").$Enums.Tier;
                category: import(".prisma/client").$Enums.Category;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
            productId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        lootCoinsEarned: number;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    }>;
    confirmPayment(req: {
        user: {
            userId: string;
        };
    }, orderId: string, status: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                title: string;
                description: string;
                price: number;
                stock: number;
                brand: string | null;
                franchise: string | null;
                condition: import(".prisma/client").$Enums.Condition;
                tier: import(".prisma/client").$Enums.Tier;
                category: import(".prisma/client").$Enums.Category;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        lootCoinsEarned: number;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    }>;
    getOrders(req: {
        user: {
            userId: string;
        };
    }): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                title: string;
                description: string;
                price: number;
                stock: number;
                brand: string | null;
                franchise: string | null;
                condition: import(".prisma/client").$Enums.Condition;
                tier: import(".prisma/client").$Enums.Tier;
                category: import(".prisma/client").$Enums.Category;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        lootCoinsEarned: number;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    })[]>;
    getOrder(req: {
        user: {
            userId: string;
        };
    }, orderId: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                title: string;
                description: string;
                price: number;
                stock: number;
                brand: string | null;
                franchise: string | null;
                condition: import(".prisma/client").$Enums.Condition;
                tier: import(".prisma/client").$Enums.Tier;
                category: import(".prisma/client").$Enums.Category;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        lootCoinsEarned: number;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    }) | null>;
}
