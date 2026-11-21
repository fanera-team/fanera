import { z } from 'zod'

/** URI типа ошибки: about:blank — «ошибка по HTTP-коду» (RFC 9457). */
export const PROBLEM_TYPE = 'about:blank'

/** Media type тела ошибки — RFC 9457. */
export const PROBLEM_CONTENT_TYPE = 'application/problem+json'

/** Ошибка поля: путь через точку, включая индексы массивов. */
export const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

/** Тело ошибки по RFC 9457 — схема Problem в docs/system-design/api/rest_api.yml. */
export const problemSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.int().min(100).max(599),
  code: z.string(),
  detail: z.string().optional(),
  errors: z.array(fieldErrorSchema).optional(),
})

// Типы — проекции схем, чтобы контракт не расходился сам с собой.
export type FieldError = z.infer<typeof fieldErrorSchema>
export type Problem = z.infer<typeof problemSchema>
