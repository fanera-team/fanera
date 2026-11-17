import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { PROBLEM_TYPE, problemSchema } from '@fanera/contracts';
import { test } from './fixtures/http-errors.fixture.js';

const PROBLEM_JSON = /application\/problem\+json/;

test.for([
  { name: 'Error', error: new Error('private database failure') },
  {
    name: 'ZodError внутренних данных',
    error: new ZodError([
      { code: 'custom', path: [], message: 'private data' },
    ]),
  },
  { name: 'объект', error: { statusCode: 403, message: 'private failure' } },
])('$name → безопасный 500 и запись в лог', async ({ error }, { http }) => {
  http.fail.mockRejectedValue(error);

  const res = await http.api
    .get('/api/errors/failure')
    .expect('Content-Type', PROBLEM_JSON)
    .expect(500);

  expect(res.body).toEqual({
    type: PROBLEM_TYPE,
    title: 'Internal Server Error',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  });
  expect(http.logError).toHaveBeenCalledOnce();
});

test('HttpException 5xx сохраняет статус, скрывает подробности и логируется', async ({
  http,
}) => {
  const error = new ServiceUnavailableException({
    message: 'private message',
    detail: 'private detail',
    code: 'PRIVATE_CODE',
    stack: 'private stack',
    cause: { message: 'private cause' },
    errors: [{ field: 'private', message: 'private' }],
  });
  http.fail.mockRejectedValue(error);

  const res = await http.api.get('/api/errors/failure').expect(503);

  expect(res.body).toEqual({
    type: PROBLEM_TYPE,
    title: 'Service Unavailable',
    status: 503,
    code: 'SERVICE_UNAVAILABLE',
  });
  expect(http.logError).toHaveBeenCalledWith(error);
});

test('4xx публикует только разрешённые поля и сохраняет HTTP-статус', async ({
  http,
}) => {
  http.fail.mockRejectedValue(
    new ForbiddenException({
      status: 200,
      title: 'private title',
      code: 'BOARD_READ_ONLY',
      detail: 'public detail',
      stack: 'private stack',
      cause: 'private cause',
      errors: [{ field: 'title', message: 'public message', input: 'private' }],
    }),
  );

  const res = await http.api.get('/api/errors/failure').expect(403);

  expect(res.body).toEqual({
    type: PROBLEM_TYPE,
    title: 'Forbidden',
    status: 403,
    code: 'BOARD_READ_ONLY',
    detail: 'public detail',
    errors: [{ field: 'title', message: 'public message' }],
  });
  expect(http.logError).not.toHaveBeenCalled();
});

test.for([
  {
    name: 'строковый message Nest',
    error: new NotFoundException('public not found'),
    expected: {
      status: 404,
      title: 'Not Found',
      code: 'NOT_FOUND',
      detail: 'public not found',
    },
  },
  {
    name: 'строковое тело и errorCode',
    error: new HttpException('public conflict', 409, {
      errorCode: 'BOARD_NOT_READY',
    }),
    expected: {
      status: 409,
      title: 'Conflict',
      code: 'BOARD_NOT_READY',
      detail: 'public conflict',
    },
  },
  {
    name: 'массив сообщений',
    error: new BadRequestException(['first', 'second']),
    expected: {
      status: 400,
      title: 'Bad Request',
      code: 'BAD_REQUEST',
      detail: 'first; second',
    },
  },
  {
    name: 'нестроковые значения в message',
    error: new BadRequestException({
      message: ['first', { stack: 'private' }],
    }),
    expected: { status: 400, title: 'Bad Request', code: 'BAD_REQUEST' },
  },
  {
    name: 'code из тела важнее errorCode конструктора',
    error: new HttpException(
      { code: 'FROM_BODY', message: 'public body error' },
      409,
      { errorCode: 'FROM_OPTIONS' },
    ),
    expected: {
      status: 409,
      title: 'Conflict',
      code: 'FROM_BODY',
      detail: 'public body error',
    },
  },
  {
    name: 'errorCode используется, когда в теле нет code',
    error: new HttpException({ message: 'public body error' }, 409, {
      errorCode: 'FROM_OPTIONS',
    }),
    expected: {
      status: 409,
      title: 'Conflict',
      code: 'FROM_OPTIONS',
      detail: 'public body error',
    },
  },
  {
    name: 'нестандартный статус',
    error: new HttpException('public custom error', 499),
    expected: {
      status: 499,
      title: 'Error',
      code: 'UNKNOWN',
      detail: 'public custom error',
    },
  },
])('$name → Problem', async ({ error, expected }, { http }) => {
  http.fail.mockRejectedValue(error);

  const res = await http.api
    .get('/api/errors/failure')
    .expect('Content-Type', PROBLEM_JSON)
    .expect(expected.status);

  expect(res.body).toEqual({ type: PROBLEM_TYPE, ...expected });
});

test('неизвестный маршрут тоже возвращает Problem', async ({ http }) => {
  const res = await http.api
    .get('/api/missing')
    .expect('Content-Type', PROBLEM_JSON)
    .expect(404);

  expect(res.body).toMatchObject({ status: 404, code: 'NOT_FOUND' });
  expect(res.body).not.toHaveProperty('stack');
  // Проверяем ответ схемой контракта, а не только отдельными полями.
  expect(problemSchema.safeParse(res.body).success).toBe(true);
});

const validId = '00000000-0000-4000-8000-000000000001';
const validBody = { members: [{ email: 'test@example.com' }] };
const validationPath = `/api/errors/validate/${validId}`;

test.for([
  {
    name: 'body: несколько вложенных полей',
    input: {
      body: { members: [{ email: 'invalid' }, { email: 'also-invalid' }] },
    },
    fields: ['members.0.email', 'members.1.email'],
  },
  { name: 'param: корневое значение', input: { id: 'invalid' }, fields: [''] },
  { name: 'query: параметр страницы', input: { page: '0' }, fields: ['page'] },
])('Zod $name → 422', async ({ input, fields }, { http }) => {
  const { id, page, body } = {
    id: validId,
    page: '2',
    body: validBody,
    ...input,
  };
  const res = await http.api
    .post(`/api/errors/validate/${id}`)
    .query({ page })
    .send(body)
    .expect('Content-Type', PROBLEM_JSON)
    .expect(422);

  expect(res.body).toEqual({
    type: PROBLEM_TYPE,
    title: 'Unprocessable Entity',
    status: 422,
    code: 'VALIDATION_ERROR',
    errors: fields.map((field) => ({ field, message: expect.any(String) })),
  });
});

test('невалидный JSON отклоняется с 400 до проверки Zod', async ({ http }) => {
  const res = await http.api
    .post(validationPath)
    .set('Content-Type', 'application/json')
    .send('{')
    .expect('Content-Type', PROBLEM_JSON)
    .expect(400);

  expect(res.body).toMatchObject({ status: 400, code: 'BAD_REQUEST' });
  expect(res.body).not.toHaveProperty('stack');
});

test('валидный запрос проходит, преобразования Zod сохраняются', async ({
  http,
}) => {
  const res = await http.api
    .post(validationPath)
    .query({ page: '2' })
    .send(validBody)
    .expect(201);

  expect(res.body).toEqual({ id: validId, ...validBody, page: 2 });
});
