import { CartService } from './cart.service';
interface AddToCartDto {
    productId: string;
    quantity?: number;
}
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        items: {
            id: string;
            quantity: number;
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            };
        }[];
        total: number;
        itemCount: number;
    }>;
    addToCart(req: {
        user: {
            userId: string;
        };
    }, dto: AddToCartDto): Promise<{
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        id: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    updateQuantity(req: {
        user: {
            userId: string;
        };
    }, itemId: string, quantity: number): Promise<{
        id: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    removeItem(req: {
        user: {
            userId: string;
        };
    }, itemId: string): Promise<{
        id: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    clearCart(req: {
        user: {
            userId: string;
        };
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
export {};
