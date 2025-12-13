import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsUrl,
  MaxLength,
  IsInt,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category, ProductTier } from '@prisma/client';

// 🔒 Nested DTO for variant validation
class CreateVariantDto {
  @ApiProperty({ enum: ProductTier, example: 'OFFICIAL' })
  @IsEnum(ProductTier, { message: 'Tier must be one of: OFFICIAL, SECOND_HAND, BATTLE_DAMAGED' })
  tier: ProductTier;

  @ApiProperty({ example: 85000 })
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({ example: 5 })
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @ApiProperty({ example: 'New / Sealed', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Condition description too long' })
  condition?: string;

  @ApiProperty({ example: ['https://i.imgur.com/photo.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each photo must be a valid URL' })
  realPhotos?: string[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'Goku Super Saiyan - Grandista' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title too long (max 200 characters)' })
  title: string;

  @ApiProperty({ example: 'goku-ssj-grandista' })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug cannot be empty' })
  @MaxLength(100, { message: 'Slug too long (max 100 characters)' })
  slug: string;

  @ApiProperty({ example: 'Figura de 28cm marca Banpresto con gran detalle.' })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MaxLength(5000, { message: 'Description too long (max 5000 characters)' })
  description: string;

  @ApiProperty({ example: 'Banpresto' })
  @IsString({ message: 'Brand must be a string' })
  @IsNotEmpty({ message: 'Brand cannot be empty' })
  @MaxLength(100, { message: 'Brand name too long' })
  brand: string;

  @ApiProperty({ example: 'Dragon Ball Z' })
  @IsString({ message: 'Franchise must be a string' })
  @IsNotEmpty({ message: 'Franchise cannot be empty' })
  @MaxLength(100, { message: 'Franchise name too long' })
  franchise: string;

  @ApiProperty({ enum: Category, example: 'FIGURE' })
  @IsEnum(Category, { message: 'Category must be one of: FIGURE, TCG_CARD, PLUSHIE, DECOR, APPAREL' })
  category: Category;

  @ApiProperty({ example: ['https://i.imgur.com/goku-demo.jpg'] })
  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images: string[];

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
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: {
    create: CreateVariantDto[];
  };
}