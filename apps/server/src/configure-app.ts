import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import type { Env } from './config/env.schema.js';
import { HttpProblemFilter } from './common/filters/http-problem.filter.js';
import { setupSwagger } from './common/openapi/setup-swagger.js';
import { ProblemValidationPipe } from './common/pipes/problem-validation.pipe.js';

export function configureApp(app: INestApplication): void {
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  // health и metrics живут вне /api: их дёргают docker healthcheck и Prometheus
  app.setGlobalPrefix('api', { exclude: ['health', 'metrics'] });

  // Безопасные HTTP-заголовки
  app.use(helmet());

  app.enableCors({
    // Массив, а не строка: со строкой cors отдаёт заголовок и чужим origin
    origin: [config.get('WEB_ORIGIN', { infer: true })],
    credentials: true,
  });

  // Ошибки HTTP-запросов → Problem Details; подробности 5xx — только в логах.
  app.useGlobalFilters(new HttpProblemFilter());

  // Zod-схемы из @Body/@Param/@Query; ошибки валидации → 422 с путями полей.
  app.useGlobalPipes(new ProblemValidationPipe());

  // Контракт API: UI на /api/docs, JSON на /api/docs/openapi.json
  setupSwagger(app);
}
