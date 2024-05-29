import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { swipeData } from '../data/swipe.data';
import { Swipe } from '../../services/swipes/entities/swipe.entity';

/**
 * Defines {@link Swipe} entity seeder.
 */
export default class SwipeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Swipe)
      .values([...swipeData])
      .orIgnore()
      .execute();
  }
}
