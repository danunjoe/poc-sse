import { Controller, Post, Body, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService: JwtService) { }

    @Post('set-cookie')
    setCookie(
        @Body() body: { staff_id: string; role_id: string; branch_code: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const payload = {
            staff_id: body.staff_id,
            role_id: body.role_id,
            branch_code: body.branch_code,
            sub: body.staff_id,
        };

        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'mysecret',
            expiresIn: '1h',
        });

        // ✅ Set HttpOnly cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // ✅ production ควรเป็น true
            maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
        });

        return { message: 'Token set in cookie' };
    }
}
