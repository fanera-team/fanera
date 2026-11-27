import { WorkerModule } from './app/worker.module.js';
import { startRole } from './bootstrap.js';

// Роль worker: фоновые задачи (BullMQ). HTTP нужен только для /health
// и /metrics: без него процесс нечем проверить, а docker healthcheck
// считал бы контейнер мёртвым.
await startRole(WorkerModule, { port: 'WORKER_PORT' });
