import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity';
import { SwipesService } from './swipes.service';
import { SwipesController } from './swipes.controller';

/**
 * Defines the swipes module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Swipe])],
  providers: [SwipesService],
  controllers: [SwipesController],
  exports: [SwipesService],
})
export class SwipesModule {}
