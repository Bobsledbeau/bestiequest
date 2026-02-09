import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-15T10:30:00.000Z',
        service: 'bestiequest',
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'bestiequest',
    };
  }

  @Post('keep-warm')
  @ApiOperation({ summary: 'Keep-warm endpoint for preventing cold starts' })
  @ApiResponse({
    status: 200,
    description: 'Keep-warm ping successful',
    schema: {
      example: {
        status: 'warm',
        timestamp: '2024-01-15T10:30:00.000Z',
        message: 'Container kept warm',
      },
    },
  })
  keepWarm() {
    return {
      status: 'warm',
      timestamp: new Date().toISOString(),
      message: 'Container kept warm',
    };
  }
}
