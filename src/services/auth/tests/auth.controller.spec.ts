import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { SuccessResponse } from '../../../common/dto/responses/success-response.dto';
import { mockedJwtService } from '../../../common/utils/mocks/@nestjs/jwt/jwt-service.mock';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthResponse } from '../types/auth-response.interface';
import RequestWithAuthUser from '../types/request-with-auth-user.interface';
import { userData } from '../../../database/data/user.data';
import {
  USER_AUTHENTICATED_MESSAGE,
  USER_SIGNED_IN_MESSAGE,
} from '../constants';
import { ClinicsService } from '../../clinics/clinics.service';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { InternalServerErrorException } from '../../../common/exceptions/internal-server-error.exception';
import { ClinicApproval } from '../../clinics/entities/clinic-approval.entity';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { SubscriptionApproval } from '../../subscriptions/entities/subscription-approval.entity';

describe(AuthController.name, () => {
  let authController: AuthController;
  let authService: AuthService;
  const jwtSecret = 'secret';
  const jwtExpiresIn = '24h';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockedRepository },
        ClinicsService,
        { provide: getRepositoryToken(Clinic), useValue: mockedRepository },
        {
          provide: getRepositoryToken(ClinicApproval),
          useValue: mockedRepository,
        },
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedRepository,
        },
        {
          provide: getRepositoryToken(SubscriptionApproval),
          useValue: mockedRepository,
        },
        { provide: JwtService, useValue: mockedJwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return {
                secret: jwtSecret,
                signOptions: {
                  expiresIn: jwtExpiresIn,
                },
              };
            }),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${AuthController.prototype.authenticate.name} is called`, () => {
    let request: RequestWithAuthUser;
    const data = userData[0];

    beforeEach(() => {
      request = { ...request, user: data };
    });

    it(`it should return a message and data contains a user`, async () => {
      expect(await authController.authenticate(request)).toStrictEqual(
        new SuccessResponse({
          message: USER_AUTHENTICATED_MESSAGE,
          data: data,
        }),
      );
    });
  });

  describe(`when ${AuthController.prototype.signIn.name} is called`, () => {
    let request: RequestWithAuthUser;
    let authServiceSignInSpy: jest.SpyInstance<
      Promise<AuthResponse>,
      [user: User]
    >;
    const data = userData[0];

    beforeEach(() => {
      request = { ...request, user: data };
      authServiceSignInSpy = jest.spyOn(authService, 'signIn');
      authServiceSignInSpy.mockResolvedValue({
        accessToken: jwtSecret,
        expiresIn: jwtExpiresIn,
      });
    });

    describe('and when error occurred', () => {
      it(`should throw ${InternalServerErrorException.name}`, async () => {
        jest.spyOn(authService, 'signIn').mockImplementationOnce(async () => {
          throw new Error();
        });
        await expect(authController.signIn(request)).rejects.toThrow(
          InternalServerErrorException,
        );
      });
    });

    describe('and when no error occurred', () => {
      it(`should call ${AuthService.name} ${AuthService.prototype.signIn.name} method`, async () => {
        await authController.signIn(request);

        expect(authServiceSignInSpy).toBeCalledTimes(1);
      });

      it('should return a message and data contains the created user', async () => {
        expect(await authController.signIn(request)).toStrictEqual(
          new SuccessResponse({
            message: USER_SIGNED_IN_MESSAGE,
            data: {
              accessToken: jwtSecret,
              expiresIn: jwtExpiresIn,
            },
          }),
        );
      });
    });
  });
});
