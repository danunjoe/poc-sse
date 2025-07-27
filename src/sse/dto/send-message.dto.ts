// src/sse/dto/send-message.dto.ts
import { IsIn, IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
    @IsIn(['staff', 'role', 'branch'])
    type: 'staff' | 'role' | 'branch';

    @IsString()
    @IsNotEmpty()
    target: string;

    message: any;
}