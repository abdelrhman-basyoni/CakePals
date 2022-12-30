import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

const appModules = [
  UserModule
]
@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      process.env.DB_URL,
      {
        dbName: process.env.DB_NAME,


        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('DB is connected');
          });
          connection.on('disconnected', () => {
            console.log('DB disconnected');
          });
          connection.on('error', (error) => {
            console.log('DB connection failed! for error: ', error);
          });
          return connection;
        },
      },
    ),

    ...appModules

    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
