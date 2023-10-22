import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

const mockTrip = {
  name: 'New York City Trip',
  description: 'Beautiful memories of city that never sleeps.',
  destination: 'NYC',
  price: 40,
  places: 20,
};

describe('All Trips Controller', () => {
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

  it('(POST) - create new trip', async () => {
    return request(app.getHttpServer())
      .post('/all-trips')
      .send(mockTrip)
      .expect(201)
      .then((res) => {
        expect(res.body.description).toBe(
          'Beautiful memories of city that never sleeps.',
        );
      });
  });

  it('(GET) - get all trips', async () => {
    return request(app.getHttpServer())
      .get('/all-trips')
      .expect(200)
      .then((res) => {
        expect(res.body[0].destination).toEqual('NYC');
      });
  });
});
