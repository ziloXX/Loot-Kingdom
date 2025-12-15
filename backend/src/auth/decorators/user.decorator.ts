import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @User() Decorator - Extracts user from JWT payload.
 * 
 * Usage:
 *   @Get('profile')
 *   getProfile(@User() user: { userId: string; email: string; role: string }) {
 *     return user;
 *   }
 * 
 * Or extract specific property:
 *   @Get('profile')
 *   getProfile(@User('userId') userId: string) {
 *     return userId;
 *   }
 */
export const User = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // If a specific property is requested, return only that
        return data ? user?.[data] : user;
    },
);
