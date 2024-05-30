import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { userData } from '../../../../database/data/user.data';
import { USER_ALREADY_EXISTS_DEFAULT_MESSAGE } from '../../constants';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../users.service';
import { IsUserUsernameUniqueValidator } from '../../validators/is-user-username-unique.validator';

describe(IsUserUsernameUniqueValidator.name, () => {
  let isUserUsernameUniqueValidator: IsUserUsernameUniqueValidator;
  let usersService: UsersService;
  let validationArguments: ValidationArguments;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsUserUsernameUniqueValidator,
        UsersService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        { provide: getRepositoryToken(User), useValue: mockedRepository },
      ],
    }).compile();

    isUserUsernameUniqueValidator =
      moduleRef.get<IsUserUsernameUniqueValidator>(
        IsUserUsernameUniqueValidator,
      );
    usersService = moduleRef.get<UsersService>(UsersService);

    validationArguments = {
      property: 'username',
      value: 'user',
      targetName: 'username',
      constraints: [],
      object: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${IsUserUsernameUniqueValidator.prototype.validate.name} is called`, () => {
    const data = userData[0];
    const newData = userData[1];

    describe('and the user is not found', () => {
      it('should return true', async () => {
        jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

        expect(
          await isUserUsernameUniqueValidator.validate(data.username),
        ).toBeTruthy();
      });
    });

    describe('and the user is found', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByUsername').mockResolvedValue(data);
      });

      describe('and the identifier key is not provided', () => {
        it('should return false', async () => {
          expect(
            await isUserUsernameUniqueValidator.validate(
              data.username,
              validationArguments,
            ),
          ).toBeFalsy();
        });
      });

      describe('and the object is not provided', () => {
        it('should return false', async () => {
          expect(
            await isUserUsernameUniqueValidator.validate(
              data.username,
              validationArguments,
            ),
          ).toBeFalsy();
        });
      });

      describe('and the identifier key is provided', () => {
        beforeEach(() => {
          validationArguments.constraints = ['username'];
        });

        describe('and the object is provided', () => {
          describe('and the value of object of identifier key is not equal with the value of user of identifier key', () => {
            beforeEach(() => {
              validationArguments.object = { username: newData.username };
            });

            it('should return false', async () => {
              expect(
                await isUserUsernameUniqueValidator.validate(
                  data.username,
                  validationArguments,
                ),
              ).toBeFalsy();
            });
          });

          describe('and the value of object of identifier key is equal with the value of user of identifier key', () => {
            beforeEach(() => {
              validationArguments.object = { username: data.username };
            });

            it('should return true', async () => {
              expect(
                await isUserUsernameUniqueValidator.validate(
                  data.username,
                  validationArguments,
                ),
              ).toBeTruthy();
            });
          });
        });
      });
    });
  });

  describe(`when ${IsUserUsernameUniqueValidator.prototype.defaultMessage.name} is called`, () => {
    it('should return the correct validation error message', () => {
      expect(
        isUserUsernameUniqueValidator.defaultMessage(validationArguments),
      ).toStrictEqual(
        USER_ALREADY_EXISTS_DEFAULT_MESSAGE(
          validationArguments?.property,
          validationArguments?.value,
        ),
      );
    });
  });
});
