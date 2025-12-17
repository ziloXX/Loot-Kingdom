import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: JwtPayload) {
        // Fetch user with role from database
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, username: true, role: true },
        });

        if (!user) {
            return null;
        }

        return {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
    }
}
