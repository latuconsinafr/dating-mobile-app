import { Test } from '@nestjs/testing';
import { RequestWithAuthUser } from '../../auth/types/request-with-auth-user.interface';
import { ProfilesController } from '../profiles.controller';
import { ProfilesService } from '../profiles.service';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { Profile } from '../entities/profile.entity';
import { Swipe } from '../../swipes/entities/swipe.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { userData } from '../../../database/data/user.data';
import { profileData } from '../../../database/data/profile.data';
import { InternalServerErrorException } from '../../../common/exceptions/internal-server-error.exception';
import { SuccessResponse } from '../../../common/dto/responses/success-response.dto';
import { PROFILES_RETRIEVED_MESSAGE } from '../constants';

describe(ProfilesController.name, () => {
  let profilesController: ProfilesController;
  let profilesService: ProfilesService;
  let authenticatedRequest: RequestWithAuthUser;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockedRepository,
        },
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

    profilesController = moduleRef.get<ProfilesController>(ProfilesController);
    profilesService = moduleRef.get<ProfilesService>(ProfilesService);

    authenticatedRequest = { ...authenticatedRequest, user: userData[1] };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * GET : /{id}/stack
  describe(`when ${ProfilesController.prototype.findProfileStack.name} is called`, () => {
    let profilesServiceFindStackSpy: jest.SpyInstance<
      Promise<Profile[]>,
      [id: string]
    >;
    const data = profileData.map((profile) => ({
      ...profile,
      isVerified: false,
      isCurrentlyVerified: () => false,
    }));

    beforeEach(() => {
      profilesServiceFindStackSpy = jest.spyOn(profilesService, 'findStack');
      profilesServiceFindStackSpy.mockResolvedValue([...data]);
    });

    describe('and when error occurred', () => {
      it(`should throw ${InternalServerErrorException.name}`, async () => {
        jest
          .spyOn(profilesService, 'findStack')
          .mockImplementationOnce(async () => {
            throw new Error();
          });

        await expect(
          profilesController.findProfileStack(authenticatedRequest, data[0]),
        ).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('and when no error occurred', () => {
      it(`should call ${ProfilesService.name} ${ProfilesService.prototype.findStack.name} method`, async () => {
        await profilesController.findProfileStack(
          authenticatedRequest,
          data[0],
        );

        expect(profilesServiceFindStackSpy).toBeCalledTimes(1);
      });

      it(`should return a message and data contains array of roles`, async () => {
        expect(
          await profilesController.findProfileStack(
            authenticatedRequest,
            data[0],
          ),
        ).toStrictEqual(
          new SuccessResponse({
            message: PROFILES_RETRIEVED_MESSAGE,
            data: data,
          }),
        );
      });
    });
  });
});
