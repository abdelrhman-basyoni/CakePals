import { User, UserDocument } from "../../models/user.model";
import { Model, UpdateQuery, QueryOptions, Types } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from "../../dtos/login.dto";
import { TokenDto } from "../../dtos/token.dto";
import { messages } from "../../shared/responseCodes";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';
import { config } from "../../shared/config";
import { addTime, getRawTime, hashPassword } from "../../shared/utils";
import { UserRoles } from "../../enums/userRoles.enum";
import { CakeService } from "../cake/cake.service";
import { OrderService } from "../order/order.service";
import { OrderStatus } from "../../enums/order.enum";
import { Period } from "../../dtos/user.dto";
@Injectable()
export class UserService extends AbstractService<UserDocument> {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private cakeService: CakeService,
        private orderService: OrderService
    ) {
        super(userModel);
    }
    async create(req) {
        /**to follow the open closed princeple OCP */
        req.password = await hashPassword(req.password)
        const res = await super.create(req);
        res.password = undefined;
        return res

    }

    async login(body: LoginDto) {
        const user = await this.findOne({ email: body.email }, { password: 1, username: 1, email: 1, role: 1 })
        if (!user) {
            throw new UnauthorizedException('invalid user');
        }

        if (!await user.checkPassword(body.password)) {
            throw new UnauthorizedException('invalid user');
        }
        const payload: TokenDto = {
            _id: user._id,
            role: user.role

        }
        user.password = undefined; // remove the password
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                user: user,
                accessToken: await this.createAccessToken(payload),
                refreshToken: await this.createRefreshToken(payload),
            }
        }

    }


    async getAvailableCollectingTimes(bakerId: string, cakeId: string) {
        /**
         * calculate intial time is it now + baking time or is it toadys first time for the baker 
         */
        console.log({bakerId, cakeId});
        const baker = await this.findOne({ _id: new Types.ObjectId(bakerId), role: UserRoles.baker });
        const cake = await this.cakeService.findOneById(cakeId);

        let today = new Date();
        today.setHours(0, 0, 0, 0);
        const bakerTimeRange = baker.profile.collectionTimeRange;
        console.log(bakerTimeRange.start,bakerTimeRange.end)
        let bakerFirstCollectingTime = Number(addTime(bakerTimeRange.start.hours, bakerTimeRange.start.miutes, today));
        let bakerLastCollectingTime = Number(addTime(bakerTimeRange.end.hours, bakerTimeRange.end.miutes, today));

        const nowPlusBaking = Number(addTime(cake.bakingTime.hours, cake.bakingTime.miutes));

        let startTime: number;
        if (Number(nowPlusBaking) >= Number(bakerFirstCollectingTime)) {
            startTime = Number(nowPlusBaking)
        } else {
            startTime = Number(bakerFirstCollectingTime)
        }
        console.log({startTime,nowPlusBaking})
        /**
         * get all orders that is accepted and its endTime is greater than startTime
         * get it sorted based on its bakingStartTime ascending 
         */

        const orders = await this.orderService.findMany({
            'cake.baker': new Types.ObjectId(bakerId),
            status: OrderStatus.accepted,
            // bakingEndTime: { $gte: startTime }

        }, {}, { sort: { bakingStartTime: 1 } });

        console.log({orders})
        let availableTimes:Period[] = [];
        const bakingTime = getRawTime(cake.bakingTime.hours, cake.bakingTime.miutes)

        orders.forEach((order, index) => {
            let period:Period={
                start:0,
                end:0
            };
            if (index === 0) {
                /** if its the first element check it against the startTime */
                if (order.bakingStartTime <= startTime) {
                    period.start = order.bakingEndTime;
                } else {
                    period.start = startTime;
                    period.end = order.bakingStartTime
                }

            } else if (index === (orders.length - 1)) {
                /** time betweeen last order and baker  last collection time */
                period.start = order.bakingEndTime;
                period.end = bakerLastCollectingTime
            }
            else {
                period.start = order.bakingEndTime;
                period.end = orders[index + 1].bakingStartTime
            }

            /** calculate check if period is bigger than baking time of cake 
             * if bigger subtract baking time of cake and add the new period
             */

            const periodDiff = period.end - period.start;

            if (periodDiff > bakingTime) {
                period.start = period.start + bakingTime;
                availableTimes.push(period)
            }



        })
        if(availableTimes.length ==0){
            const period = {
                start:startTime,
                end : bakerLastCollectingTime
            }
            availableTimes.push(period)
        }
        return availableTimes ;

    }


    async createAccessToken(payload: TokenDto) {
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: config.accessTokenExpiresIn
        });
        return refreshToken;
    }

    async createRefreshToken(payload: TokenDto) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: config.refreshTokenExpiresIn
        });
        return accessToken;
    }
}