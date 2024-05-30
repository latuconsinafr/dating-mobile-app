import { Test } from '@nestjs/testing';
import { SwipesService } from '../swipes.service';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Swipe } from '../entities/swipe.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { swipeData } from '../../../database/data/swipe.data';
import { subscriptionData } from '../../../database/data/subscription.data';
import { UnprocessableEntityException } from '../../../common/exceptions/unprocessable-entity.exception';
import { SWIPE_COUNT } from '../constants';

describe(SwipesService.name, () => {
  let swipesService: SwipesService;
  const mockedSwipeRepository = mockedRepository;
  const mockedSubscriptionRepository = mockedRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SwipesService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        { provide: getRepositoryToken(Swipe), useValue: mockedSwipeRepository },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedSubscriptionRepository,
        },
      ],
    }).compile();

    swipesService = moduleRef.get<SwipesService>(SwipesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * Create
  describe(`when ${SwipesService.prototype.create.name} is called`, () => {
    const subscription = subscriptionData[0];
    const swipe = swipeData[0];

    describe('and the user has already swiped the profile', () => {
      beforeEach(() => {
        mockedSwipeRepository.findOneBy.mockResolvedValue(swipe);
      });

      it(`should throw ${UnprocessableEntityException.name} error`, async () => {
        await expect(swipesService.create(swipe)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });
    });

    describe('and the user has not been swiped the profile', () => {
      beforeEach(() => {
        mockedSwipeRepository.findOneBy.mockResolvedValue(undefined);
      });

      describe('and the user has no unlimited swipe subscription', () => {
        beforeEach(() => {
          mockedSubscriptionRepository.findOne.mockResolvedValue(undefined);
        });

        it('should call the count method', async () => {
          await swipesService.create(swipe);

          expect(mockedSwipeRepository.count).toBeCalled();
        });

        describe('and the swipe limit has been reached', () => {
          beforeEach(() => {
            mockedSwipeRepository.count.mockResolvedValue(SWIPE_COUNT + 1);
          });

          it(`should throw ${UnprocessableEntityException.name} error`, async () => {
            await expect(swipesService.create(swipe)).rejects.toThrow(
              UnprocessableEntityException,
            );
          });
        });
      });

      describe('and the user has unlimited swipe subscription', () => {
        beforeEach(() => {
          mockedSubscriptionRepository.findOne.mockResolvedValue(subscription);
          mockedSwipeRepository.create.mockReturnValue(swipe);
        });

        it('should successfully swipe the profile', async () => {
          expect(await swipesService.create(swipe)).toStrictEqual(swipe);
        });
      });
    });
  });

  // * Find all
  describe(`when ${SwipesService.prototype.findAll.name} is called`, () => {
    const data = swipeData;

    beforeEach(() => {
      mockedSwipeRepository.find.mockResolvedValue(data);
    });

    it('should return array of swipes', async () => {
      expect(await swipesService.findAll()).toStrictEqual(data);
    });
  });

  // * Find by id
  describe(`when ${SwipesService.prototype.findById.name} is called`, () => {
    const data = swipeData[0];

    describe(`and the swipe is not found`, () => {
      beforeEach(() => {
        mockedSwipeRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await swipesService.findById(data.id)).toBeNull();
      });
    });

    describe(`and the swipe is found`, () => {
      beforeEach(() => {
        mockedSwipeRepository.findOne.mockResolvedValue(data);
      });

      it('should return a swipe', async () => {
        expect(await swipesService.findById(data.id)).toStrictEqual(data);
      });
    });
  });

  // * Update
  describe(`when ${SwipesService.prototype.update.name} is called`, () => {
    const data = swipeData[0];

    beforeEach(() => {
      mockedSwipeRepository.update.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await swipesService.update(data.id, data)).toBeTruthy();
    });
  });

  // * Delete
  describe(`when ${SwipesService.prototype.delete.name} is called`, () => {
    const data = swipeData[0];

    beforeEach(() => {
      mockedSwipeRepository.delete.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await swipesService.delete(data.id)).toBeTruthy();
    });
  });
});
