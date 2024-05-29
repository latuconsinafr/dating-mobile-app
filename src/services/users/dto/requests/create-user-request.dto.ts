import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../entities/user.entity';
import { IsUserUsernameUnique } from '../../validators/is-user-username-unique.validator';
import { IsUserEmailUnique } from '../../validators/is-user-email-unique.validator';
import { UserRole } from '../../enums/user-role.enum';
import { userData } from '../../../../database/data/user.data';

/**
 * Defines the DTO that carries data to create a user.
 *
 * @usageNotes
 * The CreateUserRequest contains user attribute:
 * - `username`: The username of the user
 * - `email`: The email of the user, if any
 * - `password`: The password of the user
 * - `lastSignedInAt`: The last signed in timestamp of the user, if any
 * - `role`: The role of the user
 */
export class CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  @IsUserUsernameUnique()
  @ApiProperty({
    description: 'The username of the user',
    example: userData[0].username,
  })
  username: string;

  @IsOptional()
  @IsEmail()
  @IsUserEmailUnique()
  @ApiPropertyOptional({
    description: 'The email of the user, if any',
    example: null,
  })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional({
    description: 'The last signed in timestamp of the user, if any',
    example: userData[0].lastSignedInAt,
  })
  lastSignedInAt?: Date;

  @IsNotEmpty()
  @IsEnum(UserRole)
  @ApiProperty({
    enum: UserRole,
    description: 'The role id of the user',
    example: userData[0].role,
  })
  role: UserRole;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link User} entity
   */
  static toEntity(request: CreateUserRequest, requestedBy?: User): User {
    return new User({
      ...request,
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}
