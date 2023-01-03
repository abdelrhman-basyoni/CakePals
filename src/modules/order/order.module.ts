import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../models/order.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { config } from '../../shared/config';


@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Order.name,
                useFactory: async () => {
                    const schema = OrderSchema;
                    return schema;
                },
            },
        ]),

    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})
export class OrderModule { }