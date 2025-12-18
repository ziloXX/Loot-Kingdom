export declare const REWARD_OPTIONS: {
    id: string;
    name: string;
    percent: number;
    cost: number;
}[];
export declare class CouponsService {
    getRewardOptions(): {
        id: string;
        name: string;
        percent: number;
        cost: number;
    }[];
    redeem(userId: string, rewardId: string): Promise<{
        coupon: {
            id: string;
            createdAt: Date;
            userId: string | null;
            code: string;
            discountPercent: number;
            lootCoinsCost: number;
            isActive: boolean;
            usedAt: Date | null;
        };
        newBalance: number;
    }>;
    validate(code: string, userId?: string): Promise<{
        valid: boolean;
        error: string;
        coupon?: undefined;
    } | {
        valid: boolean;
        coupon: {
            id: string;
            code: string;
            discountPercent: number;
        };
        error?: undefined;
    }>;
    markAsUsed(code: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        code: string;
        discountPercent: number;
        lootCoinsCost: number;
        isActive: boolean;
        usedAt: Date | null;
    }>;
    getUserCoupons(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        code: string;
        discountPercent: number;
        lootCoinsCost: number;
        isActive: boolean;
        usedAt: Date | null;
    }[]>;
    private generateCode;
}
