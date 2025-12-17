export declare class AdminService {
    getDashboardStats(): Promise<{
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
    getAllProducts(): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        brand: string | null;
        franchise: string | null;
        condition: import(".prisma/client").$Enums.Condition;
        tier: import(".prisma/client").$Enums.Tier;
        category: import(".prisma/client").$Enums.Category;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createProduct(data: {
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
        title: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        brand: string | null;
        franchise: string | null;
        condition: import(".prisma/client").$Enums.Condition;
        tier: import(".prisma/client").$Enums.Tier;
        category: import(".prisma/client").$Enums.Category;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProduct(id: string, data: Partial<{
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
        title: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        brand: string | null;
        franchise: string | null;
        condition: import(".prisma/client").$Enums.Condition;
        tier: import(".prisma/client").$Enums.Tier;
        category: import(".prisma/client").$Enums.Category;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        brand: string | null;
        franchise: string | null;
        condition: import(".prisma/client").$Enums.Condition;
        tier: import(".prisma/client").$Enums.Tier;
        category: import(".prisma/client").$Enums.Category;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllOrders(): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
        };
        items: ({
            product: {
                id: string;
                title: string;
                slug: string;
                description: string;
                price: number;
                stock: number;
                brand: string | null;
                franchise: string | null;
                condition: import(".prisma/client").$Enums.Condition;
                tier: import(".prisma/client").$Enums.Tier;
                category: import(".prisma/client").$Enums.Category;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lootCoinsEarned: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    })[]>;
    updateOrderStatus(orderId: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'): Promise<{
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lootCoinsEarned: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddress: string | null;
        notes: string | null;
        userId: string;
    }>;
}
