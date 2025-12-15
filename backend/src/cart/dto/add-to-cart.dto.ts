import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * AddToCartDto - Validated input for adding items to cart.
 * 
 * Security:
 * - variantId is validated as UUID to prevent injection
 * - quantity is validated as positive integer with reasonable max
 * - userId is NEVER passed here (extracted from JWT)
 */
export class AddToCartDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Product variant UUID'
    })
    @IsUUID('4', { message: 'Variant ID must be a valid UUID' })
    variantId: string;

    @ApiProperty({
        example: 1,
        minimum: 1,
        maximum: 10,
        description: 'Quantity to add (max 10 per request)'
    })
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    @Max(10, { message: 'Cannot add more than 10 items at once' })
    quantity: number;
}
