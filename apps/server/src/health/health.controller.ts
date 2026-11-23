import {
  healthOkSchema,
  healthUnavailableSchema,
  type HealthResponse,
} from '@fanera/contracts';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { HealthService } from './health.service.js';

/**
 * Для docker healthcheck / балансировщика / проверки «сервер живой».
 * 200 — всё работает, 503 — какая-то зависимость недоступна
 * (по коду ответа решают машины, тело — для человека).
 */
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Проверка состояния сервера' })
  @ApiOkResponse({ standardSchema: healthOkSchema })
  @ApiServiceUnavailableResponse({ standardSchema: healthUnavailableSchema })
  async check(
    @Res({ passthrough: true }) response: Response,
  ): Promise<HealthResponse> {
    const report = await this.health.check();
    const payload: HealthResponse = {
      ...report,
      uptime: process.uptime(),
    };
    if (report.status !== 'ok') {
      // Это диагностический отчёт, а не ошибка REST: сохраняем его тело при 503.
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return payload;
  }
}
