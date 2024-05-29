import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../error-response.dto';

/**
 * Defines the DTO that carries data representing an internal server error response.
 *
 * @usageNotes
 * The DTO extends {@link ErrorResponse}.
 *
 * The InternalServerErrorErrorResponse contains error attribute:
 * - `statusCode`: The {@link HttpStatus} code
 */
export class InternalServerErrorErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'The http status code',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: HttpStatus;
}
