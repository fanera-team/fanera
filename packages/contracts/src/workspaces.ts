import { z } from 'zod'
import { uuidSchema } from './identifiers.js'
import { roleSchema } from './role.js'

export const workspaceSchema = z
  .object({
    id: uuidSchema,
    name: z.string(),
    myRole: roleSchema,
    createdAt: z.iso.datetime(),
  })
  .meta({ id: 'Workspace' })

export type Workspace = z.infer<typeof workspaceSchema>

export const workspaceListSchema = z.object({
  items: z.array(workspaceSchema),
})

export type WorkspaceList = z.infer<typeof workspaceListSchema>
