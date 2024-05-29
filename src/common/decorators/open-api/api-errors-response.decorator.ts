import { applyDecorators } from '@nestjs/common';
import {
  ApiErrorResponse,
  ApiErrorResponseMetadata,
} from './api-error-response.decorator';
import { ApiInternalServerErrorErrorResponse } from './errors/api-internal-server-error-response.decorator';

/**
 * Decorator that combines multiple {@link ApiErrorResponse} decorators to apply swagger error response(s),
 * to the scope of controller or method or route handler, depending on its context.
 *
 * @example
 * `ApiErrorsResponse()`
 *
 * @usageNotes
 * This decorator by default applies:
 * - `@ApiInternalServerErrorErrorResponse()` decorator
 *
 * @param metadata The array of api error response metadata
 *
 * @returns The method decorator & class decorator & property decorator.
 */
export const ApiErrorsResponse = (
  metadata?: ApiErrorResponseMetadata[],
): MethodDecorator & ClassDecorator & PropertyDecorator => {
  const decorators = [ApiInternalServerErrorErrorResponse()];

  if (metadata && metadata.length > 0) {
    metadata.map((data) => decorators.push(ApiErrorResponse(data)));
  }

  return applyDecorators(...decorators);
};
