import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';

/**
 * Defines the subscriptions service that responsible for data storage and retrieval for subscription related entity.
 */
@Injectable()
export class SubscriptionsService {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param subscriptionsRepository The repository of subscription entity
   */
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {
    this.logger.setContext(SubscriptionsService.name);
  }

  /**
   * Creates a subscription.
   *
   * @param subscription A subscription to create
   *
   * @returns The created subscription.
   */
  async create(subscription: Subscription): Promise<Subscription> {
    this.logger.info(
      `Try to call ${SubscriptionsService.prototype.create.name}`,
    );

    const createdSubscription = this.subscriptionsRepository.create({
      ...subscription,
    });

    await this.subscriptionsRepository.save(createdSubscription);

    return createdSubscription;
  }

  /**
   * Gets all subscriptions.
   *
   * @returns The subscriptions array.
   */
  async findAll(): Promise<Subscription[]> {
    this.logger.info(
      `Try to call ${SubscriptionsService.prototype.findAll.name}`,
    );

    return await this.subscriptionsRepository.find();
  }

  /**
   * Gets a subscription by a given id.
   *
   * @param id The id to find
   *
   * @returns The subscription if it exists, otherwise null.
   */
  async findById(id: string): Promise<Subscription | null> {
    this.logger.info(
      `Try to call ${SubscriptionsService.prototype.findById.name}`,
    );

    return await this.subscriptionsRepository.findOne({
      where: { id },
    });
  }

  /**
   * Updates a subscription by a given id.
   *
   * @param id The subscription id to update
   * @param subscription The subscription data to update
   *
   * @returns The flag indicates whether the update process is success or not.
   * Return `true` if the update process is success, otherwise `false`.
   */
  async update(id: string, subscription: Subscription): Promise<boolean> {
    this.logger.info(
      `Try to call ${SubscriptionsService.prototype.update.name}`,
    );

    await this.subscriptionsRepository.update(id, subscription);

    return true;
  }

  /**
   * Deletes a subscription by a given id.
   *
   * @param id The subscription id to delete
   *
   * @returns The flag indicates whether the delete process is success or not.
   * Return `true` if the delete process is success, otherwise `false`.
   */
  async delete(id: string): Promise<boolean> {
    this.logger.info(
      `Try to call ${SubscriptionsService.prototype.delete.name}`,
    );

    await this.subscriptionsRepository.delete(id);

    return true;
  }
}
