import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Env } from '../../config/env.schema.js';
import { errorMessage } from '../error-message.js';

/**
 * Пул соединений с Postgres. Пока нужен только для проверки в /health;
 * доступ к данным появится вместе с ORM (#32).
 */
@Injectable()
export class PostgresService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(PostgresService.name);
  private readonly pool: Pool;

  constructor(config: ConfigService<Env, true>) {
    this.pool = new Pool({
      connectionString: config.get('DATABASE_URL', { infer: true }),
      // Без таймаута запрос к недоступной базе ждёт очень долго
      connectionTimeoutMillis: 2000,
    });

    // Без обработчика обрыв простаивающего соединения (например, рестарт
    // Postgres) — необработанное событие 'error', и процесс падает
    this.pool.on('error', (err) => {
      this.logger.warn(
        `Соединение с Postgres оборвалось: ${errorMessage(err)}`,
      );
    });
  }

  async onModuleInit(): Promise<void> {
    // Сервер стартует и без базы: статус покажет /health
    try {
      await this.ping();
      this.logger.log('Подключено к Postgres');
    } catch (err) {
      this.logger.warn(`Postgres недоступен: ${errorMessage(err)}`);
    }
  }

  async ping(): Promise<void> {
    await this.pool.query('SELECT 1');
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
