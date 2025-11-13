import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from '../../telemetry/telemetry.service';

@Controller('health')
export class HealthController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  async check() {
    const health = await this.telemetryService.checkHealth();
    const isHealthy = health.mongo && health.redis;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      services: health,
    };
  }
}
