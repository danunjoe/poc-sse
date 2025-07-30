// src/common/middleware/sse-cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SseCorsMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.path.startsWith('/sse')) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.header('Access-Control-Allow-Credentials', 'true');
        }
        next();
    }
}
