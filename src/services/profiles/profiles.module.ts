import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UsersModule } from '../users/users.module';
import { Swipe } from '../swipes/entities/swipe.entity';
import { ProfilesController } from './profiles.controller';

/**
 * Defines the profiles module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Profile, Swipe]), UsersModule],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
