process.env.NODE_ENV = 'test'
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { AllExceptionsFilter } from '../../../../shared/exception.filter';
import { DatabaseService } from "../../../../database/database.service";
import { Connection, Types } from "mongoose"
// import { baker1, member1, member2 } from '../data/users';
import { hashPassword, removeKeys, testSignToken } from '../../../../shared/utils';
import { bakerEx1, cakeEx1, memberEx1, createOrderEx1Hot, bakerTokenEx1, OrderEx1 } from '../data/order.data';
import { TokenTypes } from '../../../../enums/tokenTypes.enum';
import { OrderStatus } from '../../../../enums/order.enum';
let app: INestApplication;
let dbConnection: Connection;
let httpServer: any;
let bakerToken: string, memeberToken: string;
beforeAll(async () => {
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
    await Promise.all([
        dbConnection.collection('orders').deleteMany({}),
        dbConnection.collection('users').deleteMany({}),
        dbConnection.collection('cakes').deleteMany({}),
    ])

});
afterAll(async () => {
    await app.close()
    // Close the server instance after each test
    await httpServer.close()
})
beforeAll(async () => {
    memeberToken = await testSignToken({
        _id: memberEx1._id,
        role: memberEx1.role
    }, TokenTypes.access)
    bakerToken = await testSignToken({
        _id: bakerTokenEx1._id,
        role: bakerTokenEx1.role
    }, TokenTypes.access)
})
describe('order controller    (e2e)', () => {
    /**
     * please Note that nestjs by default sets the HttpResponse code for post method to be 201
     * 
     */
    describe('create Order ', () => {
        it('/ (order/create) valid', async () => {
            const baker = await dbConnection.collection('users').insertOne({
                ...bakerEx1, password: await hashPassword(bakerEx1.password)
            });
            const cake = await dbConnection.collection('cakes').insertOne({ ...cakeEx1, baker: new Types.ObjectId(baker.insertedId) })

            const res = await request(httpServer)
                .post('/order/create').set({
                    authorization: `Bearer ${memeberToken}`
                })
                .send({ ...createOrderEx1Hot, cake: cake.insertedId })

            return expect(res.statusCode).toBe(HttpStatus.CREATED);


        });

    })

    describe('respond to  Orders ', () => {
        it(' /Order/respondToOrder/:id accept', async () => {
            const order = await dbConnection.collection('orders').insertOne(OrderEx1);


            const res = await request(httpServer)
                .post(`/order/respondToOrder/${order.insertedId}`).set({
                    authorization: `Bearer ${bakerToken}`
                })
                .send({ response: OrderStatus.accepted })

            return expect(res.statusCode).toBe(HttpStatus.CREATED);


        });
        it('/Order/respondToOrders/id reject', async () => {
            const order = await dbConnection.collection('orders').insertOne(OrderEx1);


            const res = await request(httpServer)
                .post(`/order/respondToOrder/${order.insertedId}`).set({
                    authorization: `Bearer ${bakerToken}`
                })
                .send({ response: OrderStatus.rejected })

            return expect(res.statusCode).toBe(HttpStatus.CREATED);


        });

    })


    describe('collect  order ', () => {
        it('/Order/collectOrder/:id valid', async () => {
            const baker = await dbConnection.collection('users').insertOne(bakerEx1)
            const order = await dbConnection.collection('orders').insertOne({ ...OrderEx1, cake: { ...cakeEx1, baker: baker.insertedId }, status: OrderStatus.accepted });
     
            let bakerToken2 = await testSignToken({
                _id: baker.insertedId.toString(),
                role: bakerTokenEx1.role
            }, TokenTypes.access)
            const res = await request(httpServer)
                .post(`/order/collectOrder/${order.insertedId}`).set({
                    authorization: `Bearer ${bakerToken2}`
                })
                .send({ code: OrderEx1.collectionCode })

            return expect(res.statusCode).toBe(HttpStatus.CREATED);


        });
        it('/Order/collectOrder/:id invalid', async () => {
            const baker = await dbConnection.collection('users').insertOne(bakerEx1)
            const order = await dbConnection.collection('orders').insertOne({ ...OrderEx1, cake: { ...cakeEx1, baker: baker.insertedId }, status: OrderStatus.accepted });
     
            let bakerToken2 = await testSignToken({
                _id: baker.insertedId.toString(),
                role: bakerTokenEx1.role
            }, TokenTypes.access)
            const res = await request(httpServer)
                .post(`/order/collectOrder/${order.insertedId}`).set({
                    authorization: `Bearer ${bakerToken2}`
                })
                .send({ code: 123256 })

            return expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);


        });

    })


    
    describe('rate  ', () => {
    })


});
