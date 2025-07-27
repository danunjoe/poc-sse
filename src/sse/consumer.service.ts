// src/stream/consumer.service.ts
import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { SseService } from './sse.service';
import { MessagePayload } from '../interfaces/message-payload.interface';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ConsumerService.name);
    private redis: Redis;
    private group = `notif-consumer-group-${Math.random()}`;
    private consumer = `worker-${Math.random()}`;

    constructor(private readonly sseService: SseService) { }

    async onModuleInit() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        });

        try {
            await this.redis.xgroup('CREATE', 'notifications', this.group, '$', 'MKSTREAM');
        } catch (err) {
            if (!err.message.includes('BUSYGROUP')) throw err;
        }

        this.pollStream();
    }

    async onModuleDestroy() {
        await this.redis.xgroup('DESTROY', 'notifications', this.group);
        this.logger.log(`[Redis] Group ${this.group} destroyed`);
    }

    private async pollStream() {
        while (true) {
            try {
                const result = await (this.redis as any).xreadgroup(
                    'GROUP',
                    this.group,
                    this.consumer,
                    'BLOCK', 5000,
                    'COUNT', 10,
                    'STREAMS',
                    'notifications',
                    '>'
                );

                if (result) {
                    const [stream, messages] = result[0];
                    console.log(messages);

                    for (const [id, fields] of messages) {
                        const data = this.parseFields(fields);
                        console.log(data);
                        try {
                            const payload = this.convertToPayload(data);
                            this.handleMessage(payload);
                            await this.redis.xack('notifications', this.group, id);
                        } catch (err) {
                            this.logger.warn(`Invalid payload: ${JSON.stringify(data)}`);
                        }
                    }
                }
            } catch (err) {
                this.logger.error('Error polling Redis stream', err);
                await new Promise((res) => setTimeout(res, 1000));
            }
        }
    }

    private parseFields(fields: string[]): Record<string, string> {
        const obj: Record<string, string> = {};
        for (let i = 0; i < fields.length; i += 2) {
            obj[fields[i]] = fields[i + 1];
        }
        return obj;
    }

    private convertToPayload(data: Record<string, string>): MessagePayload {
        return {
            type: data.type,
            content: data.content,
            status: data.status as any,
            is_show_alert: data.is_show_alert === 'true',
            target_scope: data.target_scope as any,
            staff_id: data.staff_id ? JSON.parse(data.staff_id) : [],
            role_id: data.role_id ? JSON.parse(data.role_id) : [],
            branch_code: data.branch_code ? JSON.parse(data.branch_code) : [],
        };
    }

    private handleMessage(payload: MessagePayload) {
        this.sseService.sendToClientsByScope(payload);
    }
}
