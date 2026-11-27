import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { MetricsService } from './metrics.service.js';

/**
 * Точка скрейпа Prometheus. Есть у всех трёх ролей и живёт вне /api:
 * её дёргает prometheus из внутренней сети, а не браузер.
 */
@Controller('metrics')
@ApiExcludeController()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async scrape(): Promise<string> {
    return this.metrics.scrape();
  }
}
