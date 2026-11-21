import {
  authResponseSchema,
  loginBodySchema,
  registerBodySchema,
  type AuthResponse,
  type LoginBody,
  type RegisterBody,
} from '@fanera/contracts';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiErrors } from '../common/openapi/api-errors.decorator.js';
import { REFRESH_COOKIE_AUTH } from '../common/openapi/security.js';

const REFRESH_COOKIE_RESPONSE_HEADERS = {
  'Set-Cookie': {
    description: 'rt=<refresh>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth',
    schema: { type: 'string' },
  },
} as const;

@Controller('auth')
export class AuthController {
  @Post('register')
  @ApiOperation({
    summary: 'Регистрация по email и паролю',
    description: 'Сразу логинит: access-токен в теле, refresh — в cookie.',
  })
  @ApiCreatedResponse({
    description: 'Создан и сразу залогинен',
    standardSchema: authResponseSchema,
    headers: REFRESH_COOKIE_RESPONSE_HEADERS,
  })
  @ApiErrors(400, 409, 422, 501)
  register(
    @Body({ schema: registerBodySchema }) _body: RegisterBody,
  ): AuthResponse {
    throw new NotImplementedException();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход по email и паролю' })
  @ApiOkResponse({
    description: 'OK',
    standardSchema: authResponseSchema,
    headers: REFRESH_COOKIE_RESPONSE_HEADERS,
  })
  @ApiErrors(400, 401, 422, 429, 501)
  login(@Body({ schema: loginBodySchema }) _body: LoginBody): AuthResponse {
    throw new NotImplementedException();
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity(REFRESH_COOKIE_AUTH)
  @ApiOperation({
    summary: 'Новый access-токен по refresh-cookie',
    description:
      'Тела нет, refresh-токен берётся из cookie `rt`. До вехи 3 без ротации refresh (Р-60).',
  })
  @ApiOkResponse({
    description: 'OK',
    standardSchema: authResponseSchema,
    headers: REFRESH_COOKIE_RESPONSE_HEADERS,
  })
  @ApiErrors(401, 501)
  refresh(): AuthResponse {
    throw new NotImplementedException();
  }
}
