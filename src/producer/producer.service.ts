// src/stream/redis-stream.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisStreamService implements OnModuleInit {
    private redis: Redis;

    constructor(
        // private configService: ConfigService
    ) { }

    onModuleInit() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        });
    }

    async produce(streamName: string, data: Record<string, string>) {

        // แปลง array/object → JSON string ก่อน xadd
        const serializedData = Object.entries(data).flatMap(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value),
        ]);

        // const id = await this.redis.xadd(
        //     streamName,
        //     '*', // auto ID
        //     ...Object.entries(data).flat(),
        // );

        // console.log(data);

        // MAXLEN ~ 5000 (เก็บเฉพาะ N ข้อมูลล่าสุด)
        const id = await this.redis.xadd(
            streamName,
            'MAXLEN', '~', 5000, // เก็บสูงสุด 5000 record (approx)
            '*', // auto generate ID
            ...serializedData
        );

        return {
            id,
            data: data.content
        };
    }
}
