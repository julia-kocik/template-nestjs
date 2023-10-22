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

describe('Favourites Controller', () => {
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
  describe('Unauthorized Requests', () => {
    it('(GET) - get favourite trips, should throw unauthorized', async () => {
      return request(app.getHttpServer()).get('/favourites').expect(401);
    });
    it('(GET) - get favourite trip by id, should throw unauthorized', () => {
      return request(app.getHttpServer())
        .get('/favourites/c894b2d0-1a24-465e-b470-34e7a391c40a')
        .expect(401);
    });
    it('(DELETE) - delete trip, should throw unauthorized', () => {
      return request(app.getHttpServer())
        .delete('/favourites/c894b2d0-1a24-465e-b470-34e7a391c40a')
        .expect(401);
    });
    it('(POST) - add to favourites, should throw unauthorized', () => {
      return request(app.getHttpServer())
        .post('/favourites/c894b2d0-1a24-465e-b470-34e7a391c40a')
        .send(mockTrip)
        .expect(401);
    });
    it('(PATCH) - update trip, should throw unauthorized', () => {
      return request(app.getHttpServer())
        .patch('/favourites/c894b2d0-1a24-465e-b470-/status')
        .send({ status: 'SOLD' })
        .expect(401);
    });
  });

  describe('Not Found Requests', () => {
    let jwtToken: string;

    it('(POST) - login the new user', async () => {
      const mockCredentialsDto = { username: 'user1', password: 'Test1234' };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockCredentialsDto)
        .expect(201)
        .then((res) => {
          jwtToken = res.body.accessToken;
        });
    });

    it('(POST) - add trip to favourites, should return not found', async () => {
      return request(app.getHttpServer())
        .post(`/favourites/1234`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(404);
    });

    it('(GET) - get favourite trip by id, should return not found', async () => {
      return request(app.getHttpServer())
        .get(`/favourites/1234`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(404);
    });

    it('(PATCH) - update trip, should return not found', async () => {
      return request(app.getHttpServer())
        .patch(`/favourites/1234/status`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send({ status: 'SOLD' })
        .expect(404);
    });

    it('(DELETE) - delete trip, should return not found', async () => {
      return request(app.getHttpServer())
        .delete(`/favourites/1234`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(404);
    });
  });

  describe('Authorized Requests', () => {
    let jwtToken: string;
    let tripId: string;
    let addedTripId: string;

    it('(POST) - login the new user', async () => {
      const mockCredentialsDto = { username: 'user2', password: 'Test1234' };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockCredentialsDto)
        .expect(201)
        .then((res) => {
          jwtToken = res.body.accessToken;
        });
    });

    it('(POST) - create new trip', async () => {
      return request(app.getHttpServer())
        .post('/all-trips')
        .send(mockTrip)
        .expect(201)
        .then((res) => {
          tripId = res.body.id;
          console.log(tripId);
        });
    });

    it('(POST) - add trip to favourites, should return successfully', async () => {
      return request(app.getHttpServer())
        .post(`/favourites/${tripId}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(201)
        .then((res) => {
          expect(res.body.description).toBe(
            'Beautiful memories of city that never sleeps.',
          );
          addedTripId = res.body.id;
        });
    });

    it('(GET) - get favourites, should return successfully', async () => {
      return request(app.getHttpServer())
        .get('/favourites')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body[0].description).toBe(
            'Beautiful memories of city that never sleeps.',
          );
        });
    });

    it('(GET) - get favourite trip by id, should return successfully', async () => {
      return request(app.getHttpServer())
        .get(`/favourites/${addedTripId}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body.description).toBe(
            'Beautiful memories of city that never sleeps.',
          );
        });
    });

    it('(PATCH) - update trip, should return successfully', async () => {
      return request(app.getHttpServer())
        .patch(`/favourites/${addedTripId}/status`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send({ status: 'SOLD' })
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('SOLD');
        });
    });

    it('(DELETE) - delete trip, should delete trip from favourites successfully', async () => {
      return request(app.getHttpServer())
        .delete(`/favourites/${addedTripId}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBeUndefined();
        });
    });
  });
});
