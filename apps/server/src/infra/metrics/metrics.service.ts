import { Injectable } from '@nestjs/common';

/**
 * Заглушка: эндпоинт `/metrics` уже есть у всех трёх ролей, но серий пока нет.
 *
 * Тело — корректный формат экспозиции Prometheus: строка с `#` это комментарий,
 * поэтому скрейп не падает, а в targets просто пусто. Настоящий реестр
 * (prom-client, collectDefaultMetrics, RED-метрики) появится в T3-05 —
 * тогда меняется только этот сервис, контроллер и адрес остаются прежними.
 */
@Injectable()
export class MetricsService {
  scrape(): string {
    return '# metrics are not collected yet: prom-client comes with T3-05\n';
  }
}
