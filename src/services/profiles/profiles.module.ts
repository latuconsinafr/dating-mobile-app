import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UsersModule } from '../users/users.module';
import { Swipe } from '../swipes/entities/swipe.entity';
import { ProfilesController } from './profiles.controller';
import { Subscription } from '../subscriptions/entities/subscription.entity';

/**
 * Defines the profiles module.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Swipe, Subscription]),
    UsersModule,
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
