// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.['access_token'], // 👈 ดึงจาก cookie
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'mysecret',
        });
    }

    async validate(payload: any) {
        // payload ถูก decode แล้ว
        return payload;
    }
}
