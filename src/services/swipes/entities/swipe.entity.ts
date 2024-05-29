import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditTrailEntity } from '../../../common/entities/audit-trail.entity';
import { SwipeType } from '../enums/swipe-type.enum';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profiles/entities/profile.entity';

/**
 * Defines the swipe entity.
 *
 * @usageNotes
 * The swipe entity contains attribute:
 * - `id`: The id of the swipe
 * - `type`: The type of the swipe
 * - `userId`: The user id who swipe
 * - `profileId`: The profile id who's swiped
 * - `user`: The user who swipe
 * - `profile`: The profile who's swiped
 */
@Entity()
export class Swipe extends AuditTrailEntity<Swipe> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: SwipeType })
  type: SwipeType;

  @Column()
  userId: string;

  @Column()
  profileId: string;

  @ManyToOne(/* istanbul ignore next */ () => User)
  @JoinColumn()
  user: User;

  @ManyToOne(/* istanbul ignore next */ () => Profile)
  @JoinColumn()
  profile: Profile;
}
