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

Проверки по всем приложениям: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm format`.

## Структура

- `apps/web` — фронтенд: React + Vite (TypeScript, Tailwind)
- `apps/server` — API: NestJS 12 (ESM, Express, Zod, Vitest) — подробности в [apps/server/README.md](apps/server/README.md)
- `packages/*` — общий код фронта и бэка (пока пусто)
- `docs/system-design` — system design проекта: требования, архитектура (C4), API, модель данных, sequence-диаграммы, решения — начать с [docs/system-design/onboarding.md](docs/system-design/onboarding.md)
