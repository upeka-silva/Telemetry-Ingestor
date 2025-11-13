import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  IsNumber,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MetricsDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}

export class TelemetryDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  siteId: string;

  @IsDateString()
  ts: string;

  @ValidateNested()
  @Type(() => MetricsDto)
  metrics: MetricsDto;
}

export class TelemetryBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TelemetryDto)
  @ValidateIf((o) => Array.isArray(o))
  data?: TelemetryDto[];
}
