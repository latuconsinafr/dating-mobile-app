import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { mockedJwtService } from '../../../../common/utils/mocks/@nestjs/jwt/jwt-service.mock';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { User } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/users.service';
import { AuthService } from '../../auth.service';
import { CustomStrategy } from '../../strategies/local.strategy';
import { userData } from '../../../../database/data/user.data';
import { clinicData } from '../../../../database/data/clinic.data';
import { ClinicsService } from '../../../clinics/clinics.service';
import { Clinic } from '../../../clinics/entities/clinic.entity';
import { UnprocessableEntityException } from '../../../../common/exceptions/unprocessable-entity.exception';
import { ClinicApproval } from '../../../clinics/entities/clinic-approval.entity';
import { SubscriptionsService } from '../../../subscriptions/subscriptions.service';
import { Subscription } from '../../../subscriptions/entities/subscription.entity';
import { SubscriptionApproval } from '../../../subscriptions/entities/subscription-approval.entity';

describe(CustomStrategy.name, () => {
  let customStrategy: CustomStrategy;
  let authService: AuthService;
  const jwtSecret = 'secret';
  const jwtExpiresIn = '24h';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomStrategy,
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

    customStrategy = moduleRef.get<CustomStrategy>(CustomStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${CustomStrategy.prototype.validate.name} is called`, () => {
    const data = userData[0];
    const clinic = clinicData[0];

    const request = {
      ...{
        body: {
          username: data.username,
          password: data.password,
          uniqueKey: clinic.uniqueKey,
        },
      },
    };

    describe('and the user is not validated', () => {
      it(`should throw ${UnprocessableEntityException.name} exception`, async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

        await expect(customStrategy.validate(request as any)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });
    });

    describe('and the user is validated', () => {
      it('should return the validated user', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue(data);

        expect(await customStrategy.validate(request as any)).toStrictEqual(
          data,
        );
      });
    });
  });
});
