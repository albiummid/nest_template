import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

interface DatabaseStatus {
  status: string;
  responseTime?: number;
  error?: string;
}

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: string;
  };
  database?: DatabaseStatus;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Inject()
  private readonly dataSource: DataSource;

  @Get()
  @Public()
  @ApiSuccessResponse(Object, 200)
  async check(): Promise<HealthCheckResponse> {
    const used = process.memoryUsage().heapUsed;
    const total = process.memoryUsage().heapTotal;

    // Check database connection
    let dbStatus: DatabaseStatus | undefined;
    try {
      const start = Date.now();
      await this.dataSource.query('SELECT 1');
      dbStatus = {
        status: 'connected',
        responseTime: Date.now() - start,
      };
    } catch (error) {
      dbStatus = {
        status: 'disconnected',
        error: (error as Error).message,
      };
    }

    return {
      status: dbStatus?.status === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(used / 1024 / 1024),
        total: Math.round(total / 1024 / 1024),
        percentage: ((used / total) * 100).toFixed(2) + '%',
      },
      database: dbStatus,
    };
  }
}
