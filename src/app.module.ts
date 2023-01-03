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
    DatabaseModule,
    ...appModules


  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {
  // private readonly connection: Connection;
  // constructor() {
  //   this.connection = createConnection();
  // }

  // onApplicationShutdown(signal: string) {
  //   if(process.env.NODE_ENV == 'Test'){
  //     this.connection.dropDatabase();
  //   }
  //   this.connection.close();
  // }
}

