import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../services/users/entities/user.entity';
import { userData } from '../data/user.data';

/**
 * Defines {@link User} entity seeder.
 */
export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([...userData])
      .orIgnore()
      .execute();
  }
}
