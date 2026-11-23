import { workspaceListSchema, type WorkspaceList } from '@fanera/contracts';
import { Controller, Get, NotImplementedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAccessTokenAuth } from '../common/openapi/api-access-token-auth.decorator.js';
import { ApiErrors } from '../common/openapi/api-errors.decorator.js';

@ApiAccessTokenAuth()
@Controller('workspaces')
export class WorkspacesController {
  @Get()
  @ApiOperation({
    summary: 'Список workspaces',
    description:
      'Возвращает рабочие пространства текущего пользователя и его роль в каждом из них.',
  })
  @ApiOkResponse({ description: 'ок', standardSchema: workspaceListSchema })
  @ApiErrors(501)
  list(): WorkspaceList {
    throw new NotImplementedException();
  }
}
