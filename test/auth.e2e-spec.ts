import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [path.resolve(__dirname, '../src/**/*.entity{.ts,.js}')],
            synchronize: true,
            logging: false,
          }),
        }),
        AppModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await moduleFixture.close();
  });

  it('(POST) - register a new user', async () => {
    const mockCredentialsDto = { username: 'user123', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockCredentialsDto)
      .expect(201)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });

  it('(POST) - throws conflict exception if username already exists', async () => {
    const existingUserCredentials: AuthCredentialsDto = {
      username: 'existinguser',
      password: 'password',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(existingUserCredentials)
      .expect(201);

    const duplicateUserCredentials: AuthCredentialsDto = {
      username: 'existinguser',
      password: 'password',
    };
    const authService = app.get(AuthService);

    jest.spyOn(authService, 'signUp').mockRejectedValue({
      code: '23505',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(duplicateUserCredentials)
      .expect(409);

    expect(response.body.message).toBe('Username already exists');
  });

  it('(POST) - login the new user', async () => {
    const mockCredentialsDto = { username: 'user123', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(mockCredentialsDto)
      .expect(201)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });

  it('(POST) - throws error if user doesnt exist', async () => {
    const mockCredentialsDto = { username: 'user124', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(mockCredentialsDto)
      .expect(500);
  });
});
