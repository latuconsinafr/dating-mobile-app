import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionType } from '../enums/subscription-type.enum';
import { AuditTrailEntity } from '../../../common/entities/audit-trail.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Defines the subscription entity.
 *
 * @usageNotes
 * The subscription entity contains attribute:
 * - `id`: The id of the subscription
 * - `type`: The type of the subscription
 * - `startDate`: The start date of the subscription
 * - `endDate`: The end date of the subscription
 * - `userId`: The user id whos made the subscription
 * - `user`: The user whos made the subscription
 */
@Entity()
export class Subscription extends AuditTrailEntity<Subscription> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: SubscriptionType })
  type: SubscriptionType;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  userId: string;

  @ManyToOne(/* istanbul ignore next */ () => User)
  @JoinColumn()
  user: User;
}
