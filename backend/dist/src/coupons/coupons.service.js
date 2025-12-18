"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = exports.REWARD_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const prisma = new client_1.PrismaClient();
exports.REWARD_OPTIONS = [
    { id: 'small', name: 'Small Blessing', percent: 10, cost: 1000 },
    { id: 'hero', name: "Hero's Boon", percent: 20, cost: 2500 },
    { id: 'legendary', name: 'Legendary Discount', percent: 50, cost: 10000 },
];
let CouponsService = class CouponsService {
    getRewardOptions() {
        return exports.REWARD_OPTIONS;
    }
    async redeem(userId, rewardId) {
        const reward = exports.REWARD_OPTIONS.find((r) => r.id === rewardId);
        if (!reward) {
            throw new common_1.BadRequestException('Invalid reward option');
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.lootCoins < reward.cost) {
            throw new common_1.BadRequestException(`Not enough LootCoins. You have ${user.lootCoins}, need ${reward.cost}`);
        }
        const code = this.generateCode(reward.percent);
        const [updatedUser, coupon] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { lootCoins: { decrement: reward.cost } },
            }),
            prisma.coupon.create({
                data: {
                    code,
                    discountPercent: reward.percent,
                    lootCoinsCost: reward.cost,
                    userId,
                    isActive: true,
                },
            }),
        ]);
        return {
            coupon,
            newBalance: updatedUser.lootCoins,
        };
    }
    async validate(code, userId) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!coupon) {
            return { valid: false, error: 'Invalid coupon code' };
        }
        if (!coupon.isActive) {
            return { valid: false, error: 'Coupon has already been used' };
        }
        if (coupon.userId && coupon.userId !== userId) {
            return { valid: false, error: 'This coupon belongs to another user' };
        }
        return {
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discountPercent: coupon.discountPercent,
            },
        };
    }
    async markAsUsed(code) {
        return prisma.coupon.update({
            where: { code: code.toUpperCase() },
            data: {
                isActive: false,
                usedAt: new Date(),
            },
        });
    }
    async getUserCoupons(userId) {
        return prisma.coupon.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    generateCode(percent) {
        const random = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `LOOT-${percent}-${random}`;
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)()
], CouponsService);
//# sourceMappingURL=coupons.service.js.map