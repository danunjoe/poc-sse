// src/override/override.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('override')
export class OverrideController {
  @Get()
  getOverrides() {
    const now: Date = new Date();
    const timestamp: number = now.getTime();

    const mockData = [
      {
        type: 'alert',
        content: 'System override triggered' + Math.random(),
        is_show: true,
        target_scope: 'role',
        staff_id: ['201', '202'],
        role_id: ['manager'],
        branch_code: ['B003'],
      },
      {
        type: 'warning',
        content: 'Override limit reached ' + Math.random(),
        is_show: false,
        target_scope: 'branch',
        staff_id: [],
        role_id: [],
        branch_code: ['B002'],
      },
    ];

    return {
      data: mockData,
      last_update: new Date()
    };
  }
}
