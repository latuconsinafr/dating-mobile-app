import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { IsUserExistValidator } from './validators/is-user-exist.validator';
import { IsUserUsernameUniqueValidator } from './validators/is-user-username-unique.validator';
import { IsUserEmailUniqueValidator } from './validators/is-user-email-unique.validator';

/**
 * Defines the users module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,

    IsUserExistValidator,
    IsUserUsernameUniqueValidator,
    IsUserEmailUniqueValidator,
  ],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {}
