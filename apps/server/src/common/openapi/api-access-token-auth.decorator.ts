import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrors } from './api-errors.decorator.js';
import { BEARER_AUTH } from './security.js';

/** Описывает access-токен и ошибку 401 в Swagger. Проверку токена выполняет guard. */
export function ApiAccessTokenAuth() {
  return applyDecorators(ApiBearerAuth(BEARER_AUTH), ApiErrors(401));
}
