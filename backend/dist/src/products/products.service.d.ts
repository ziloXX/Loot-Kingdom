export interface ProductFilters {
    category?: string;
    condition?: string;
    tier?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}
export declare class ProductsService {
    findAll(filters?: ProductFilters): Promise<{
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
    findBySlug(slug: string): Promise<{
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
    } | null>;
    findById(id: string): Promise<{
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
    } | null>;
}
