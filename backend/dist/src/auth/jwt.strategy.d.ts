import { Strategy } from 'passport-jwt';
interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
export {};
