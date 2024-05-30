import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SwipesModule } from './swipes/swipes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

/**
 * Defines the application services module.
 *
 * @usageNotes
 * This services module contains module as follow:
 * - {@link AuthModule}: The module that responsible for authentication operations
 * - {@link UsersModule}: The module that responsible for user-related operations
 * - {@link ProfilesModule}: The module that responsible for profile-related operations
 * - {@link SwipesModule}: The module that responsible for swipe-related operations
 * - {@link SubscriptionsModule}: The module that responsible for subscription-related operations
 */
@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    SwipesModule,
    SubscriptionsModule,
  ],
})
export class ServicesModule {}
