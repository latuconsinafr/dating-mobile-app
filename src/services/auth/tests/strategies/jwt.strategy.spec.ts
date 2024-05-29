import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { UnauthorizedErrorResponse } from '../../../../common/dto/responses/errors/unauthorized-error-response.dto';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { User } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/users.service';
import { TokenPayload } from '../../types/token-payload.interface';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { userData } from '../../../../database/data/user.data';
import { UnauthorizedException } from '../../../../common/exceptions/unauthorized.exception';

describe(JwtStrategy.name, () => {
  let jwtStrategy: JwtStrategy;
  let usersService: UsersService;
  const jwtSecret = 'secret';
  const jwtExpiresIn = '24h';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
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
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockedRepository },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${JwtStrategy.prototype.validate.name} is called`, () => {
    let payload: TokenPayload;
    const data = userData[0];

    beforeEach(() => {
      payload = {
        sub: data.id,
        username: data.username,
      };
    });

    describe('and the user is not found', () => {
      it(`should throw ${UnauthorizedErrorResponse.name} exception`, async () => {
        jest.spyOn(usersService, 'findById').mockResolvedValue(null);

        await expect(jwtStrategy.validate(payload)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });

    describe('and the user is found', () => {
      it('should return the authenticated user', async () => {
        jest.spyOn(usersService, 'findById').mockResolvedValue(data);

        expect(await jwtStrategy.validate(payload)).toStrictEqual(data);
      });
    });
  });
});
