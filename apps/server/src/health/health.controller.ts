import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
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
  async check() {
    const report = await this.health.check();
    const body = { ...report, uptime: process.uptime() };

    if (report.status !== 'ok') {
      throw new ServiceUnavailableException(body);
    }

    return body;
  }
}
