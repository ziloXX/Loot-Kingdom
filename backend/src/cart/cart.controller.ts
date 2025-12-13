import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@Controller('cart')
// @UseGuards(JwtAuthGuard)  // TODO: Descomentar cuando implementes los guards
// @ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
    @ApiResponse({ status: 400, description: 'Insufficient stock' })
    addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
        // TODO: Usar req.user.id cuando implementes guards
        const userId = 'mock-user-id';  // Temporal
        return this.cartService.addToCart(userId, addToCartDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user cart' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
    getCart(@Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.cartService.getCart(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    updateCartItem(
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @Request() req: any
    ) {
        const userId = 'mock-user-id';  // Temporal
        return this.cartService.updateCartItem(userId, id, updateCartItemDto.quantity);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 200, description: 'Item removed from cart' })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    removeCartItem(@Param('id') id: string, @Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.cartService.removeCartItem(userId, id);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear entire cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
    clearCart(@Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.cartService.clearCart(userId);
    }
}
