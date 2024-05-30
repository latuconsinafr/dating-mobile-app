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
import { LocalStrategy } from '../../strategies/local.strategy';
import { userData } from '../../../../database/data/user.data';
import { UnprocessableEntityException } from '../../../../common/exceptions/unprocessable-entity.exception';

describe(LocalStrategy.name, () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  const jwtSecret = 'secret';
  const jwtExpiresIn = '24h';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockedRepository },
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

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${LocalStrategy.prototype.validate.name} is called`, () => {
    const data = userData[0];

    describe('and the user is not validated', () => {
      it(`should throw ${UnprocessableEntityException.name} exception`, async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

        await expect(
          localStrategy.validate(data.username, data.password),
        ).rejects.toThrow(UnprocessableEntityException);
      });
    });

    describe('and the user is validated', () => {
      it('should return the validated user', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue(data);

        expect(
          await localStrategy.validate(data.username, data.password),
        ).toStrictEqual(data);
      });
    });
  });
});
