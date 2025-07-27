import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เปิด CORS เพื่อให้ frontend (ที่รันคนละ por) เรียกได้
  app.enableCors({
    origin: 'http://localhost:5173', // หรือใส่ '*' สำหรับทั้งหมด (ไม่แนะนำใน production)
    credentials: true
  })
  
  const port = process.env.PORT || 3000;
  console.log("running on port :", port);

  await app.listen(port);
}
bootstrap();
