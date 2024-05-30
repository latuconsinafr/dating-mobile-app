import { ValidationArguments } from 'class-validator';
import { UsersService } from '../../users.service';
import { IsUserExistValidator } from '../../validators/is-user-exist.validator';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { v4 as uuidv4 } from 'uuid';
import { userData } from '../../../../database/data/user.data';
import { USER_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../../constants';

describe(IsUserExistValidator.name, () => {
  let isUserExistValidator: IsUserExistValidator;
  let usersService: UsersService;
  let validationArguments: ValidationArguments;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsUserExistValidator,
        UsersService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        { provide: getRepositoryToken(User), useValue: mockedRepository },
      ],
    }).compile();

    isUserExistValidator =
      moduleRef.get<IsUserExistValidator>(IsUserExistValidator);
    usersService = moduleRef.get<UsersService>(UsersService);
    validationArguments = {
      property: 'id',
      value: uuidv4(),
      targetName: 'id',
      constraints: [],
      object: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${IsUserExistValidator.prototype.validate.name} is called`, () => {
    const data = userData[0];

    describe('and the incoming value is not a valid UUID v4', () => {
      it('should return false', async () => {
        expect(await isUserExistValidator.validate('asdasd')).toBeFalsy();
      });
    });

    describe('and the incoming value is a valid UUID v4', () => {
      let value: string;

      beforeEach(() => {
        value = uuidv4();
      });

      describe('and the user is not found', () => {
        it('should return false', async () => {
          jest.spyOn(usersService, 'findById').mockResolvedValue(null);

          expect(await isUserExistValidator.validate(value)).toBeFalsy();
        });
      });

      describe('and the user is found', () => {
        it('should return true', async () => {
          jest.spyOn(usersService, 'findById').mockResolvedValue(data);

          expect(await isUserExistValidator.validate(value)).toBeTruthy();
        });
      });
    });
  });

  describe(`when ${IsUserExistValidator.prototype.defaultMessage.name} is called`, () => {
    it('should return the correct validation error message', () => {
      expect(
        isUserExistValidator.defaultMessage(validationArguments),
      ).toStrictEqual(
        USER_DOES_NOT_EXIST_DEFAULT_MESSAGE(
          validationArguments?.property,
          validationArguments?.value,
        ),
      );
    });
  });
});
