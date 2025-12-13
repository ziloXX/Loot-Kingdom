import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty({ example: 'variant-uuid-123' })
    @IsString({ message: 'Variant ID must be a string' })
    variantId: string;

    @ApiProperty({ example: 2, minimum: 1 })
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}
