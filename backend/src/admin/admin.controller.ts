import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(private adminService: AdminService) { }

    // Dashboard
    @Get('dashboard')
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }

    // Products
    @Get('products')
    async getProducts() {
        return this.adminService.getAllProducts();
    }

    @Post('products')
    async createProduct(
        @Body()
        body: {
            title: string;
            slug: string;
            description: string;
            price: number;
            stock: number;
            tier: 'OFFICIAL' | 'BOOTLEG';
            category: 'FIGURE' | 'CARD' | 'PLUSH' | 'DECOR' | 'OTHER';
            condition?: 'NEW' | 'USED' | 'DAMAGED';
            brand?: string;
            franchise?: string;
            images?: string[];
        },
    ) {
        return this.adminService.createProduct(body);
    }

    @Patch('products/:id')
    async updateProduct(
        @Param('id') id: string,
        @Body()
        body: Partial<{
            title: string;
            price: number;
            stock: number;
            tier: 'OFFICIAL' | 'BOOTLEG';
            category: 'FIGURE' | 'CARD' | 'PLUSH' | 'DECOR' | 'OTHER';
            condition: 'NEW' | 'USED' | 'DAMAGED';
            brand: string;
            franchise: string;
            images: string[];
            description: string;
        }>,
    ) {
        return this.adminService.updateProduct(id, body);
    }

    @Delete('products/:id')
    async deleteProduct(@Param('id') id: string) {
        return this.adminService.deleteProduct(id);
    }

    // Orders
    @Get('orders')
    async getOrders() {
        return this.adminService.getAllOrders();
    }

    @Patch('orders/:id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body('status') status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
    ) {
        return this.adminService.updateOrderStatus(id, status);
    }
}
