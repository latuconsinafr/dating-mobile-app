import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AuditTrailEntity } from '../../../common/entities/audit-trail.entity';
import { User } from '../../users/entities/user.entity';
import { SubscriptionType } from '../../subscriptions/enums/subscription-type.enum';

/**
 * Defines the profile entity.
 *
 * @usageNotes
 * The profile entity contains attribute:
 * - `id`: The id of the profile, as the same as the id of user
 * - `name`: The name of the profile
 * - `age`: The age of the profile
 * - `location`: The location of the profile
 * - `aboutMe`: The about me of the profile, if any
 * - `isCurrentlyVerified`: The flag indicates whether the profile has been verified or not
 * - `user`: The profile user
 */
@Entity()
export class Profile extends AuditTrailEntity<Profile> {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  location: string;

  @Column('text', { nullable: true })
  aboutMe?: string;

  isCurrentlyVerified?(): boolean {
    const now = new Date();

    return (
      this.user?.subscriptions?.some(
        (subscription) =>
          subscription.type === SubscriptionType.VerifiedBadge &&
          subscription.startDate <= now &&
          subscription.endDate >= now,
      ) ?? false
    );
  }

  @OneToOne(
    /* istanbul ignore next */ () => User,
    /* istanbul ignore next */ (user: User) => user.profile,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id' })
  user: User;
}
