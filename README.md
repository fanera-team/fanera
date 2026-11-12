# Fanera

Монорепозиторий проекта Fanera.

## Требования

- Node.js 22 — см. `.nvmrc`
- pnpm 12.x

## Установка

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
```

## Запуск

```bash
pnpm dev          # оба приложения сразу
pnpm dev:web      # только Next.js, http://localhost:3000
pnpm dev:server   # только NestJS API, http://localhost:3001/api
```

Проверки по всем приложениям: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm format`.

## Структура

- `apps/web` — фронтенд: Next.js (TypeScript, App Router, Tailwind)
- `apps/server` — API: NestJS 12 (ESM, Express, Zod, Vitest) — подробности в [apps/server/README.md](apps/server/README.md)
- `packages/*` — общий код фронта и бэка (пока пусто)
- `docs/system-design` — system design проекта: требования, архитектура (C4), API, модель данных, sequence-диаграммы, решения — начать с [docs/system-design/onboarding.md](docs/system-design/onboarding.md)
