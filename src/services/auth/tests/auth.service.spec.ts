import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ClinicsService } from '../../clinics/clinics.service';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { userData } from '../../../database/data/user.data';
import * as argon2 from 'argon2';
import { clinicData } from '../../../database/data/clinic.data';
import { mockedJwtService } from '../../../common/utils/mocks/@nestjs/jwt/jwt-service.mock';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { ClinicApproval } from '../../clinics/entities/clinic-approval.entity';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { SubscriptionApproval } from '../../subscriptions/entities/subscription-approval.entity';

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: UsersService;
  let clinicsService: ClinicsService;
  let argon2Verify: jest.Mock;
  const jwtSecret = 'secret';
  const jwtExpiresIn = '24h';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
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
    usersService = moduleRef.get<UsersService>(UsersService);
    clinicsService = moduleRef.get<ClinicsService>(ClinicsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${AuthService.prototype.validateUser.name} is called`, () => {
    const data = userData[0];
    const clinic = clinicData[0];
    const newClinic = clinicData[1];

    describe('and the user is not exist', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(
          await authService.validateUser(data.username, data.password),
        ).toBeNull();
      });
    });

    describe('and the user is exist', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByUsername').mockResolvedValue(data);
      });

      describe('and the password is verified', () => {
        beforeEach(() => {
          argon2Verify = jest.fn().mockResolvedValue(true);
          (argon2.verify as jest.Mock) = argon2Verify;
        });

        describe('and the user does not have the clinic id', () => {
          beforeEach(() => {
            jest
              .spyOn(usersService, 'findByUsername')
              .mockResolvedValue({ ...data, clinicId: null });
          });

          it('should return the user immediately', async () => {
            expect(
              await authService.validateUser(data.username, data.password),
            ).toStrictEqual({ ...data, clinicId: null });
          });
        });

        describe('and the user does have the clinic id', () => {
          beforeEach(() => {
            jest
              .spyOn(usersService, 'findByUsername')
              .mockResolvedValue({ ...data, clinicId: clinic.id });
          });

          describe('and the incoming unique key is neither null or undefined', () => {
            it('should return null', async () => {
              expect(
                await authService.validateUser(data.username, data.password),
              ).toBeNull();
            });
          });

          describe('and the existing unique key does not match with the incoming unique key', () => {
            beforeEach(() => {
              jest
                .spyOn(clinicsService, 'findById')
                .mockResolvedValue(newClinic);
            });

            it('should return null', async () => {
              expect(
                await authService.validateUser(
                  data.username,
                  data.password,
                  clinic.uniqueKey,
                ),
              ).toBeNull();
            });
          });
        });
      });

      describe('and the password is not verified', () => {
        beforeEach(() => {
          argon2Verify = jest.fn().mockResolvedValue(false);
          (argon2.verify as jest.Mock) = argon2Verify;
        });

        it('should return null', async () => {
          expect(
            await authService.validateUser(data.username, data.password),
          ).toBeNull();
        });
      });
    });
  });

  describe(`when ${AuthService.prototype.signIn.name} is called`, () => {
    const data = userData[0];
    const accessToken = 'accessToken';

    beforeEach(() => {
      mockedJwtService.sign.mockReturnValue(accessToken);
    });

    it('should return the correct auth response', async () => {
      expect(await authService.signIn(data)).toStrictEqual({
        accessToken: accessToken,
        expiresIn: jwtExpiresIn,
      });
    });
  });
});
