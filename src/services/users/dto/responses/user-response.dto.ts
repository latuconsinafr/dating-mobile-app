import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { AuditTrailResponse } from '../../../../common/dto/responses/audit-trail-response.dto';
import { userData } from '../../../../database/data/user.data';
import { UserIdParam } from '../params/user-id-param.dto';

/**
 * Defines the DTO that carries data representing a user.
 *
 * @usageNotes
 * The DTO intersect {@link UserIdParam} with {@link AuditTrailResponse}.
 *
 * The UserResponse also contains user attribute:
 * - `username`: The username of the user
 * - `email`: The email of the user, if any
 * - `role`: The role of the user
 * - `lastSignedInAt`: The last signed in timestamp of the user, if any
 */
export class UserResponse extends IntersectionType(
  UserIdParam,
  AuditTrailResponse,
) {
  @ApiProperty({
    description: 'The username of the user',
    example: userData[1].username,
  })
  username: string;

  @ApiPropertyOptional({
    description: 'The email of the user, if any',
    example: userData[1].email,
  })
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: userData[1].role,
  })
  role: string;

  @ApiPropertyOptional({
    description: 'The last signed in timestamp of the user, if any',
    example: userData[1].lastSignedInAt,
  })
  lastSignedInAt?: Date;
}
