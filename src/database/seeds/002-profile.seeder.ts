import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Profile } from '../../services/profiles/entities/profile.entity';
import { profileData } from '../data/profile.data';

/**
 * Defines {@link Profile} entity seeder.
 */
export default class ProfileSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Profile)
      .values([...profileData])
      .orIgnore()
      .execute();
  }
}
