import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
    @ApiProperty({ example: 3, minimum: 1 })
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}
