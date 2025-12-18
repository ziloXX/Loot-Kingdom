import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalSales: number;
        activeOrders: number;
        totalUsers: number;
        lowStockProducts: {
            id: string;
            title: string;
            stock: number;
            images: string[];
        }[];
    }>;
    getProducts(): Promise<{
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
    }[]>;
    createProduct(body: {
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
    }): Promise<{
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
    }>;
    updateProduct(id: string, body: Partial<{
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
    }>): Promise<{
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
    }>;
    deleteProduct(id: string): Promise<{
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
    }>;
    getOrders(): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
        };
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
    updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'): Promise<{
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
}
