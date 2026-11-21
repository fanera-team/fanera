import {
  boardListSchema,
  boardSchema,
  createBoardBodySchema,
  listBoardsQuerySchema,
  uuidSchema,
  type Board,
  type BoardList,
  type CreateBoardBody,
  type ListBoardsQuery,
} from '@fanera/contracts';
import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiAccessTokenAuth } from '../common/openapi/api-access-token-auth.decorator.js';
import { ApiErrors } from '../common/openapi/api-errors.decorator.js';
import { IDEMPOTENCY_KEY_HEADER } from '../common/openapi/headers.js';

@ApiAccessTokenAuth()
@Controller()
export class BoardsController {
  @Get('workspaces/:workspaceId/boards')
  @ApiOperation({ summary: 'Список досок рабочего пространства' })
  @ApiOkResponse({ description: 'ок', standardSchema: boardListSchema })
  @ApiErrors(404, 422, 501)
  list(
    @Param('workspaceId', { schema: uuidSchema }) _workspaceId: string,
    @Query({ schema: listBoardsQuerySchema }) _query: ListBoardsQuery,
  ): BoardList {
    throw new NotImplementedException();
  }

  @Post('workspaces/:workspaceId/boards')
  @ApiOperation({ summary: 'Создать доску' })
  @ApiHeader(IDEMPOTENCY_KEY_HEADER)
  @ApiCreatedResponse({ description: 'Создано', standardSchema: boardSchema })
  @ApiErrors(400, 403, 404, 422, 501)
  create(
    @Param('workspaceId', { schema: uuidSchema }) _workspaceId: string,
    @Body({ schema: createBoardBodySchema }) _body: CreateBoardBody,
  ): Board {
    throw new NotImplementedException();
  }

  @Get('boards/:boardId')
  @ApiOperation({
    summary: 'Получить доску по id',
    description:
      'Только основная информация. Содержимое приходит по WebSocket.',
  })
  @ApiOkResponse({ description: 'OK', standardSchema: boardSchema })
  @ApiErrors(404, 422, 501)
  get(@Param('boardId', { schema: uuidSchema }) _boardId: string): Board {
    throw new NotImplementedException();
  }
}
