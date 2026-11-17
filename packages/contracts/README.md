# @fanera/contracts

Общие схемы и типы REST для фронтенда и бэкенда. Первый контракт — ошибки
Problem Details из [OpenAPI](../../docs/system-design/api/rest_api.yml).

Публичный API находится в `src/index.ts`: `problemSchema`, `fieldErrorSchema`,
`PROBLEM_TYPE`, `PROBLEM_CONTENT_TYPE` и выведенные из схем типы `Problem`,
`FieldError`. Импортируем через `@fanera/contracts`. Типы не дублируют схемы:
они получаются через `z.infer`, поэтому меняем контракт только в схеме.
Сервер уже использует пакет; фронтенд подключит его через `workspace:*`,
когда появится обработка ошибок API. Это начало T1-09, схемы auth ещё не добавлены.

В пакете нет NestJS, React и доступа к окружению. `envSchema` остаётся на сервере,
как и фильтр ошибок с пайпом валидации.

## Разработка

`pnpm install` собирает пакет через `prepare`. Экспортируются JavaScript ESM
и декларации типов из `dist`, поэтому пакет работает в Node без загрузчика TypeScript.
`dist` не коммитим.

- `pnpm --filter @fanera/contracts build` — пересобрать после изменений.
- `pnpm --filter @fanera/contracts dev` — наблюдать за изменениями.
- `pnpm --filter @fanera/contracts typecheck` — проверить типы.

Корневой `pnpm dev`, `pnpm dev:web` и `pnpm dev:server` включают наблюдение за
контрактами. После пересборки `dist` сервер нужно перезапустить: `nest start --watch`
не следит за `node_modules`. Тесты и приложения читают собранный `dist`, поэтому
после правки контракта перед `pnpm test` нужен `pnpm --filter @fanera/contracts build`
(в CI это делает `prepare` при установке). Корневой `pnpm build` собирает зависимости
перед приложениями.

Изменения общего контракта затрагивают и фронт, и бэк: сначала согласуем
OpenAPI по Р-47. Формат ответа при переносе в этот пакет сохранён.
