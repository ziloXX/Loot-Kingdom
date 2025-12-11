import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  
  // 1. Crear un producto nuevo (El "Padre")
  async create(createProductDto: any) {
    // Por ahora usaremos 'any', luego pondremos el tipo estricto
    return await prisma.product.create({
      data: createProductDto,
    });
  }

  // 2. Traer todos los productos
  async findAll() {
    return await prisma.product.findMany({
      include: {
        variants: true, // ¡Trae también sus variantes!
      }
    });
  }

  // 3. Buscar uno por ID
  async findOne(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    });
  }
}