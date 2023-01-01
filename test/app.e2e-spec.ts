process.env.NODE_ENV = 'test'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from '../src/shared/exception.filter';
import { DatabaseService } from "./../src/database/database.service";
import { Connection } from "mongoose"
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer:any;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist:true, stopAtFirstError:true}));
    app.useGlobalFilters(new AllExceptionsFilter());
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer()
    await app.init();

  })

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });
  afterEach(async () => {
    await app.close()
    // Close the server instance after each test
    httpServer.close()
  })
  it('/ (GET)', () => {
    return request(httpServer)
      .get('/')
      .expect(200)

  });
  it('/ (register-memeber)',  async () => {
     const res = await request(httpServer)
      .post('/user/register-member')
      .send({
        username: 'user',
        email: 'user@example.com',
        password:"password"
      })
      return expect(res.statusCode).toBe(201);
      

  });
});
