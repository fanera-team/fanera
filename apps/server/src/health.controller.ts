import { Controller, Get } from '@nestjs/common';

/** Для docker healthcheck / балансировщика / проверки «сервер живой». */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
