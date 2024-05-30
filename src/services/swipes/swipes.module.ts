import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity';
import { SwipesService } from './swipes.service';
import { SwipesController } from './swipes.controller';
import { Subscription } from '../subscriptions/entities/subscription.entity';

/**
 * Defines the swipes module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Swipe, Subscription])],
  providers: [SwipesService],
  controllers: [SwipesController],
  exports: [SwipesService],
})
export class SwipesModule {}
