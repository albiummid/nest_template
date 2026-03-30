import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect(
          (res: { body: { success: boolean; data: { status: string } } }) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('ok');
          },
        );
    });
  });

  describe('Auth Endpoints', () => {
    it('/api/auth/register (POST) - should validate password strength', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak', // Weak password
        })
        .expect(400)
        .expect((res: { body: { success: boolean; message: string } }) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Validation failed');
        });
    });
  });
});
