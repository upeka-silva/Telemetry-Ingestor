import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Telemetry, TelemetrySchema } from './schemas/telemetry.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import Redis from 'ioredis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis(
      configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
    );
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Telemetry.name, schema: TelemetrySchema },
    ]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService, redisProvider],
  exports: [TelemetryService],
})
export class TelemetryModule {}
