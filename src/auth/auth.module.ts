// src/override/override.module.ts
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [],
    providers: [
        JwtAuthGuard,
        JwtStrategy
    ],
    exports: [
        JwtAuthGuard,
        JwtStrategy
    ]
})
export class AuthModule { }
