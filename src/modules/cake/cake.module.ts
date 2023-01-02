import { Module } from '@nestjs/common';
import { CakeService } from './cake.service';
import { CakeController } from './cake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cake, CakeSchema } from '../../models/cake.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { config } from '../../shared/config';


@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Cake.name,
                useFactory: async () => {
                    const schema = CakeSchema;
                    return schema;
                },
            },
        ]),

    ],
    controllers: [CakeController],
    providers: [CakeService],
    exports: [CakeService]
})
export class CakeModule { }