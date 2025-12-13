import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // 🔒 Safe assertion: JWT_SECRET is validated in main.ts bootstrap
            secretOrKey: process.env.JWT_SECRET as string,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
