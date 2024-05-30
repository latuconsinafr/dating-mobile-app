import { Test } from '@nestjs/testing';
import { SubscriptionsService } from '../subscriptions.service';
import { PinoLogger } from 'nestjs-pino/PinoLogger';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { subscriptionData } from '../../../database/data/subscription.data';

describe(SubscriptionsService.name, () => {
  let subscriptionsService: SubscriptionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedRepository,
        },
      ],
    }).compile();

    subscriptionsService =
      moduleRef.get<SubscriptionsService>(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * Create
  describe(`when ${SubscriptionsService.prototype.create.name} is called`, () => {
    const data = subscriptionData[0];

    beforeEach(() => {
      mockedRepository.create.mockReturnValue(data);
    });

    it('should return the created user', async () => {
      expect(await subscriptionsService.create(data)).toBe(data);
    });
  });

  // * Find all
  describe(`when ${SubscriptionsService.prototype.findAll.name} is called`, () => {
    const data = subscriptionData;

    beforeEach(() => {
      mockedRepository.find.mockResolvedValue(data);
    });

    it('should return array of users', async () => {
      expect(await subscriptionsService.findAll()).toStrictEqual(data);
    });
  });

  // * Find by id
  describe(`when ${SubscriptionsService.prototype.findById.name} is called`, () => {
    const data = subscriptionData[0];

    describe(`and the user is not found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await subscriptionsService.findById(data.id)).toBeNull();
      });
    });

    describe(`and the user is found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(data);
      });

      it('should return a user', async () => {
        expect(await subscriptionsService.findById(data.id)).toStrictEqual(
          data,
        );
      });
    });
  });

  // * Update
  describe(`when ${SubscriptionsService.prototype.update.name} is called`, () => {
    const data = subscriptionData[0];

    beforeEach(() => {
      mockedRepository.update.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await subscriptionsService.update(data.id, data)).toBeTruthy();
    });
  });

  // * Delete
  describe(`when ${SubscriptionsService.prototype.delete.name} is called`, () => {
    const data = subscriptionData[0];

    beforeEach(() => {
      mockedRepository.delete.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await subscriptionsService.delete(data.id)).toBeTruthy();
    });
  });
});
