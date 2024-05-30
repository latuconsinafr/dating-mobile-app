import { Test } from '@nestjs/testing';
import { RequestWithAuthUser } from '../../auth/types/request-with-auth-user.interface';
import { SubscriptionsController } from '../subscriptions.controller';
import { SubscriptionsService } from '../subscriptions.service';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { Subscription } from '../entities/subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { userData } from '../../../database/data/user.data';
import { CreateSubscriptionRequest } from '../dto/requests/create-subscription-request.dto';
import { subscriptionData } from '../../../database/data/subscription.data';
import { InternalServerErrorException } from '../../../common/exceptions/internal-server-error.exception';
import { SuccessResponse } from '../../../common/dto/responses/success-response.dto';
import { SUBSCRIPTION_CREATED_MESSAGE } from '../constants';

describe(SubscriptionsController.name, () => {
  let subscriptionsController: SubscriptionsController;
  let subscriptionsService: SubscriptionsService;
  let authenticatedRequest: RequestWithAuthUser;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedRepository,
        },
      ],
    }).compile();

    subscriptionsController = moduleRef.get<SubscriptionsController>(
      SubscriptionsController,
    );
    subscriptionsService =
      moduleRef.get<SubscriptionsService>(SubscriptionsService);

    authenticatedRequest = { ...authenticatedRequest, user: userData[1] };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * POST: /
  describe(`when ${SubscriptionsController.prototype.createSubscription.name} is called`, () => {
    let subscriptionToCreate: CreateSubscriptionRequest;
    let subscriptionsServiceCreateSpy: jest.SpyInstance<
      Promise<Subscription>,
      [subscription: Subscription]
    >;
    const data = subscriptionData[0];

    beforeEach(() => {
      subscriptionToCreate = {
        ...data,
      };
      subscriptionsServiceCreateSpy = jest.spyOn(
        subscriptionsService,
        'create',
      );
      subscriptionsServiceCreateSpy.mockResolvedValue(data);
    });

    describe('and when error occurred', () => {
      it(`should throw ${InternalServerErrorException.name}`, async () => {
        jest
          .spyOn(subscriptionsService, 'create')
          .mockImplementationOnce(async () => {
            throw new Error();
          });

        await expect(
          subscriptionsController.createSubscription(
            authenticatedRequest,
            subscriptionToCreate,
          ),
        ).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('and when no error occurred', () => {
      it(`should call ${SubscriptionsService.name} ${SubscriptionsService.prototype.create.name} method`, async () => {
        await subscriptionsController.createSubscription(
          authenticatedRequest,
          subscriptionToCreate,
        );

        expect(subscriptionsServiceCreateSpy).toBeCalledTimes(1);
      });

      it('should return a message and data contains the created subscription', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        expect(
          await subscriptionsController.createSubscription(
            authenticatedRequest,
            subscriptionToCreate,
          ),
        ).toStrictEqual(
          new SuccessResponse({
            message: SUBSCRIPTION_CREATED_MESSAGE,
            data: data,
          }),
        );
      });
    });
  });
});
