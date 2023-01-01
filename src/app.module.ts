import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { Connection, createConnection } from 'mongoose';
import { DatabaseModule } from './database/database.module';
const appModules = [
  UserModule,
  
]
let dbName = process.env.DB_NAME;
if (process.env.NODE_ENV == 'Test') {
  dbName = 'cakeTest'
}

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
