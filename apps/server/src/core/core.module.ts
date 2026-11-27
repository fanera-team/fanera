import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../config/env.schema.js';
import { HealthModule } from '../health/health.module.js';
import { MetricsModule } from '../infra/metrics/metrics.module.js';

/**
 * Общая часть всех трёх ролей: проверенный конфиг, /health и /metrics.
 * Роль добавляет к ядру только свой транспорт: HTTP-контроллеры, WS-шлюз
 * или процессоры очередей.
 *
 * Конфиг живёт здесь, а не в точке входа: тогда main.api, main.collab
 * и main.worker проверяют .env одинаково и падают при ошибке до старта.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigService доступен во всех модулях без повторного импорта.
      isGlobal: true,
      cache: true,
      // .env + process.env проверяются схемой при старте.
      validationSchema: envSchema,
    }),
    HealthModule,
    MetricsModule,
  ],
})
export class CoreModule {}
