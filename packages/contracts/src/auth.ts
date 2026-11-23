import { z } from 'zod'
import { userPublicSchema } from './users.js'

export const registerBodySchema = z.strictObject({
  email: z.email(),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(100),
})

export type RegisterBody = z.infer<typeof registerBodySchema>

export const loginBodySchema = z.strictObject({
  email: z.email(),
  // Проверяем только непустое значение: правила регистрации могли поменяться
  password: z.string().min(1),
})

export type LoginBody = z.infer<typeof loginBodySchema>

export const authResponseSchema = z
  .object({
    accessToken: z.string(),
    expiresIn: z.int().meta({
      description: 'Через сколько секунд истечёт access-токен',
      example: 900,
    }),
    user: userPublicSchema,
  })
  .meta({ id: 'AuthResponse' })

export type AuthResponse = z.infer<typeof authResponseSchema>
