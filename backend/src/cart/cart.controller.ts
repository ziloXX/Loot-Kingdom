import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AddToCartDto {
    productId: string;
    quantity?: number;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private cartService: CartService) { }

    @Get()
    async getCart(@Request() req: { user: { userId: string } }) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post('add')
    async addToCart(
        @Request() req: { user: { userId: string } },
        @Body() dto: AddToCartDto,
    ) {
        return this.cartService.addToCart(req.user.userId, dto);
    }

    @Patch(':itemId')
    async updateQuantity(
        @Request() req: { user: { userId: string } },
        @Param('itemId') itemId: string,
        @Body('quantity') quantity: number,
    ) {
        return this.cartService.updateQuantity(req.user.userId, itemId, quantity);
    }

    @Delete(':itemId')
    async removeItem(
        @Request() req: { user: { userId: string } },
        @Param('itemId') itemId: string,
    ) {
        return this.cartService.removeItem(req.user.userId, itemId);
    }

    @Delete()
    async clearCart(@Request() req: { user: { userId: string } }) {
        return this.cartService.clearCart(req.user.userId);
    }
}
