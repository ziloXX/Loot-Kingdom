import { ApiProperty } from '@nestjs/swagger';
import { Category, ProductTier } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Goku Super Saiyan - Grandista' })
  title: string;

  @ApiProperty({ example: 'goku-ssj-grandista' })
  slug: string;

  @ApiProperty({ example: 'Figura de 28cm marca Banpresto con gran detalle.' })
  description: string;

  @ApiProperty({ example: 'Banpresto' })
  brand: string;

  @ApiProperty({ example: 'Dragon Ball Z' })
  franchise: string;

  @ApiProperty({ enum: Category, example: 'FIGURE' })
  category: Category;

  @ApiProperty({ example: ['https://i.imgur.com/goku-demo.jpg'] })
  images: string[];

  // Definimos la estructura compleja de variantes para que Swagger la entienda
  @ApiProperty({
    example: {
      create: [
        {
          tier: 'OFFICIAL',
          price: 85000,
          stock: 5,
          condition: 'New / Sealed',
          realPhotos: []
        },
        {
          tier: 'BATTLE_DAMAGED',
          price: 45000,
          stock: 1,
          condition: 'Sin caja, leve detalle en cabello',
          realPhotos: ['https://i.imgur.com/broken-goku.jpg']
        }
      ]
    }
  })
  variants: {
    create: {
      tier: ProductTier;
      price: number;
      stock: number;
      condition?: string;
      realPhotos?: string[];
    }[];
  };
}