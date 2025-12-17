import { Controller, Post, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    async createOrder(@Request() req: { user: { userId: string } }) {
        return this.ordersService.createOrder(req.user.userId);
    }

    @Post(':id/confirm')
    async confirmPayment(
        @Request() req: { user: { userId: string } },
        @Param('id') orderId: string,
        @Query('status') status: string,
    ) {
        return this.ordersService.confirmPayment(orderId, status);
    }

    @Get()
    async getOrders(@Request() req: { user: { userId: string } }) {
        return this.ordersService.getOrders(req.user.userId);
    }

    @Get(':id')
    async getOrder(
        @Request() req: { user: { userId: string } },
        @Param('id') orderId: string,
    ) {
        return this.ordersService.getOrder(req.user.userId, orderId);
    }
}
