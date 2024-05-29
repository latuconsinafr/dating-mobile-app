import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../error-response.dto';

/**
 * Defines the DTO that carries data representing an unauthorized error response.
 *
 * @usageNotes
 * The DTO extends {@link ErrorResponse}.
 *
 * The UnauthorizedErrorResponse contains error attribute:
 * - `statusCode`: The {@link HttpStatus} code
 */
export class UnauthorizedErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'The http status code',
    example: HttpStatus.UNAUTHORIZED,
  })
  statusCode: HttpStatus;
}
