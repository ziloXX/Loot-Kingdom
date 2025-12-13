import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
// @UseGuards(JwtAuthGuard)  // TODO: Descomentar cuando implementes guards
// @ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    @ApiOperation({ summary: 'Create order from cart (Checkout)' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Cart is empty or insufficient stock' })
    createOrder(@Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.ordersService.createOrder(userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user orders' })
    @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
    getUserOrders(@Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.ordersService.getUserOrders(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    getOrderById(@Param('id') id: string, @Request() req: any) {
        const userId = 'mock-user-id';  // Temporal
        return this.ordersService.getOrderById(id, userId);
    }
}
