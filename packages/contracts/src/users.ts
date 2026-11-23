import { z } from 'zod'
import { uuidSchema } from './identifiers.js'

/** Публичные данные пользователя. Если аватарки нет, avatarUrl равен null. */
export const userPublicSchema = z
  .object({
    id: uuidSchema,
    name: z.string(),
    avatarUrl: z.url().nullable(),
  })
  .meta({ id: 'UserPublic' })

export type UserPublic = z.infer<typeof userPublicSchema>

/** Профиль текущего пользователя — ответ GET /me. */
export const meSchema = userPublicSchema
  .extend({
    email: z.email(),
  })
  .meta({ id: 'Me' })

export type Me = z.infer<typeof meSchema>
