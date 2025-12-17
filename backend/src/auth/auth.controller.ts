import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface LoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    username: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req: { user: { userId: string } }) {
        return this.authService.getProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getStats(@Request() req: { user: { userId: string } }) {
        return this.authService.getStats(req.user.userId);
    }
}
