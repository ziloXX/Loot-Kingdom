import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

/**
 * CartController - Shopping Cart Endpoints
 * 
 * Security:
 * - All routes protected by JwtAuthGuard
 * - userId extracted from JWT via @User decorator (never from body)
 * - Item IDs validated as UUID via ParseUUIDPipe
 */
@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
    @ApiResponse({ status: 400, description: 'Insufficient stock or invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT required' })
    addToCart(
        @User('userId') userId: string,
        @Body() addToCartDto: AddToCartDto
    ) {
        return this.cartService.addToCart(userId, addToCartDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user cart with calculated totals' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT required' })
    getCart(@User('userId') userId: string) {
        return this.cartService.getCart(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
    @ApiResponse({ status: 400, description: 'Insufficient stock' })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    updateCartItem(
        @Param('id', ParseUUIDPipe) itemId: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @User('userId') userId: string
    ) {
        return this.cartService.updateCartItem(userId, itemId, updateCartItemDto.quantity);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 200, description: 'Item removed from cart' })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    removeCartItem(
        @Param('id', ParseUUIDPipe) itemId: string,
        @User('userId') userId: string
    ) {
        return this.cartService.removeCartItem(userId, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear entire cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
    clearCart(@User('userId') userId: string) {
        return this.cartService.clearCart(userId);
    }
}
