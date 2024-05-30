import { Test } from '@nestjs/testing';
import { SwipesController } from '../swipes.controller';
import { RequestWithAuthUser } from '../../auth/types/request-with-auth-user.interface';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { Swipe } from '../entities/swipe.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { SwipesService } from '../swipes.service';
import { userData } from '../../../database/data/user.data';
import { CreateSwipeRequest } from '../dto/requests/create-swipe-request.dto';
import { swipeData } from '../../../database/data/swipe.data';
import { InternalServerErrorException } from '../../../common/exceptions/internal-server-error.exception';
import { SuccessResponse } from '../../../common/dto/responses/success-response.dto';
import { SWIPE_CREATED_MESSAGE } from '../constants';

describe(SwipesController.name, () => {
  let swipesController: SwipesController;
  let swipesService: SwipesService;
  let authenticatedRequest: RequestWithAuthUser;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SwipesController],
      providers: [
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        SwipesService,
        {
          provide: getRepositoryToken(Swipe),
          useValue: mockedRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedRepository,
        },
      ],
    }).compile();

    swipesController = moduleRef.get<SwipesController>(SwipesController);
    swipesService = moduleRef.get<SwipesService>(SwipesService);

    authenticatedRequest = { ...authenticatedRequest, user: userData[1] };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * POST: /
  describe(`when ${SwipesController.prototype.createSwipe.name} is called`, () => {
    let swipeToCreate: CreateSwipeRequest;
    let rolesServiceCreateSpy: jest.SpyInstance<Promise<Swipe>, [swipe: Swipe]>;
    const data = swipeData[0];

    beforeEach(() => {
      swipeToCreate = {
        ...data,
      };
      rolesServiceCreateSpy = jest.spyOn(swipesService, 'create');
      rolesServiceCreateSpy.mockResolvedValue(data);
    });

    describe('and when error occurred', () => {
      it(`should throw ${InternalServerErrorException.name}`, async () => {
        jest.spyOn(swipesService, 'create').mockImplementationOnce(async () => {
          throw new Error();
        });

        await expect(
          swipesController.createSwipe(authenticatedRequest, swipeToCreate),
        ).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('and when no error occurred', () => {
      it(`should call ${SwipesService.name} ${SwipesService.prototype.create.name} method`, async () => {
        await swipesController.createSwipe(authenticatedRequest, swipeToCreate);

        expect(rolesServiceCreateSpy).toBeCalledTimes(1);
      });

      it('should return a message and data contains the created swipe', async () => {
        expect(
          await swipesController.createSwipe(
            authenticatedRequest,
            swipeToCreate,
          ),
        ).toStrictEqual(
          new SuccessResponse({
            message: SWIPE_CREATED_MESSAGE,
            data: data,
          }),
        );
      });
    });
  });
});
