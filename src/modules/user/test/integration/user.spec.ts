process.env.NODE_ENV = 'test'
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { AllExceptionsFilter } from '../../../../shared/exception.filter';
import { DatabaseService } from "./../../../../database/database.service";
import { Connection } from "mongoose"
import { baker1, member1, member2, member2WithHashedPassword } from '../data/users';
import { removeKeys } from '../../../../shared/utils';
let app: INestApplication;
let dbConnection: Connection;
let httpServer: any;
beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, stopAtFirstError: true }));
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
describe('user controller basic endpoints  (e2e)', () => {
    /**
     * please Note that nestjs by default sets the HttpResponse code for post method to be 201
     * 
     */

    it('/ (register-memeber)', async () => {
        const res = await request(httpServer)
            .post('/user/register-member')
            .send(member1)
        return expect(res.statusCode).toBe(HttpStatus.CREATED);


    });
    it('/ (register-baker)', async () => {
        const res = await request(httpServer)
            .post('/user/register-baker')
            .send(baker1)
        expect(res.statusCode).toBe(HttpStatus.CREATED);
        const bakerNoPasword = removeKeys(['password'], baker1)

        expect(res.body.data.item).toMatchObject(bakerNoPasword);
        return;

    });

    it('/ (login)', async () => {
        await dbConnection.collection('users').insertOne(member2WithHashedPassword);
        const bakerNoPasword = removeKeys(['password'], baker1)
        const res = await request(httpServer)
            .post('/user/login')
            .send({
                email: member2.email,
                password: member2.password
            })

        expect(res.statusCode).toBe(HttpStatus.CREATED);
        expect(res.body.data.user).toMatchObject(bakerNoPasword);
        return;

    });
    
});
