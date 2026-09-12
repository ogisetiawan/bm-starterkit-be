// FILE: apps/api-services/src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

/** Public liveness probe — intentionally unguarded. */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string } {
    return { status: 'ok' };
  }
}
