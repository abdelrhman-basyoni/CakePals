import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../models/order.model';

import { UserModule } from '../user/user.module';
import { CakeModule } from '../cake/cake.module';

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
    forwardRef(() => UserModule),
    CakeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
