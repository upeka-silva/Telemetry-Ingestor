import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';

describe('TelemetryController', () => {
  let controller: TelemetryController;
  let service: TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController],
      providers: [
        {
          provide: TelemetryService,
          useValue: {
            ingestTelemetry: jest.fn().mockResolvedValue(undefined),
            getLatest: jest.fn().mockResolvedValue({
              deviceId: 'dev-001',
              siteId: 'site-A',
              ts: '2025-09-01T10:00:00.000Z',
              metrics: { temperature: 25, humidity: 60 },
            }),
            getSiteSummary: jest.fn().mockResolvedValue({
              count: 10,
              avgTemperature: 30.5,
              maxTemperature: 45,
              avgHumidity: 65.2,
              maxHumidity: 80,
              uniqueDevices: 3,
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TelemetryController>(TelemetryController);
    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ingestTelemetry', () => {
    it('should call service.ingestTelemetry', async () => {
      const telemetry = {
        deviceId: 'dev-001',
        siteId: 'site-A',
        ts: '2025-09-01T10:00:00.000Z',
        metrics: { temperature: 25, humidity: 60 },
      };

      await controller.ingestTelemetry(telemetry);

      expect(service.ingestTelemetry).toHaveBeenCalledWith(telemetry);
    });
  });

  describe('getLatest', () => {
    it('should return latest telemetry for device', async () => {
      const result = await controller.getLatest('dev-001');

      expect(result.deviceId).toBe('dev-001');
      expect(service.getLatest).toHaveBeenCalledWith('dev-001');
    });
  });

  describe('getSummary', () => {
    it('should return site summary', async () => {
      const query = {
        from: '2025-09-01T00:00:00.000Z',
        to: '2025-09-02T00:00:00.000Z',
      };

      const result = await controller.getSummary('site-A', query);

      expect(result.count).toBe(10);
      expect(service.getSiteSummary).toHaveBeenCalledWith(
        'site-A',
        query.from,
        query.to,
      );
    });
  });
});
