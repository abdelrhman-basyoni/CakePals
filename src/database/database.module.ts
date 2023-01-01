import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule,MongooseModuleAsyncOptions } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';
let dbName = process.env.DB_NAME;
if (process.env.NODE_ENV == 'test') {
    dbName = 'cakeTest'
}
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
      
                uri: configService.get<string>('NODE_ENV') === 'test'
                    ? configService.get<string>('DB_TEST_URL')
                    : configService.get<string>('DB_URL'),
                
            }),

            inject: [ConfigService]
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }