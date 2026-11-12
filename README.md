# Fanera

Monorepo на базе pnpm workspaces.

## Структура

- `apps/web` — клиентское приложение (React + Vite + TypeScript + Tailwind CSS)
- `apps/server` — серверное приложение
- `packages/*` — общие пакеты

## Требования

- Node.js v22 (версия указана в `.nvmrc`)
- pnpm

## Запуск

```bash
pnpm install
pnpm --filter web dev
```
