import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseService } from './sse/sse.service';
import { SseController } from './sse/sse.controller';
import { ProducerController } from './producer/producer.controller';
import { RedisStreamService } from './producer/producer.service';
import { ConsumerService } from './sse/consumer.service';
import { OverrideModule } from './override/override.module';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { SseCorsMiddleware } from './common/middleware/sse-cors.middleware';

@Module({
  imports: [
    OverrideModule,
    AuthModule
  ],
  controllers: [
    AppController,
    AuthController,
    SseController,
    ProducerController
  ],
  providers: [
    AppService,
    SseService,
    RedisStreamService,
    ConsumerService,
    JwtService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SseCorsMiddleware).forRoutes('*'); // หรือ '/sse' เท่านั้นก็ได้
  }
}
