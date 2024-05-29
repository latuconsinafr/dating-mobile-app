import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../error-response.dto';

/**
 * Defines the DTO that carries data representing an unprocessable entity error response.
 *
 * @usageNotes
 * The DTO extends {@link ErrorResponse}.
 *
 * The UnprocessableEntityErrorResponse contains error attribute:
 * - `statusCode`: The {@link HttpStatus} code
 */
export class UnprocessableEntityErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'The http status code',
    example: HttpStatus.UNPROCESSABLE_ENTITY,
  })
  statusCode: HttpStatus;
}
