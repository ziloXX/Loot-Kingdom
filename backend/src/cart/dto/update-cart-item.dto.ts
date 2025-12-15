import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateCartItemDto - Validated input for updating cart item quantity.
 */
export class UpdateCartItemDto {
    @ApiProperty({
        example: 2,
        minimum: 1,
        maximum: 99,
        description: 'New quantity for cart item'
    })
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    @Max(99, { message: 'Quantity cannot exceed 99' })
    quantity: number;
}
