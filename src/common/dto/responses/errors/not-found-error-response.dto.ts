import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../error-response.dto';

/**
 * Defines the DTO that carries data representing a not found error response.
 *
 * @usageNotes
 * The DTO extends {@link ErrorResponse}.
 *
 * The NotFoundErrorResponse contains error attribute:
 * - `statusCode`: The {@link HttpStatus} code
 */
export class NotFoundErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'The http status code',
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: HttpStatus;
}
