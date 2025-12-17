import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService, ProductFilters } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('condition') condition?: string,
        @Query('tier') tier?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('search') search?: string,
    ) {
        const filters: ProductFilters = {};

        if (category) filters.category = category;
        if (condition) filters.condition = condition;
        if (tier) filters.tier = tier;
        if (minPrice) filters.minPrice = parseInt(minPrice, 10);
        if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10);
        if (search) filters.search = search;

        return this.productsService.findAll(filters);
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }
}
