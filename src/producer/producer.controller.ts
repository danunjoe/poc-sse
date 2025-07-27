// src/stream/stream.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RedisStreamService } from './producer.service';

@Controller('producer')
export class ProducerController {
    constructor(private readonly redisService: RedisStreamService) { }

    @Post('produce')
    async produce(@Body() body: { stream: string; data: Record<string, string> }) {
        const data = await this.redisService.produce(body.stream, body.data);
        return { status: 'ok', data };
    }
}
