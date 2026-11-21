// Auth
export {
  authResponseSchema,
  loginBodySchema,
  registerBodySchema,
  type AuthResponse,
  type LoginBody,
  type RegisterBody,
} from './auth.js'

// Boards
export {
  boardListSchema,
  boardSchema,
  boardSummarySchema,
  createBoardBodySchema,
  listBoardsQuerySchema,
  type Board,
  type BoardList,
  type BoardSummary,
  type CreateBoardBody,
  type ListBoardsQuery,
} from './boards.js'

// Identifiers
export { uuidSchema } from './identifiers.js'

// Pagination
export { paginatedSchema, paginationQuerySchema, type PaginationQuery } from './pagination.js'

// Problem
export {
  fieldErrorSchema,
  PROBLEM_CONTENT_TYPE,
  PROBLEM_TYPE,
  problemSchema,
  type FieldError,
  type Problem,
} from './problem.js'

// Role
export { roleSchema, type Role } from './role.js'

// Users
export { meSchema, userPublicSchema, type Me, type UserPublic } from './users.js'

// Workspaces
export {
  workspaceListSchema,
  workspaceSchema,
  type Workspace,
  type WorkspaceList,
} from './workspaces.js'
