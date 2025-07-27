// src/interfaces/message-payload.interface.ts
export interface MessagePayload {
    type: string;
    content: string;
    status: 'normal' | 'warning' | 'critical';
    is_show_alert: boolean;
    target_scope: 'staff' | 'role' | 'branch' | 'broadcast';
    staff_id?: string[];
    role_id?: string[];
    branch_code?: string[];
}
