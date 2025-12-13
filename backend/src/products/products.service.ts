import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  // 1. Crear producto con variantes
  async create(createProductDto: CreateProductDto) {
    // createProductDto viene validado por class-validator
    return await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        slug: createProductDto.slug,
        description: createProductDto.description,
        brand: createProductDto.brand,
        franchise: createProductDto.franchise,
        category: createProductDto.category,
        images: createProductDto.images,
        variants: {
          create: createProductDto.variants.create, // Nested write de Prisma
        },
      },
      include: { variants: true },
    });
  }

  // 2. Traer todos (Optimized fetch)
  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        variants: {
          select: {  // Solo info vital para la vista de lista
            id: true,
            tier: true,
            price: true,
            stock: true,
          }
        },
      }
    });
  }

  // 3. Buscar por Slug (Para la Product Page)
  async findOne(slugOrId: string) {
    // Intentamos buscar por slug primero, si falla, por ID
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId } // Fallback por si usamos ID interno
        ]
      },
      include: {
        variants: true,
        reviews: true
      }
    });
    return product;
  }
}
