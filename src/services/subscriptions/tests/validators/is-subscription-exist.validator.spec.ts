import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { subscriptionData } from '../../../../database/data/subscription.data';
import { SUBSCRIPTION_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../../constants';
import { SubscriptionsService } from '../../subscriptions.service';
import { IsSubscriptionExistValidator } from '../../validators/is-subscription-exist.validator';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from '../../entities/subscription.entity';

describe(IsSubscriptionExistValidator.name, () => {
  let isSubscriptionExistValidator: IsSubscriptionExistValidator;
  let subscriptionsService: SubscriptionsService;
  let validationArguments: ValidationArguments;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsSubscriptionExistValidator,
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

    isSubscriptionExistValidator = moduleRef.get<IsSubscriptionExistValidator>(
      IsSubscriptionExistValidator,
    );
    subscriptionsService =
      moduleRef.get<SubscriptionsService>(SubscriptionsService);
    validationArguments = {
      property: 'id',
      value: uuidv4(),
      targetName: 'id',
      constraints: [],
      object: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${IsSubscriptionExistValidator.prototype.validate.name} is called`, () => {
    const data = subscriptionData[0];

    describe('and the incoming value is not a valid UUID v4', () => {
      it('should return false', async () => {
        expect(
          await isSubscriptionExistValidator.validate('asdasd'),
        ).toBeFalsy();
      });
    });

    describe('and the incoming value is a valid UUID v4', () => {
      let value: string;

      beforeEach(() => {
        value = uuidv4();
      });

      describe('and the subscription is not found', () => {
        it('should return false', async () => {
          jest.spyOn(subscriptionsService, 'findById').mockResolvedValue(null);

          expect(
            await isSubscriptionExistValidator.validate(value),
          ).toBeFalsy();
        });
      });

      describe('and the subscription is found', () => {
        it('should return true', async () => {
          jest.spyOn(subscriptionsService, 'findById').mockResolvedValue(data);

          expect(
            await isSubscriptionExistValidator.validate(value),
          ).toBeTruthy();
        });
      });
    });
  });

  describe(`when ${IsSubscriptionExistValidator.prototype.defaultMessage.name} is called`, () => {
    it('should return the correct validation error message', () => {
      expect(
        isSubscriptionExistValidator.defaultMessage(validationArguments),
      ).toStrictEqual(
        SUBSCRIPTION_DOES_NOT_EXIST_DEFAULT_MESSAGE(
          validationArguments?.property,
          validationArguments?.value,
        ),
      );
    });
  });
});
