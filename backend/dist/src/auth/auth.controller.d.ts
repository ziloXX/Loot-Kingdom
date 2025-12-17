import { AuthService } from './auth.service';
interface LoginDto {
    email: string;
    password: string;
}
interface RegisterDto {
    email: string;
    password: string;
    username: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            lootCoins: number;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            lootCoins: number;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getProfile(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        id: string;
        email: string;
        username: string;
        lootCoins: number;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getStats(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        user: {
            id: string;
            username: string;
            lootCoins: number;
        };
        stats: {
            level: number;
            currentLevelProgress: number;
            spentToNextLevel: number;
            playerClass: string;
            totalSpent: number;
            totalOrders: number;
            totalLootCoinsEarned: number;
        };
        recentCoinGains: {
            orderId: string;
            amount: number;
            date: Date;
        }[];
        orders: ({
            items: {
                id: string;
                quantity: number;
                priceAtOrder: number;
                orderId: string;
                productId: string;
            }[];
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
        })[];
    }>;
}
export {};
