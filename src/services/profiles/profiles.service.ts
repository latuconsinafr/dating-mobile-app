import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

/**
 * Defines the profiles service that responsible for data storage and retrieval for profile related entity.
 */
@Injectable()
export class ProfilesService {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param profilesRepository The repository of profile entity
   */
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {
    this.logger.setContext(ProfilesService.name);
  }

  /**
   * Creates a profile.
   *
   * @param profile A profile to create
   *
   * @returns The created profile.
   */
  async create(profile: Profile): Promise<Profile> {
    this.logger.info(`Try to call ${ProfilesService.prototype.create.name}`);

    const createdProfile = this.profilesRepository.create({
      ...profile,
    });

    await this.profilesRepository.save(createdProfile);

    return createdProfile;
  }

  /**
   * Gets all profiles.
   *
   * @returns The profiles array.
   */
  async findAll(): Promise<Profile[]> {
    this.logger.info(`Try to call ${ProfilesService.prototype.findAll.name}`);

    return await this.profilesRepository.find();
  }

  /**
   * Gets a profile by a given id.
   *
   * @param id The id to find
   *
   * @returns The profile if it exists, otherwise null.
   */
  async findById(id: string): Promise<Profile | null> {
    this.logger.info(`Try to call ${ProfilesService.prototype.findById.name}`);

    return await this.profilesRepository.findOne({
      where: { id },
    });
  }

  /**
   * Updates a profile by a given id.
   *
   * @param id The profile id to update
   * @param profile The profile data to update
   *
   * @returns The flag indicates whether the update process is success or not.
   * Return `true` if the update process is success, otherwise `false`.
   */
  async update(id: string, profile: Profile): Promise<boolean> {
    this.logger.info(`Try to call ${ProfilesService.prototype.update.name}`);

    await this.profilesRepository.update(id, profile);

    return true;
  }

  /**
   * Deletes a profile by a given id.
   *
   * @param id The profile id to delete
   *
   * @returns The flag indicates whether the delete process is success or not.
   * Return `true` if the delete process is success, otherwise `false`.
   */
  async delete(id: string): Promise<boolean> {
    this.logger.info(`Try to call ${ProfilesService.prototype.delete.name}`);

    await this.profilesRepository.delete(id);

    return true;
  }
}
