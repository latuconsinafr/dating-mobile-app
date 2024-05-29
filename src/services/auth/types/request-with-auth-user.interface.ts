import { User } from '../../users/entities/user.entity';

/**
 * Defines the request with authenticated user interface.
 */
export interface RequestWithAuthUser extends Request {
  user: User;
}
