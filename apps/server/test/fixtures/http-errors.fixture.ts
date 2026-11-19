import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  type INestApplication,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { test as base, vi } from 'vitest';
import { z } from 'zod';
import { envSchema } from '../../src/config/env.schema.js';
import { configureApp } from '../../src/configure-app.js';

const ERROR_HANDLER = Symbol('ERROR_HANDLER');
const bodySchema = z.object({
  members: z.array(z.object({ email: z.email() })),
});
const querySchema = z.object({ page: z.coerce.number().int().positive() });

// Контроллер существует только в тестовом приложении.
@Controller('errors')
class ErrorsController {
  constructor(
    @Inject(ERROR_HANDLER) private readonly handler: () => Promise<unknown>,
  ) {}

  @Get('failure')
  fail() {
    return this.handler();
  }

  @Post('validate/:id')
  validate(
    @Param('id', { schema: z.uuid() }) id: string,
    @Body({ schema: bodySchema }) body: z.infer<typeof bodySchema>,
    @Query({ schema: querySchema }) query: z.infer<typeof querySchema>,
  ) {
    return { id, ...body, ...query };
  }
}

export const test = base.extend('http', async ({ onTestFinished }) => {
  const fail = vi.fn<() => Promise<unknown>>();
  const logError = vi
    .spyOn(Logger.prototype, 'error')
    .mockImplementation(() => {});
  onTestFinished(() => logError.mockRestore());

  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    ],
    controllers: [ErrorsController],
    providers: [{ provide: ERROR_HANDLER, useValue: fail }],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  onTestFinished(() => app.close());
  configureApp(app);
  await app.init();

  return { api: request(app.getHttpServer()), fail, logError };
});
