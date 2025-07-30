import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // ✅ ให้ NestJS อ่าน cookie ได้

  // เปิด CORS เพื่อให้ frontend (ที่รันคนละ por) เรียกได้
  app.enableCors({
    origin: 'http://localhost:5173', // หรือใส่ '*' สำหรับทั้งหมด (ไม่แนะนำใน production)
    credentials: true
  })

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     const allowedOrigins = ['http://localhost:5173', 'https://your-prod.com'];
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  // });

  // // ✅ เพิ่ม CORS เฉพาะสำหรับ SSE route
  // app.use('/sse', (req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   next();
  // });

  const port = process.env.PORT || 3000;
  console.log("running on port :", port);

  await app.listen(port);
}
bootstrap();
