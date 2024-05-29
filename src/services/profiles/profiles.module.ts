import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UsersModule } from '../users/users.module';

/**
 * Defines the profiles module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersModule],
  providers: [ProfilesService],
  controllers: [],
  exports: [ProfilesService],
})
export class ProfilesModule {}
