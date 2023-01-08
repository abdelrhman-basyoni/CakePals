import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { Connection, createConnection } from 'mongoose';
import { DatabaseModule } from './database/database.module';
import { CakeModule } from './modules/cake/cake.module';
import { OrderModule } from './modules/order/order.module';
import { CakeTypeModule } from './modules/cakeType/cakeType.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

const appModules = [
  UserModule,
  CakeModule,
  OrderModule,
  CakeTypeModule
  
]

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:true
    }),
    RedisModule.forRoot({
      config: { 

        url: process.env.REDIS_URL,
        username : process.env.REDIS_USERNAME,
        password : process.env.REDIS_PASSWORD
      },
    }),
    DatabaseModule,
    ...appModules


  ],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule {

}

