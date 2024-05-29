import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../error-response.dto';

/**
 * Defines the DTO that carries data representing a conflict error response.
 *
 * @usageNotes
 * The DTO extends {@link ErrorResponse}.
 *
 * The ConflictErrorResponse contains error attribute:
 * - `statusCode`: The {@link HttpStatus} code
 */
export class ConflictErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'The http status code',
    example: HttpStatus.CONFLICT,
  })
  statusCode: HttpStatus;
}
