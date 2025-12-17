import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    username: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                lootCoins: user.lootCoins,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingEmail) {
            throw new UnauthorizedException('Email already registered');
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: registerDto.username },
        });

        if (existingUsername) {
            throw new UnauthorizedException('Username already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user with starting LootCoins bonus
        const user = await prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                username: registerDto.username,
                lootCoins: 100, // Welcome bonus!
            },
        });

        // Auto-login after registration
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                lootCoins: user.lootCoins,
                role: user.role,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                lootCoins: true,
                role: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    async getStats(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    include: {
                        items: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Calculate stats
        const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = user.orders.length;
        const totalLootCoinsEarned = user.orders.reduce((sum, order) => sum + order.lootCoinsEarned, 0);

        // Level calculation: Level = floor(totalSpent / 10000) + 1
        const level = Math.floor(totalSpent / 1000000) + 1; // 1 level per $10,000 ARS spent
        const currentLevelProgress = (totalSpent % 1000000) / 1000000; // Progress to next level (0-1)
        const spentToNextLevel = 1000000 - (totalSpent % 1000000);

        // Class based on level
        let playerClass = 'Novice Collector';
        if (level >= 10) playerClass = 'Legendary Hoarder';
        else if (level >= 7) playerClass = 'Master Collector';
        else if (level >= 5) playerClass = 'Elite Buyer';
        else if (level >= 3) playerClass = 'Seasoned Trader';
        else if (level >= 2) playerClass = 'Apprentice Collector';

        // Recent coin gains
        const recentCoinGains = user.orders.slice(0, 5).map((order) => ({
            orderId: order.id,
            amount: order.lootCoinsEarned,
            date: order.createdAt,
        }));

        return {
            user: {
                id: user.id,
                username: user.username,
                lootCoins: user.lootCoins,
            },
            stats: {
                level,
                currentLevelProgress,
                spentToNextLevel,
                playerClass,
                totalSpent,
                totalOrders,
                totalLootCoinsEarned,
            },
            recentCoinGains,
            orders: user.orders,
        };
    }
}
