import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { SwipesService } from '../../swipes.service';
import { IsSwipeExistValidator } from '../../validators/is-swipe-exist.validator';
import { v4 as uuidv4 } from 'uuid';
import { Swipe } from '../../entities/swipe.entity';
import { swipeData } from '../../../../database/data/swipe.data';
import { SWIPE_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../../constants';
import { Subscription } from '../../../subscriptions/entities/subscription.entity';

describe(IsSwipeExistValidator.name, () => {
  let isSwipeExistValidator: IsSwipeExistValidator;
  let swipesService: SwipesService;
  let validationArguments: ValidationArguments;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsSwipeExistValidator,
        SwipesService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
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

    isSwipeExistValidator = moduleRef.get<IsSwipeExistValidator>(
      IsSwipeExistValidator,
    );
    swipesService = moduleRef.get<SwipesService>(SwipesService);
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

  describe(`when ${IsSwipeExistValidator.prototype.validate.name} is called`, () => {
    const data = swipeData[0];

    describe('and the incoming value is not a valid UUID v4', () => {
      it('should return false', async () => {
        expect(await isSwipeExistValidator.validate('asdasd')).toBeFalsy();
      });
    });

    describe('and the incoming value is a valid UUID v4', () => {
      let value: string;

      beforeEach(() => {
        value = uuidv4();
      });

      describe('and the swipe is not found', () => {
        it('should return false', async () => {
          jest.spyOn(swipesService, 'findById').mockResolvedValue(null);

          expect(await isSwipeExistValidator.validate(value)).toBeFalsy();
        });
      });

      describe('and the swipe is found', () => {
        it('should return true', async () => {
          jest.spyOn(swipesService, 'findById').mockResolvedValue(data);

          expect(await isSwipeExistValidator.validate(value)).toBeTruthy();
        });
      });
    });
  });

  describe(`when ${IsSwipeExistValidator.prototype.defaultMessage.name} is called`, () => {
    it('should return the correct validation error message', () => {
      expect(
        isSwipeExistValidator.defaultMessage(validationArguments),
      ).toStrictEqual(
        SWIPE_DOES_NOT_EXIST_DEFAULT_MESSAGE(
          validationArguments?.property,
          validationArguments?.value,
        ),
      );
    });
  });
});
