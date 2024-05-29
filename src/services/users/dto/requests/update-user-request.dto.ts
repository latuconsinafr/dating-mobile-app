import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
} from '@nestjs/swagger';
import { CreateUserRequest } from './create-user-request.dto';
import { User } from '../../entities/user.entity';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { IsUserEmailUnique } from '../../validators/is-user-email-unique.validator';
import { IsUserUsernameUnique } from '../../validators/is-user-username-unique.validator';
import { userData } from '../../../../database/data/user.data';
import { UserIdParam } from '../params/user-id-param.dto';

/**
 * Defines the DTO that carries data to update a user.
 *
 * @usageNotes
 * This DTO intersect {@link UserIdParam} with {@link CreateUserRequest} with omitted `password`.
 */
export class UpdateUserRequest extends IntersectionType(
  UserIdParam,
  OmitType(CreateUserRequest, ['password'] as const),
) {
  @IsNotEmpty()
  @IsString()
  @IsUserUsernameUnique('id')
  @ApiProperty({
    description: 'The username of the user',
    example: userData[0].username,
  })
  username: string;

  @IsOptional()
  @IsEmail()
  @IsUserEmailUnique('id')
  @ApiPropertyOptional({
    description: 'The email of the user, if any',
    example: null,
  })
  email?: string;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link User} entity
   */
  static toEntity(request: UpdateUserRequest, requestedBy?: User): User {
    return new User({ ...request, updatedById: requestedBy?.id });
  }
}
