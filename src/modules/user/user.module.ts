import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy, JwtStrategyRefreshToken } from '../../guards/jwt.strategy';
import { config } from '../../shared/config';
import { CakeModule } from '../cake/cake.module';
import { OrderModule } from '../order/order.module';
import { RedisService } from '../cache/redis.service';
import { AuthService } from './auth.service';


@Module({
    imports: [

        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: async () => {
                    const schema = UserSchema;
                    return schema;
                },
            },
        ]),
        PassportModule,
        JwtModule.registerAsync({
            useFactory: () => ({

            }),

        }),

        forwardRef(() => CakeModule),
        forwardRef(() => OrderModule),


    ],
    controllers: [UserController],
    providers: [AuthService,UserService, JwtStrategy, JwtStrategyRefreshToken, RedisService],
    exports: [AuthService,UserService, JwtStrategy, JwtStrategyRefreshToken, RedisService]
})
export class UserModule { }