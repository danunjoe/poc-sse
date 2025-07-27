import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseService } from './sse/sse.service';
import { SseController } from './sse/sse.controller';
import { ProducerController } from './producer/producer.controller';
import { RedisStreamService } from './producer/producer.service';
import { ConsumerService } from './sse/consumer.service';
import { OverrideModule } from './override/override.module';

@Module({
  imports: [
    OverrideModule
  ],
  controllers: [
    AppController,
    SseController,
    ProducerController
  ],
  providers: [
    AppService,
    SseService,
    RedisStreamService,
    ConsumerService
  ],
})
export class AppModule { }
