import {
  StandardSchemaValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import type { Env } from './config/env.schema.js';

export function configureApp(app: INestApplication): void {
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  app.setGlobalPrefix('api', { exclude: ['health'] });

  // Безопасные HTTP-заголовки
  app.use(helmet());

  app.enableCors({
    // Массив, а не строка: со строкой cors отдаёт заголовок и чужим origin
    origin: [config.get('WEB_ORIGIN', { infer: true })],
    credentials: true,
  });

  // Валидация по Zod-схеме из @Body({ schema }) и т.п., иначе 400
  app.useGlobalPipes(new StandardSchemaValidationPipe());
}
