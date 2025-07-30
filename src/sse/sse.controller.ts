// src/sse/sse.controller.ts
import {
    Controller,
    Get,
    Query,
    Res,
    Req,
    MessageEvent,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SseService } from './sse.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sse')
export class SseController {
    constructor(
        private readonly sseService: SseService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Get()
    async connect(
        @Query('staff_id') staff_id: string,
        @Query('role_id') role_id: string,
        @Query('branch_code') branch_code: string,
        @Req() req: any,
        @Res() res: Response,
    ) {

        // const user = req.user as any;
        // console.log('🔐 Authenticated SSE:', user);

        // const staff_id = user.staff_id;
        // const role_id = user.role_id;
        // const branch_code = user.branch_code;

        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*', // 👈 เพิ่มตรงนี้ (หรือใส่ origin ที่อนุญาต)
        });

        res.flushHeaders();
        res.write(`data: Connected\n\n`);

        this.sseService.addClient({
            staff_id,
            role_id,
            branch_code,
            res,
        });

        req.on('close', () => {
            this.sseService.removeClient(res);
            res.end();
        });
    }

    // @Get()
    // async connect(
    //     @Query('staff_id') staff_id: string,
    //     @Query('role_id') role_id: string,
    //     @Query('branch_code') branch_code: string,
    //     @Query('other') other: string,
    //     @Req() req: any,
    //     @Res() res: Response,
    // ) {
    //     res.set({
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache',
    //         'Connection': 'keep-alive',
    //         'Access-Control-Allow-Origin': '*', // 👈 เพิ่มตรงนี้ (หรือใส่ origin ที่อนุญาต)
    //     });

    //     res.flushHeaders();
    //     res.write(`data: Connected\n\n`);

    //     const client = {
    //         staff_id,
    //         role_id,
    //         branch_code,
    //         other,
    //         res,
    //     };

    //     this.sseService.addClient(client);

    //     req.on('close', () => {
    //         this.sseService.removeClient(res);
    //     });
    // }

    // @Post('send')
    // async send(@Body() body: SendMessageDto) {
    //     const { type, target, message } = body;

    //     switch (type) {
    //         case 'staff':
    //             this.sseService.sendToStaff(target, message);
    //             break;
    //         case 'role':
    //             this.sseService.sendToRole(target, message);
    //             break;
    //         case 'branch':
    //             this.sseService.sendToBranch(target, message);
    //             break;
    //     }

    //     return { status: 'sent' };
    // }

    // @Post('broadcast')
    // async broadcast(@Body() message: any) {
    //     this.sseService.broadcastMessage(message);
    //     return { status: 'sent', clientCount: this.sseService.getClientCount() };
    // }
}
