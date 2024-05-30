import { DataSource } from 'typeorm';
import { subscriptionData } from '../data/subscription.data';
import { Subscription } from '../../services/subscriptions/entities/subscription.entity';
import { Seeder } from 'typeorm-extension';

/**
 * Defines {@link Subscription} entity seeder.
 */
export default class SubscriptionSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Subscription)
      .values([...subscriptionData])
      .orIgnore()
      .execute();
  }
}
