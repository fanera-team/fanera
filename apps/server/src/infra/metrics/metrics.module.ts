import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller.js';
import { MetricsService } from './metrics.service.js';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
  // Когда появится настоящий реестр (T3-05), счётчики фич должны попадать
  // в тот же экземпляр сервиса, поэтому экспорт нужен уже сейчас
  exports: [MetricsService],
})
export class MetricsModule {}
