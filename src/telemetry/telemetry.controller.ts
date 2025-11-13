import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryDto } from './dto/telemetry.dto';
import { SummaryQueryDto } from '../telemetry/dto/summery-query.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('api/v1')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('telemetry')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async ingestTelemetry(@Body() data: TelemetryDto | TelemetryDto[]) {
    await this.telemetryService.ingestTelemetry(data);
    return { success: true };
  }

  @Get('devices/:deviceId/latest')
  async getLatest(@Param('deviceId') deviceId: string) {
    const data = await this.telemetryService.getLatest(deviceId);
    if (!data) {
      return { message: 'No data found for device' };
    }
    return data;
  }

  @Get('sites/:siteId/summary')
  async getSummary(
    @Param('siteId') siteId: string,
    @Query() query: SummaryQueryDto,
  ) {
    return this.telemetryService.getSiteSummary(siteId, query.from, query.to);
  }
}
