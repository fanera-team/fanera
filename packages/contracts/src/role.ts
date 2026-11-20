import { z } from 'zod'

/**
 * Роль в воркспейсе и на доске. Одна на REST, WebSocket и UI.
 * Имя схемы в Swagger — Role, как в rest_api.yml.
 */
export const roleSchema = z.enum(['owner', 'editor', 'viewer']).meta({ id: 'Role' })

export type Role = z.infer<typeof roleSchema>
