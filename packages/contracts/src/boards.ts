import { z } from 'zod'
import { uuidSchema } from './identifiers.js'
import { paginatedSchema, paginationQuerySchema } from './pagination.js'
import { roleSchema } from './role.js'
import { userPublicSchema } from './users.js'

export const boardSummarySchema = z
  .object({
    id: uuidSchema,
    title: z.string(),
    owner: userPublicSchema,
    myRole: roleSchema,
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'BoardSummary' })

export type BoardSummary = z.infer<typeof boardSummarySchema>

export const boardSchema = boardSummarySchema
  .extend({
    workspaceId: uuidSchema,
    collab: z
      .object({
        url: z.string().meta({ example: 'wss://collab.fanera.app' }),
        namespace: z.string().meta({ example: '/collab' }),
      })
      .meta({ description: 'Куда подключаться по WebSocket за содержимым' }),
  })
  .meta({ id: 'Board' })

export type Board = z.infer<typeof boardSchema>

export const boardListSchema = paginatedSchema(boardSummarySchema)

export type BoardList = z.infer<typeof boardListSchema>

// Поиск, фильтры и сортировка каталога (q, filter, sort, ownerId) — отдельной задачей
export const listBoardsQuerySchema = paginationQuerySchema

export type ListBoardsQuery = z.infer<typeof listBoardsQuerySchema>

export const createBoardBodySchema = z.strictObject({
  title: z.string().trim().min(1).max(200),
})

export type CreateBoardBody = z.infer<typeof createBoardBodySchema>
