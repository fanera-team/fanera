import {
  Injectable,
  StandardSchemaValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { FieldError } from '@fanera/contracts';

/** Ошибки входных данных — 422 с путями полей по REST-контракту. */
@Injectable()
export class ProblemValidationPipe extends StandardSchemaValidationPipe {
  constructor() {
    super({
      // Стандартный pipe склеивает путь с сообщением; сохраняем их раздельно.
      exceptionFactory: (issues) =>
        new UnprocessableEntityException({
          code: 'VALIDATION_ERROR',
          errors: issues.map((issue): FieldError => ({
            field:
              issue.path
                ?.map((segment) =>
                  String(typeof segment === 'object' ? segment.key : segment),
                )
                .join('.') ?? '',
            message: issue.message,
          })),
        }),
    });
  }
}
