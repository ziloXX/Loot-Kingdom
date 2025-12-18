import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Reward options
export const REWARD_OPTIONS = [
  { id: 'small', name: 'Small Blessing', percent: 10, cost: 1000 },
  { id: 'hero', name: "Hero's Boon", percent: 20, cost: 2500 },
  { id: 'legendary', name: 'Legendary Discount', percent: 50, cost: 10000 },
];

@Injectable()
export class CouponsService {
  // Get available reward options
  getRewardOptions() {
    return REWARD_OPTIONS;
  }

  // Redeem LootCoins for a coupon
  async redeem(userId: string, rewardId: string) {
    const reward = REWARD_OPTIONS.find((r) => r.id === rewardId);

    if (!reward) {
      throw new BadRequestException('Invalid reward option');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.lootCoins < reward.cost) {
      throw new BadRequestException(
        `Not enough LootCoins. You have ${user.lootCoins}, need ${reward.cost}`
      );
    }

    // Generate unique code
    const code = this.generateCode(reward.percent);

    // Transaction: deduct coins and create coupon
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

  // Validate a coupon code
  async validate(code: string, userId?: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Coupon has already been used' };
    }

    // If coupon is personal, check ownership
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

  // Mark coupon as used
  async markAsUsed(code: string) {
    return prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: {
        isActive: false,
        usedAt: new Date(),
      },
    });
  }

  // Get user's coupons
  async getUserCoupons(userId: string) {
    return prisma.coupon.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Generate unique code like LOOT-500-X7Z9
  private generateCode(percent: number): string {
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `LOOT-${percent}-${random}`;
  }
}
