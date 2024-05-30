import { Test } from '@nestjs/testing';
import { ProfilesService } from '../profiles.service';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { Profile } from '../entities/profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Swipe } from '../../swipes/entities/swipe.entity';
import { profileData } from '../../../database/data/profile.data';
import { subscriptionData } from '../../../database/data/subscription.data';
import { PROFILE_STACK_COUNT } from '../constants';
import { swipeData } from '../../../database/data/swipe.data';

describe(ProfilesService.name, () => {
  let profilesService: ProfilesService;
  const mockedProfileRepository = mockedRepository;
  const mockedSwipeRepository = mockedRepository;
  const mockedSubscriptionRepository = mockedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockedProfileRepository,
        },
        { provide: getRepositoryToken(Swipe), useValue: mockedSwipeRepository },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedSubscriptionRepository,
        },
      ],
    }).compile();

    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * Create
  describe(`when ${ProfilesService.prototype.create.name} is called`, () => {
    const data = profileData[0];

    beforeEach(() => {
      mockedProfileRepository.create.mockReturnValue(data);
    });

    it('should return the created profile', async () => {
      expect(await profilesService.create(data)).toBe(data);
    });
  });

  // * Find all
  describe(`when ${ProfilesService.prototype.findAll.name} is called`, () => {
    const data = profileData;

    beforeEach(() => {
      mockedProfileRepository.find.mockResolvedValue(data);
    });

    it('should return array of profiles', async () => {
      expect(await profilesService.findAll()).toStrictEqual(data);
    });
  });

  // * Find stack
  describe(`when ${ProfilesService.prototype.findStack.name} is called`, () => {
    const profiles = [...profileData];
    const swipes = [...swipeData];
    const profile = profileData[0];
    const subscription = subscriptionData[0];

    describe('and the user has unlimited swipe subscription', () => {
      beforeEach(() => {
        mockedSubscriptionRepository.findOne.mockResolvedValue(subscription);
        mockedSwipeRepository.find.mockResolvedValue(swipes);
        mockedProfileRepository.find.mockResolvedValue(profiles);
      });

      it('should call find method with MAX_SAFE_INTEGER take', async () => {
        await profilesService.findStack(profile.id);

        expect(mockedProfileRepository.find).toBeCalledWith({
          where: expect.anything(),
          take: Number.MAX_SAFE_INTEGER,
          relations: {
            user: {
              subscriptions: true,
            },
          },
        });
      });

      it('should return all the available profiles', async () => {
        expect(await profilesService.findStack(profile.id)).toStrictEqual(
          profiles,
        );
      });
    });

    describe('and the user has no unlimited swipe subscription', () => {
      beforeEach(() => {
        mockedSubscriptionRepository.findOne.mockResolvedValue(undefined);
      });

      describe(`and the user has swiped profiles more than ${PROFILE_STACK_COUNT} times`, () => {
        // * Simulate data > PROFILE_STACK_COUNT
        const swiped = Array.from(
          { length: PROFILE_STACK_COUNT + 1 },
          () => swipeData[0],
        );

        it('should call find method with remaining profiles take or 0 at minimal', async () => {
          mockedProfileRepository.find.mockResolvedValue([]);
          mockedSwipeRepository.find.mockResolvedValue(swiped);

          await profilesService.findStack(profile.id);

          expect(mockedProfileRepository.find).toBeCalledWith({
            where: expect.anything(),
            take: Math.max(0, PROFILE_STACK_COUNT - swiped.length),
            relations: {
              user: {
                subscriptions: true,
              },
            },
          });
        });

        it('should return empty profiles', async () => {
          mockedSwipeRepository.find.mockResolvedValue(swiped);
          mockedProfileRepository.find.mockResolvedValue([]);

          expect(await profilesService.findStack(profile.id)).toStrictEqual([]);
        });
      });

      describe(`and the user has swiped profiles less than or equal to ${PROFILE_STACK_COUNT} times`, () => {
        // * Simulate data <= PROFILE_STACK_COUNT
        const swiped = Array.from(
          { length: PROFILE_STACK_COUNT - 1 },
          () => swipeData[0],
        );

        it('should call find method with the remaining profile count', async () => {
          mockedProfileRepository.find.mockResolvedValue(profiles);
          mockedSwipeRepository.find.mockResolvedValue(swiped);

          await profilesService.findStack(profile.id);

          expect(mockedProfileRepository.find).toBeCalledWith({
            where: { id: expect.anything() },
            take: PROFILE_STACK_COUNT - swiped.length,
            relations: {
              user: {
                subscriptions: true,
              },
            },
          });
        });

        it('should return the available profiles', async () => {
          mockedSwipeRepository.find.mockResolvedValue(swiped);
          mockedProfileRepository.find.mockResolvedValue(profiles);

          const result = await profilesService.findStack(profile.id);
          expect(result).toStrictEqual(profiles);
        });
      });
    });
  });

  // * Find by id
  describe(`when ${ProfilesService.prototype.findById.name} is called`, () => {
    const data = profileData[0];

    describe(`and the profile is not found`, () => {
      beforeEach(() => {
        mockedProfileRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await profilesService.findById(data.id)).toBeNull();
      });
    });

    describe(`and the profile is found`, () => {
      beforeEach(() => {
        mockedProfileRepository.findOne.mockResolvedValue(data);
      });

      it('should return a profile', async () => {
        expect(await profilesService.findById(data.id)).toStrictEqual(data);
      });
    });
  });

  // * Update
  describe(`when ${ProfilesService.prototype.update.name} is called`, () => {
    const data = profileData[0];

    beforeEach(() => {
      mockedProfileRepository.update.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await profilesService.update(data.id, data)).toBeTruthy();
    });
  });

  // * Delete
  describe(`when ${ProfilesService.prototype.delete.name} is called`, () => {
    const data = profileData[0];

    beforeEach(() => {
      mockedProfileRepository.delete.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await profilesService.delete(data.id)).toBeTruthy();
    });
  });
});
