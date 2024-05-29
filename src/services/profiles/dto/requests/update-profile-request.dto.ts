import { User } from '../../../users/entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { CreateProfileRequest } from './create-profile-request.dto';

/**
 * Defines the DTO that carries data to update a bed.
 *
 * @usageNotes
 * This DTO extends the {@link CreateProfileRequest}.
 */
export class UpdateProfileRequest extends CreateProfileRequest {
  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Profile} entity
   */
  static toEntity(request: UpdateProfileRequest, requestedBy?: User): Profile {
    return new Profile({ ...request, updatedById: requestedBy?.id });
  }
}
