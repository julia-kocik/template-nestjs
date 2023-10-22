import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { ConfigModule } from '@nestjs/config';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from './jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockPayload: JwtPayload = {
  username: 'user2',
};

const mockUser: User = {
  id: '123',
  username: 'user2',
  password: 'Test1234',
  trips: [],
};

describe('Jwt strategy', () => {
  let repository: UserRepository;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    process.env.JWT_SECRET = '12345';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), // Add ConfigModule.forRoot() to provide the ConfigService
      ],
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    repository = module.get(getRepositoryToken(UserRepository));
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(jwtStrategy).toBeDefined();
  });

  describe('JWT Strategy', () => {
    it('should return user when successfully validated', async () => {
      const repoSpy = jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => mockUser as any);
      const result = await jwtStrategy.validate(mockPayload);
      expect(repoSpy).toHaveBeenCalledWith({
        where: mockPayload,
      });
      expect(result).toBe(mockUser);
    });

    it('should should throw unauthorized exception when no user found', async () => {
      const mockError = new UnauthorizedException();
      const repoSpy = jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(mockError);
      expect(repoSpy).toHaveBeenCalledWith({
        where: mockPayload,
      });
      await expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(
        mockError,
      );
    });
  });
});
