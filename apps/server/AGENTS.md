# AGENTS.md — apps/server

Версия NestJS скорее всего новее, чем ты знаешь. Сверяйся с документацией, а не с памятью: https://docs.nestjs.com/llms.txt (по markdown-странице на главу).

## Правила

- **Тесты:** `pnpm test` не запускает e2e — перед «готово» прогоняй ещё `pnpm test:e2e`.
- **Глобальные настройки приложения** (middleware, пайпы, CORS...) добавлять в `src/configure-app.ts`, а не в `main.ts` — его же используют e2e-тесты.
- **Окружение:** новая переменная → `src/config/env.schema.ts` и `.env.example`. Читать через `ConfigService<Env, true>` и `config.get('NAME', { infer: true })`, не через `process.env`.
- **Валидация:** только Zod через `@Body({ schema })`, `@Param('id', { schema })`, `@Query({ schema })`; тип DTO — `z.infer`. Не `class-validator`.
- **ESM:** `import.meta.dirname` вместо `__dirname` — `tsc` это не ловит, а в рантайме будет `ReferenceError`. Примеры из интернета обычно под CJS/Jest — адаптируй.
- **DI:** внедряемые через конструктор классы импортировать обычным `import`, не `import type` — иначе пропадут метаданные и DI сломается.
- **Ошибки:** для ожидаемых ситуаций — исключения Nest (`NotFoundException`...), не `new Error()`: иначе клиент получит 500.

## Зависимости

Только после согласования с пользователем. Прежде чем предлагать стороннюю библиотеку, проверь официальные пакеты Nest. Многие из них ещё в версиях 0.x (`@nestjs/drizzle`, `@nestjs/authentication`, `@nestjs/authorization`, `@nestjs/mail`, `@nestjs/storage`, `@nestjs/ai` и др.) — предлагая такой пакет, прямо скажи, что он 0.x и API может меняться.

Не менять без согласования: HTTP-адаптер (Express), тестовый раннер, систему модулей, конфиги линтера и Prettier.
