import { ValidationArguments } from 'class-validator';
import { UsersService } from '../../users.service';
import { IsUserEmailUniqueValidator } from '../../validators/is-user-email-unique.validator';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { userData } from '../../../../database/data/user.data';
import { USER_ALREADY_EXISTS_DEFAULT_MESSAGE } from '../../constants';

describe(IsUserEmailUniqueValidator.name, () => {
  let isUserEmailUniqueValidator: IsUserEmailUniqueValidator;
  let usersService: UsersService;
  let validationArguments: ValidationArguments;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsUserEmailUniqueValidator,
        UsersService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        { provide: getRepositoryToken(User), useValue: mockedRepository },
      ],
    }).compile();

    isUserEmailUniqueValidator = moduleRef.get<IsUserEmailUniqueValidator>(
      IsUserEmailUniqueValidator,
    );
    usersService = moduleRef.get<UsersService>(UsersService);

    validationArguments = {
      property: 'email',
      value: 'test@mail.com',
      targetName: 'email',
      constraints: [],
      object: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${IsUserEmailUniqueValidator.prototype.validate.name} is called`, () => {
    const data = { ...userData[0], email: 'mail@mail.com' };
    const newData = { ...userData[1], email: 'mail2@mail.com' };

    describe('and the user is not found', () => {
      it('should return true', async () => {
        jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

        expect(
          await isUserEmailUniqueValidator.validate(data.email),
        ).toBeTruthy();
      });
    });

    describe('and the user is found', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByEmail').mockResolvedValue(data);
      });

      describe('and the identifier key is not provided', () => {
        it('should return false', async () => {
          expect(
            await isUserEmailUniqueValidator.validate(
              data.email,
              validationArguments,
            ),
          ).toBeFalsy();
        });
      });

      describe('and the object is not provided', () => {
        it('should return false', async () => {
          expect(
            await isUserEmailUniqueValidator.validate(
              data.email,
              validationArguments,
            ),
          ).toBeFalsy();
        });
      });

      describe('and the identifier key is provided', () => {
        beforeEach(() => {
          validationArguments.constraints = ['email'];
        });

        describe('and the object is provided', () => {
          describe('and the value of object of identifier key is not equal with the value of user of identifier key', () => {
            beforeEach(() => {
              validationArguments.object = { email: newData.email };
            });

            it('should return false', async () => {
              expect(
                await isUserEmailUniqueValidator.validate(
                  data.email,
                  validationArguments,
                ),
              ).toBeFalsy();
            });
          });

          describe('and the value of object of identifier key is equal with the value of user of identifier key', () => {
            beforeEach(() => {
              validationArguments.object = { email: data.email };
            });

            it('should return true', async () => {
              expect(
                await isUserEmailUniqueValidator.validate(
                  data.email,
                  validationArguments,
                ),
              ).toBeTruthy();
            });
          });
        });
      });
    });
  });

  describe(`when ${IsUserEmailUniqueValidator.prototype.defaultMessage.name} is called`, () => {
    it('should return the correct validation error message', () => {
      expect(
        isUserEmailUniqueValidator.defaultMessage(validationArguments),
      ).toStrictEqual(
        USER_ALREADY_EXISTS_DEFAULT_MESSAGE(
          validationArguments?.property,
          validationArguments?.value,
        ),
      );
    });
  });
});
