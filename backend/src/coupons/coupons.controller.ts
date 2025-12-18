import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coupons')
export class CouponsController {
    constructor(private couponsService: CouponsService) { }

    // Get available reward options
    @Get('options')
    getOptions() {
        return this.couponsService.getRewardOptions();
    }

    // Redeem LootCoins for coupon
    @Post('redeem')
    @UseGuards(JwtAuthGuard)
    async redeem(
        @Request() req: { user: { userId: string } },
        @Body('rewardId') rewardId: string,
    ) {
        return this.couponsService.redeem(req.user.userId, rewardId);
    }

    // Validate coupon code
    @Get('validate')
    @UseGuards(JwtAuthGuard)
    async validate(
        @Request() req: { user: { userId: string } },
        @Query('code') code: string,
    ) {
        return this.couponsService.validate(code, req.user.userId);
    }

    // Get user's coupons
    @Get('my-coupons')
    @UseGuards(JwtAuthGuard)
    async getMyCoupons(@Request() req: { user: { userId: string } }) {
        return this.couponsService.getUserCoupons(req.user.userId);
    }
}
