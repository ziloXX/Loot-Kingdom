import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, condition?: string, tier?: string, minPrice?: string, maxPrice?: string, search?: string): Promise<{
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
}
