import { CollabModule } from './app/collab.module.js';
import { startRole } from './bootstrap.js';

// Роль collab: WebSocket-шлюз (T2-06). HTTP нужен только для /health
// и /metrics: по ним балансировщик и Prometheus видят, что процесс жив.
await startRole(CollabModule, { port: 'COLLAB_PORT' });
