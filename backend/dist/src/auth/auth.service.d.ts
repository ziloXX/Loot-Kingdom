import { JwtService } from '@nestjs/jwt';
export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    email: string;
    password: string;
    username: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        lootCoins: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        lootCoins: number;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getStats(userId: string): Promise<{
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
