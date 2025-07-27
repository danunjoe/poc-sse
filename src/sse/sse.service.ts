// src/sse/sse.gateway.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MessagePayload } from '../interfaces/message-payload.interface';

interface Client {
    staff_id: string;
    role_id: string;
    branch_code: string;
    res: Response;
}

@Injectable()
export class SseService {
    private clients: Set<Client> = new Set();

    addClient(client: Client) {
        this.clients.add(client);
    }

    removeClient(res: Response) {
        this.clients.forEach((client) => {
            if (client.res === res) this.clients.delete(client);
        });
    }

    sendToClientsByScope(payload: MessagePayload) {
        for (const client of this.clients) {
            const match =
                (payload.target_scope === 'staff' && payload.staff_id?.includes(client.staff_id)) ||
                (payload.target_scope === 'role' && payload.role_id?.includes(client.role_id)) ||
                (payload.target_scope === 'branch' && payload.branch_code?.includes(client.branch_code)) ||
                (payload.target_scope === 'broadcast');

            if (match) {
                client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
            }
        }
    }
}
