import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import type { Env } from '../../config/env.schema.js';
import { errorMessage } from '../error-message.js';

/** Соединение с Redis. Пока нужно только для проверки в /health. */
@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  // Чтобы не писать одну и ту же ошибку на каждую попытку переподключения
  private isDownLogged = false;

  constructor(config: ConfigService<Env, true>) {
    this.client = new Redis(config.get('REDIS_URL', { infer: true }), {
      // Подключаемся в onModuleInit, а не в конструкторе
      lazyConnect: true,
      connectTimeout: 2000,
      // Пока Redis недоступен, команды сразу падают, а не копятся в очереди
      // до переподключения — иначе /health ждал бы ответа бесконечно
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    });

    this.client.on('ready', () => {
      this.isDownLogged = false;
      this.logger.log('Подключено к Redis');
    });

    // ioredis сам переподключается; без обработчика 'error' процесс упадёт
    this.client.on('error', (err) => {
      if (this.isDownLogged) return;
      this.isDownLogged = true;
      this.logger.warn(`Redis недоступен: ${errorMessage(err)}`);
    });
  }

  async onModuleInit(): Promise<void> {
    // Сервер стартует и без Redis: статус покажет /health, а ioredis
    // продолжит переподключаться. Ошибку уже залогировал обработчик 'error'
    await this.client.connect().catch(() => undefined);
  }

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit();
    } else {
      this.client.disconnect();
    }
  }
}
