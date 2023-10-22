import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      const mockCredentialsDto = { username: 'user123', password: 'password' };
      const mockToken = '1234567';
      const serviceSpy = jest
        .spyOn(service, 'signUp')
        .mockImplementation(() => ({ accessToken: mockToken } as any));
      const result = await controller.createUser(mockCredentialsDto);
      expect(serviceSpy).toHaveBeenCalledWith(mockCredentialsDto);
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw ConflictException if error code is 23505', async () => {
      const mockCredentialsDto = { username: 'user123', password: 'password' };

      jest
        .spyOn(service, 'signUp')
        .mockImplementation(() => Promise.reject({ code: '23505' }));

      await expect(controller.createUser(mockCredentialsDto)).rejects.toThrow(
        new ConflictException('Username already exists'),
      );
    });

    it('should throw InternalServerError if error code is NOT 23505', async () => {
      const mockCredentialsDto = { username: 'user123', password: 'password' };

      jest
        .spyOn(service, 'signUp')
        .mockImplementation(() => Promise.reject({ code: '' }));

      await expect(controller.createUser(mockCredentialsDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  describe('signin', () => {
    it('should login a new user', async () => {
      const mockCredentialsDto = { username: 'user123', password: 'password' };
      const mockToken = '1234567';
      const serviceSpy = jest
        .spyOn(service, 'signIn')
        .mockImplementation(() => ({ accessToken: mockToken } as any));
      const result = await controller.signIn(mockCredentialsDto);
      expect(serviceSpy).toHaveBeenCalledWith(mockCredentialsDto);
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw InternalServerError if login fails', async () => {
      const mockCredentialsDto = { username: 'user123', password: 'password' };

      jest.spyOn(service, 'signIn').mockImplementation(() => Promise.reject());

      await expect(controller.signIn(mockCredentialsDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
