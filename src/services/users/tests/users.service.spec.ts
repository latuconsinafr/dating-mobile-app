import { Test } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PinoLogger } from 'nestjs-pino';
import { mockedPinoLogger } from '../../../common/utils/mocks/nestjs-pino/pino-logger.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { mockedRepository } from '../../../common/utils/mocks/typeorm/repository.mock';
import { userData } from '../../../database/data/user.data';

describe(UsersService.name, () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PinoLogger,
          useValue: mockedPinoLogger,
        },
        { provide: getRepositoryToken(User), useValue: mockedRepository },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // * Create
  describe(`when ${UsersService.prototype.create.name} is called`, () => {
    const data = userData[0];

    beforeEach(() => {
      mockedRepository.create.mockReturnValue(data);
    });

    it('should return the created user', async () => {
      expect(await usersService.create(data)).toBe(data);
    });
  });

  // * Find all
  describe(`when ${UsersService.prototype.findAll.name} is called`, () => {
    const data = userData;

    beforeEach(() => {
      mockedRepository.find.mockResolvedValue(data);
    });

    it('should return array of users', async () => {
      expect(await usersService.findAll()).toStrictEqual(data);
    });
  });

  // * Find by id
  describe(`when ${UsersService.prototype.findById.name} is called`, () => {
    const data = userData[0];

    describe(`and the user is not found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await usersService.findById(data.id)).toBeNull();
      });
    });

    describe(`and the user is found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(data);
      });

      it('should return a user', async () => {
        expect(await usersService.findById(data.id)).toStrictEqual(data);
      });
    });
  });

  // * Find by username
  describe(`when ${UsersService.prototype.findByUsername.name} is called`, () => {
    const data = userData[0];

    describe(`and the user is not found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await usersService.findByUsername(data.username)).toBeNull();
      });
    });

    describe(`and the user is found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(data);
      });

      it('should return a user', async () => {
        expect(await usersService.findByUsername(data.username)).toStrictEqual(
          data,
        );
      });
    });
  });

  // * Find by email
  describe(`when ${UsersService.prototype.findByEmail.name} is called`, () => {
    const data = userData[0];

    describe(`and the user is not found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(null);
      });

      it('should return null', async () => {
        expect(await usersService.findByEmail(data.email)).toBeNull();
      });
    });

    describe(`and the user is found`, () => {
      beforeEach(() => {
        mockedRepository.findOne.mockResolvedValue(data);
      });

      it('should return a user', async () => {
        expect(await usersService.findByEmail(data.email)).toStrictEqual(data);
      });
    });
  });

  // * Update
  describe(`when ${UsersService.prototype.update.name} is called`, () => {
    const data = userData[0];

    beforeEach(() => {
      mockedRepository.update.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await usersService.update(data.id, data)).toBeTruthy();
    });
  });

  // * Delete
  describe(`when ${UsersService.prototype.delete.name} is called`, () => {
    const data = userData[0];

    beforeEach(() => {
      mockedRepository.delete.mockResolvedValue(true);
    });

    it('should return true', async () => {
      expect(await usersService.delete(data.id)).toBeTruthy();
    });
  });
});
