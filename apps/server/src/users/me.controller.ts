import { type Me, meSchema } from '@fanera/contracts';
import { Controller, Get, NotImplementedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAccessTokenAuth } from '../common/openapi/api-access-token-auth.decorator.js';
import { ApiErrors } from '../common/openapi/api-errors.decorator.js';

@ApiAccessTokenAuth()
@Controller('me')
export class MeController {
  @Get()
  @ApiOperation({ summary: 'Профиль текущего пользователя' })
  @ApiOkResponse({ description: 'ок', standardSchema: meSchema })
  @ApiErrors(501)
  getMe(): Me {
    throw new NotImplementedException();
  }
}
