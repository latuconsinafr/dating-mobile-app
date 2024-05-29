import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditTrailEntity } from '../../../common/entities/audit-trail.entity';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { Profile } from '../../profiles/entities/profile.entity';

/**
 * Defines the user entity.
 *
 * @usageNotes
 * The user entity contains attribute:
 * - `id`: The id of the user
 * - `username`: The username of the user
 * - `email`: The email of the user, if any
 * - `password`: The password of the user
 * - `role`: The role of the user
 * - `lastSignedInAt`: The last signed in timestamp of the user, if any
 * - `profile`: The profile of the user
 */
@Entity()
export class User extends AuditTrailEntity<User> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ enum: UserRole })
  role: UserRole;

  @Column('timestamp', { nullable: true })
  lastSignedInAt?: Date;

  @OneToOne(
    /* istanbul ignore next */ () => Profile,
    /* istanbul ignore next */ (profile: Profile) => profile.user,
    {
      cascade: true,
    },
  )
  profile: Profile;
}
