import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private couponsService;
    constructor(couponsService: CouponsService);
    getOptions(): {
        id: string;
        name: string;
        percent: number;
        cost: number;
    }[];
    redeem(req: {
        user: {
            userId: string;
        };
    }, rewardId: string): Promise<{
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
    validate(req: {
        user: {
            userId: string;
        };
    }, code: string): Promise<{
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
    getMyCoupons(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        code: string;
        discountPercent: number;
        lootCoinsCost: number;
        isActive: boolean;
        usedAt: Date | null;
    }[]>;
}
