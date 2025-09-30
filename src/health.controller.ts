import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('healthcheck')
  health() {
    return { status: 'ok' };
  }
}
