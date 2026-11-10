# Fanera

Монорепозиторий проекта Fanera.

## Требования

- Node.js 22 — см. `.nvmrc`
- pnpm 12.x

## Установка

```bash
pnpm install
```

## Запуск

```bash
pnpm --filter web dev
```

Приложение откроется на http://localhost:3000

## Структура

- `apps/web` — Next.js приложение (TypeScript, App Router, Tailwind)
- `packages/*` — общие библиотеки (пока пусто)