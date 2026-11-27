import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module.js';

/**
 * Роль collab: WebSocket-шлюз и работа с Yjs-документами в памяти (T2-06).
 * Пока подключает только ядро — /health и /metrics уже нужны балансировщику.
 */
@Module({
  imports: [CoreModule],
})
export class CollabModule {}
