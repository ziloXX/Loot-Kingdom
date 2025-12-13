import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  // 1. Crear un producto nuevo
  async create(createProductDto: CreateProductDto) {
    // any cast removed, we assume DTO matches roughly or we let Prisma handle mismatch if strict types aren't fully aligned yet
    return await this.prisma.product.create({
      data: createProductDto as any, // Temporary cast until strict DTO alignment
    });
  }

  // 2. Traer todos los productos
  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        variants: true,
      }
    });
  }

  // 3. Buscar uno por ID
  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    });
  }
}
