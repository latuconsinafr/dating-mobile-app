import { ArgumentMetadata } from '@nestjs/common';
import { ProfileByIdPipe } from '../../pipes/profile-by-id.pipe';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedRepository } from '../../../../common/utils/mocks/typeorm/repository.mock';
import { UnprocessableEntityException } from '../../../../common/exceptions/unprocessable-entity.exception';
import { NotFoundException } from '../../../../common/exceptions/not-found.exception';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../../entities/profile.entity';
import { profileData } from '../../../../database/data/profile.data';
import { ProfilesService } from '../../profiles.service';
import { Swipe } from '../../../swipes/entities/swipe.entity';
import { Subscription } from '../../../subscriptions/entities/subscription.entity';

describe(ProfileByIdPipe.name, () => {
  let profileByIdPipe: ProfileByIdPipe;
  let profilesService: ProfilesService;
  let argumentMetaData: ArgumentMetadata;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileByIdPipe,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        ProfilesService,
        { provide: getRepositoryToken(Profile), useValue: mockedRepository },
        { provide: getRepositoryToken(Swipe), useValue: mockedRepository },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockedRepository,
        },
      ],
    }).compile();

    profileByIdPipe = moduleRef.get<ProfileByIdPipe>(ProfileByIdPipe);
    profilesService = moduleRef.get<ProfilesService>(ProfilesService);

    argumentMetaData = {
      type: 'param',
      metatype: String,
      data: 'id',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when ${ProfileByIdPipe.prototype.transform.name} is called`, () => {
    const data = profileData[0];

    describe('and the given value is not a valid UUID v4', () => {
      it(`should throw ${UnprocessableEntityException.name}`, async () => {
        await expect(
          profileByIdPipe.transform('asdxxxasd', argumentMetaData),
        ).rejects.toThrow(UnprocessableEntityException);
      });
    });

    describe('and the given value a valid UUID v4', () => {
      let value: string;

      beforeEach(() => {
        value = uuidv4();
      });

      describe('and the profile is not found', () => {
        it(`should throw ${NotFoundException.name}`, async () => {
          jest.spyOn(profilesService, 'findById').mockResolvedValue(null);

          await expect(
            profileByIdPipe.transform(value, argumentMetaData),
          ).rejects.toThrow(NotFoundException);
        });
      });

      describe('and the profile is found', () => {
        it(`should return the profile`, async () => {
          jest.spyOn(profilesService, 'findById').mockResolvedValue(data);

          expect(
            await profileByIdPipe.transform(value, argumentMetaData),
          ).toStrictEqual(data);
        });
      });
    });
  });
});
