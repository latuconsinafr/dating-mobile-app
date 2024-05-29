import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserRequest } from '../../../users/dto/requests/create-user-request.dto';
import { CreateProfileRequest } from '../../../profiles/dto/requests/create-profile-request.dto';
import { Profile } from '../../../profiles/entities/profile.entity';
import { User } from '../../../users/entities/user.entity';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../../users/enums/user-role.enum';

/**
 * Defines the sign up profile request to sign up a user profile.
 *
 * @usageNotes
 * The SignUpProfileRequest extends {@link CreateProfileRequest} with omitted `id`.
 */
export class SignUpProfileRequest extends OmitType(CreateProfileRequest, [
  'id',
] as const) {
  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Profile} entity
   */
  static toEntity(request: SignUpProfileRequest, requestedBy?: User): Profile {
    return new Profile({
      ...request,
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}

/**
 * Defines the sign up request to sign up a user.
 *
 * @usageNotes
 * The SignUpProfileRequest extends {@link CreateUserRequest} with omitted `role` and also additional `profile` attribute.
 */
export class SignUpRequest extends OmitType(CreateUserRequest, [
  'role',
] as const) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SignUpProfileRequest)
  @ApiProperty({
    description: 'The user profile',
    type: SignUpProfileRequest,
  })
  profile: SignUpProfileRequest;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Profile} entity
   */
  static toEntity(request: SignUpRequest, requestedBy?: User): User {
    const { profile, ...user } = request;

    return new User({
      ...user,
      role: UserRole.User,
      profile: SignUpProfileRequest.toEntity(profile, requestedBy),
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}
