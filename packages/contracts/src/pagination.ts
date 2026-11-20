import { z } from 'zod'

/** Курсорная пагинация: `?limit=20&cursor=<opaque>` → `{ items, nextCursor }`. */
export const paginationQuerySchema = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional().meta({
    description: 'Непрозрачный курсор из nextCursor предыдущего ответа',
  }),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

/** Конверт любого списочного ответа REST. */
export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    nextCursor: z.string().nullable().meta({
      description: 'null — это последняя страница',
    }),
  })
}
