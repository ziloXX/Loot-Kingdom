"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = {
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
    async register(registerDto) {
        const existingEmail = await prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingEmail) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const existingUsername = await prisma.user.findUnique({
            where: { username: registerDto.username },
        });
        if (existingUsername) {
            throw new common_1.UnauthorizedException('Username already taken');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                username: registerDto.username,
                lootCoins: 100,
            },
        });
        const payload = {
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
    async getProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async getStats(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
        const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = user.orders.length;
        const totalLootCoinsEarned = user.orders.reduce((sum, order) => sum + order.lootCoinsEarned, 0);
        const level = Math.floor(totalSpent / 1000000) + 1;
        const currentLevelProgress = (totalSpent % 1000000) / 1000000;
        const spentToNextLevel = 1000000 - (totalSpent % 1000000);
        let playerClass = 'Novice Collector';
        if (level >= 10)
            playerClass = 'Legendary Hoarder';
        else if (level >= 7)
            playerClass = 'Master Collector';
        else if (level >= 5)
            playerClass = 'Elite Buyer';
        else if (level >= 3)
            playerClass = 'Seasoned Trader';
        else if (level >= 2)
            playerClass = 'Apprentice Collector';
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map