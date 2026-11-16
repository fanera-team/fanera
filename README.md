# Fanera

Monorepo на базе pnpm workspaces.

## Требования

- Node.js v22 (версия указана в `.nvmrc`)
- pnpm

## Запуск

```bash
pnpm install
pnpm --filter web dev
```

### Postgres и Redis

Нужен Docker (Docker Desktop или OrbStack). Из корня репозитория:

```bash
docker compose up -d                            # Postgres и Redis в фоне
docker compose ps                               # дождаться статуса healthy
cp apps/server/.env.example apps/server/.env
pnpm --filter server dev                        # http://localhost:3001/health
```

`/health` отвечает `200` и `"postgres": "up", "redis": "up"`, если всё подключено, и `503`, если что-то недоступно.

Остановить: `docker compose down`. Удалить вместе с данными: `docker compose down -v`.
Логин, пароль и порты по умолчанию — в `docker-compose.yml`; поменять их можно через корневой `.env` (см. `.env.example`).

Проверки по всем приложениям: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm format`.

## Структура

- `apps/web` — фронтенд: React + Vite (TypeScript, Tailwind)
- `apps/server` — API: NestJS 12 (ESM, Express, Zod, Vitest) — подробности в [apps/server/README.md](apps/server/README.md)
- `packages/*` — общий код фронта и бэка (пока пусто)
- `docs/system-design` — system design проекта: требования, архитектура (C4), API, модель данных, sequence-диаграммы, решения — начать с [docs/system-design/onboarding.md](docs/system-design/onboarding.md)
