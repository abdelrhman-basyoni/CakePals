process.env.NODE_ENV = 'test'
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { AllExceptionsFilter } from '../../../../shared/exception.filter';
import { DatabaseService } from "../../../../database/database.service";
import { Connection, Types } from "mongoose"

import { hashPassword, removeKeys, testSignToken } from '../../../../shared/utils';
import { cake1, cakeBaker } from '../data/cake.testData';
import { TokenTypes } from '../../../../enums/tokenTypes.enum';
import { UserRoles } from '../../../../enums/userRoles.enum';
let app: INestApplication;
let dbConnection: Connection;
let httpServer: any;
let token;
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

    await dbConnection.collection('cakes').deleteMany({});

})

beforeAll(async () => {
    token = await testSignToken({
        _id: cakeBaker._id,
        role: UserRoles.baker
    }, TokenTypes.access)

});
afterEach(async () => {
    await app.close()
    // Close the server instance after each test
    await httpServer.close()
})
describe('cake controller basic endpoints  (e2e)', () => {
    /**
     * please Note that nestjs by default sets the HttpResponse code for post method to be 201
     * 
     */
    describe('create', () => {



        it('create new cake valid', async () => {

            const res = await request(httpServer)
                .post('/cake/create')
                .set({
                    authorization: `Bearer ${token}`
                })
                .send(cake1)
            expect(res.statusCode).toBe(HttpStatus.CREATED);
            return;
            // return 



        })
        it('create new cake invalid cake  price', async () => {

            const res = await request(httpServer)
                .post('/cake/create')
                .set({
                    authorization: `Bearer ${token}`
                })
                .send({ ...cake1, price: -100 })
            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            return;
            // return 



        })

    })

    describe('findOne', () => {
        it('find one valid', async () => {
            const cake = await dbConnection.collection('cakes').insertOne({
                ...cake1, baker: new Types.ObjectId(cakeBaker._id)
            });
            const res = await request(httpServer)
                .get(`/cake/findone/${cake.insertedId}`)
            expect(res.statusCode).toBe(HttpStatus.OK);
            return;
        })
        it('find one invalid id', async () => {

            const res = await request(httpServer)
                .get(`/cake/findone/63b2cf6bed8bcdce0482fa29`)
            expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
            return;
        })
    })
    describe('delete One', () => {
        it('delete one valid', async () => {
            const cake = await dbConnection.collection('cakes').insertOne({
                ...cake1, baker: new Types.ObjectId(cakeBaker._id)
            });
            const res = await request(httpServer)
                .delete(`/cake/deleteone/${cake.insertedId}`)
                .set({
                    authorization: `Bearer ${token}`
                })
            expect(res.statusCode).toBe(HttpStatus.OK);
            return;
        })
        it('delete one invalid id', async () => {

            const res = await request(httpServer)
                .delete(`/cake/deleteone/63b2cf6bed8bcdce0482fa29`)
                .set({
                    authorization: `Bearer ${token}`
                })
            expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
            return;
        })
    })


});