import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: string;
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiSuccessResponse(Object, 200)
  check(): HealthCheckResponse {
    const used = process.memoryUsage().heapUsed;
    const total = process.memoryUsage().heapTotal;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(used / 1024 / 1024),
        total: Math.round(total / 1024 / 1024),
        percentage: ((used / total) * 100).toFixed(2) + '%',
      },
    };
  }
}
