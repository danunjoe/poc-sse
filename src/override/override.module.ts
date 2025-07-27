// src/override/override.module.ts
import { Module } from '@nestjs/common';
import { OverrideController } from './override.controller';

@Module({
    controllers: [OverrideController],
})
export class OverrideModule { }
