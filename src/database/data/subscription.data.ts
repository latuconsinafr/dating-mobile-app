import { Subscription } from '../../services/subscriptions/entities/subscription.entity';
import { SubscriptionType } from '../../services/subscriptions/enums/subscription-type.enum';

/**
 * Dummy data for {@link Subscription} entity.
 */
export const subscriptionData = [
  new Subscription({
    id: 'eb1a4716-a847-4f86-9e3a-b7fdd4fc7463',
    type: SubscriptionType.UnlimitedSwipe,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-01'),
    userId: 'd3e60d85-b9b9-4fa8-a48c-040b368ff179',
  }),
  new Subscription({
    id: 'fb2d2b95-4273-4792-b78a-76d27e1450a4',
    type: SubscriptionType.VerifiedBadge,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-01'),
    userId: 'fbf69ccf-4780-4eea-951e-b75c65ddf75a',
  }),
] as const; // * Make it tuple to allow checked indexes {@see https://www.youtube.com/watch?v=nNse0r0aRT8&t=957s}
