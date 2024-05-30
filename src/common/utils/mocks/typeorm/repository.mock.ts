export const mockedSelect = jest.fn().mockReturnThis();
export const mockedInnerJoinAndSelect = jest.fn().mockReturnThis();
export const mockedLeftJoin = jest.fn().mockReturnThis();
export const mockedSkip = jest.fn().mockReturnThis();
export const mockedTake = jest.fn().mockReturnThis();
export const mockedOrderBy = jest.fn().mockReturnThis();
export const mockedWhere = jest.fn().mockReturnThis();
export const mockedOrWhere = jest.fn().mockReturnThis();
export const mockedAndWhere = jest.fn().mockReturnThis();
export const mockedGetManyAndCount = jest.fn();
export const mockedGetRawMany = jest.fn();
export const mockedGetMany = jest.fn();

export const mockedRepository = {
  count: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  findBy: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    select: mockedSelect,
    innerJoinAndSelect: mockedInnerJoinAndSelect,
    leftJoin: mockedLeftJoin,
    skip: mockedSkip,
    take: mockedTake,
    orderBy: mockedOrderBy,
    where: mockedWhere,
    orWhere: mockedOrWhere,
    andWhere: mockedAndWhere,
    getManyAndCount: mockedGetManyAndCount,
    getRawMany: mockedGetRawMany,
    getMany: mockedGetMany,
  })),
};

export const mockedBrackets = {
  where: mockedWhere,
  orWhere: mockedOrWhere,
  andWhere: mockedAndWhere,
};
