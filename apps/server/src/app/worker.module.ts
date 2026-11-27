import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module.js';

/**
 * Роль worker: процессоры очередей (BullMQ). Пока подключает только ядро.
 * Появится здесь: processors для ИИ, картинок, компакции и уведомлений.
 */
@Module({
  imports: [CoreModule],
})
export class WorkerModule {}
