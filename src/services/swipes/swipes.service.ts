import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Swipe } from './entities/swipe.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { SWIPE_COUNT } from './constants';
import { UnprocessableEntityException } from '../../common/exceptions/unprocessable-entity.exception';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionType } from '../subscriptions/enums/subscription-type.enum';

/**
 * Defines the swipes service that responsible for data storage and retrieval for swipe related entity.
 */
@Injectable()
export class SwipesService {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param swipesRepository The repository of swipe entity
   * @param subscriptionsRepository The repository of subscription entity
   */
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Swipe)
    private readonly swipesRepository: Repository<Swipe>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {
    this.logger.setContext(SwipesService.name);
  }

  /**
   * Creates a swipe.
   *
   * @param swipe A swipe to create
   *
   * @returns The created swipe.
   */
  async create(swipe: Swipe): Promise<Swipe> {
    this.logger.info(`Try to call ${SwipesService.prototype.create.name}`);

    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingSwipe = await this.swipesRepository.findOneBy({
      user: { id: swipe.userId },
      profile: { id: swipe.profileId },
      createdAt: Between(todayStart, todayEnd),
    });

    if (existingSwipe) {
      throw new UnprocessableEntityException({
        message: 'You have already swiped on this profile today.',
      });
    }

    const unlimitedSubscription = await this.subscriptionsRepository.findOne({
      where: {
        user: { id: swipe.userId },
        endDate: MoreThan(now),
        type: SubscriptionType.UnlimitedSwipe,
      },
      order: { endDate: 'DESC' },
    });

    const swipeCount = unlimitedSubscription
      ? -1
      : await this.swipesRepository.count({
          where: {
            user: { id: swipe.userId },
            createdAt: Between(todayStart, todayEnd),
          },
        });

    if (swipeCount >= SWIPE_COUNT) {
      throw new UnprocessableEntityException({
        message: 'Daily swipe limit reached.',
      });
    }

    const createdSwipe = this.swipesRepository.create({
      ...swipe,
    });

    await this.swipesRepository.save(createdSwipe);

    return createdSwipe;
  }

  /**
   * Gets all swipes.
   *
   * @returns The swipes array.
   */
  async findAll(): Promise<Swipe[]> {
    this.logger.info(`Try to call ${SwipesService.prototype.findAll.name}`);

    return await this.swipesRepository.find();
  }

  /**
   * Gets a swipe by a given id.
   *
   * @param id The id to find
   *
   * @returns The swipe if it exists, otherwise null.
   */
  async findById(id: string): Promise<Swipe | null> {
    this.logger.info(`Try to call ${SwipesService.prototype.findById.name}`);

    return await this.swipesRepository.findOne({
      where: { id },
    });
  }

  /**
   * Updates a swipe by a given id.
   *
   * @param id The swipe id to update
   * @param swipe The swipe data to update
   *
   * @returns The flag indicates whether the update process is success or not.
   * Return `true` if the update process is success, otherwise `false`.
   */
  async update(id: string, swipe: Swipe): Promise<boolean> {
    this.logger.info(`Try to call ${SwipesService.prototype.update.name}`);

    await this.swipesRepository.update(id, swipe);

    return true;
  }

  /**
   * Deletes a swipe by a given id.
   *
   * @param id The swipe id to delete
   *
   * @returns The flag indicates whether the delete process is success or not.
   * Return `true` if the delete process is success, otherwise `false`.
   */
  async delete(id: string): Promise<boolean> {
    this.logger.info(`Try to call ${SwipesService.prototype.delete.name}`);

    await this.swipesRepository.delete(id);

    return true;
  }
}
